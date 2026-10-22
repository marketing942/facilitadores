import "server-only";

import { unstable_cache } from "next/cache";
import { DESTAQUES } from "@/config/destaques";
import { fetchProductsWithOffers, type GuruOffer, type GuruProduct } from "@/lib/guru";

export const CATALOG_TAG = "catalogo-guru";

export type Brand = "CPPEM" | "Colégio" | "Unicive";

export type CatalogItem = {
  id: string;
  name: string;
  product: string;
  brand: Brand;
  url: string;
  slug: string;
  value: number;
  /** Largest installment plan the checkout offers, e.g. 12x of 204.16. */
  installments: { count: number; value: number; interestFree: boolean } | null;
  /** Recurring offers: charge per cycle. */
  plan: { every: string; cycles: number | null } | null;
  pixDiscount: number;
  type: string;
  featured: boolean;
  /** Produto oculto no catálogo da Guru: a oferta funciona, mas não é mais divulgada. */
  archived: boolean;
  updatedAt: number;
};

export type Catalog = {
  items: CatalogItem[];
  /** Momento da alteração mais recente feita na Guru (epoch em segundos). */
  lastChangeAt: number;
};

function brandOf(product: GuruProduct, url: string): Brand {
  const owner = `${product.group?.name ?? ""} ${product.producer?.name ?? ""}`;
  if (/col[eé]gio/i.test(owner) || /\/\/colegio\./i.test(url)) return "Colégio";
  if (/unic/i.test(owner) || /\/\/unicv\./i.test(url)) return "Unicive";
  return "CPPEM";
}

// Mirrors how the Guru checkout prices installments: "flat" adds rate×n to the total.
function installmentsOf(offer: GuruOffer): CatalogItem["installments"] {
  const rules = offer.installments ?? {};
  const count = rules.max_with_interest ?? 1;
  if (count <= 1 || !offer.value) return null;

  const rate = (rules.interest_rate ?? 0) / 100;
  const interestFree = count <= (rules.max_without_interest ?? 1) || rate < 0.001;
  if (interestFree) return { count, value: offer.value / count, interestFree: true };

  const total = rules.type === "flat" || !rules.type
    ? offer.value * (1 + rate * count)
    : (offer.value * rate * count) / (1 - Math.pow(1 + rate, -count));
  return { count, value: total / count, interestFree: false };
}

function planOf(offer: GuruOffer): CatalogItem["plan"] {
  const plan = offer.plan;
  if (!plan) return null;
  const interval = plan.interval ?? 1;
  const unit = plan.interval_type ?? "month";
  let every: string;
  if (unit === "day" && interval % 30 === 0) every = interval === 30 ? "mês" : `${interval / 30} meses`;
  else if (unit === "month") every = interval === 1 ? "mês" : `${interval} meses`;
  else if (unit === "year") every = interval === 1 ? "ano" : `${interval} anos`;
  else every = `${interval} dias`;
  return { every, cycles: plan.cycles || null };
}

// Nomes de oferta como "OFERTA 01" ou "MATRÍCULA" não dizem nada sozinhos:
// nesses casos o nome do produto vem na frente.
const GENERIC_OFFER = /^(oferta|matr[ií]cula|plano|padr[aã]o|default|principal)\b/i;

function displayName(product: string, offer: string) {
  const clean = (value: string) => value.replace(/\s+/g, " ").trim();
  const productName = clean(product);
  const offerName = clean(offer);
  if (!offerName) return productName;
  if (!productName || offerName.toUpperCase() === productName.toUpperCase()) return offerName;
  return GENERIC_OFFER.test(offerName) ? `${productName} · ${offerName}` : offerName;
}

function toItem(product: GuruProduct, offer: GuruOffer, featured: Set<string>): CatalogItem {
  const url = offer.checkout_url.replace(/\/$/, "");
  const slug = offer.friendly_url || url.split("/pay/")[1] || offer.id;
  const name = displayName(product.name, offer.name);
  return {
    id: offer.id,
    name,
    product: product.name.replace(/\s+/g, " ").trim(),
    brand: brandOf(product, url),
    url,
    slug,
    value: offer.value,
    installments: installmentsOf(offer),
    plan: planOf(offer),
    pixDiscount: offer.cash_discount ?? 0,
    type: product.type,
    featured: featured.has(slug),
    archived: Boolean(product.is_hidden),
    updatedAt: Math.max(offer.updated_at ?? 0, product.updated_at ?? 0),
  };
}

async function buildCatalog(): Promise<Catalog> {
  const featured = new Set(DESTAQUES);
  const items = (await fetchProductsWithOffers())
    .flatMap(({ product, offers }) =>
      offers
        .filter((offer) => offer.is_active && offer.checkout_url)
        .map((offer) => toItem(product, offer, featured)),
    )
    // arquivadas vão para o fim da lista
    .sort((a, b) => Number(a.archived) - Number(b.archived) || a.name.localeCompare(b.name, "pt-BR"));

  const lastChangeAt = items.reduce((newest, item) => Math.max(newest, item.updatedAt), 0);
  return { items, lastChangeAt };
}

/**
 * Catálogo inteiro da Guru, guardado no Data Cache por 10 minutos e compartilhado por
 * todas as instâncias. Sem webhook: uma oferta nova ou alterada entra na próxima renovação.
 * O botão "Atualizar agora" invalida a tag e força uma sincronização na hora.
 */
// A chave leva uma versão: o Data Cache sobrevive a deploys, então mudanças no formato
// do item (nome, campos novos) precisam invalidar o que está guardado.
export const getCatalog = unstable_cache(buildCatalog, ["catalogo-guru", "v3"], {
  revalidate: 600,
  tags: [CATALOG_TAG],
});
