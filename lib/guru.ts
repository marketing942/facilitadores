import "server-only";

// Minimal client for the Digital Manager Guru API v2 (read-only).
// Docs: https://docs.digitalmanager.guru/developers

const BASE_URL = "https://digitalmanager.guru/api/v2";
// Guru allows ~360 requests per minute; 6 parallel calls keep a full sync well below that.
const CONCURRENCY = 6;
const MAX_ATTEMPTS = 8;
/** Janela da cota da Guru (x-ratelimit-limit por 60s). */
const WINDOW_MS = 61_000;
/** Margem: ao chegar perto do fim da cota, espera a janela virar. */
const RESERVE = 8;

export type GuruProduct = {
  id: string;
  name: string;
  type: "product" | "plan" | "eticket" | string;
  is_hidden: number;
  group?: { id: string; name: string } | null;
  producer?: { id: string; name: string } | null;
  updated_at: number;
};

export type GuruOffer = {
  id: string;
  name: string;
  checkout_url: string;
  friendly_url: string;
  is_active: number;
  value: number;
  original_value: number;
  cash_discount: number;
  currency: string;
  payment_types: string[];
  installments?: {
    default?: number;
    interest_rate?: number;
    max_with_interest?: number;
    max_without_interest?: number;
    type?: "flat" | string;
  } | null;
  plan?: {
    cycles?: number;
    interval?: number;
    interval_type?: "day" | "month" | "year" | string;
    trial_days?: number;
  } | null;
  updated_at: number;
};

type Page<T> = {
  data: T[];
  has_more_pages: number;
  next_cursor: string | null;
};

function token() {
  const value = process.env.GURU_API_TOKEN;
  if (!value) throw new Error("GURU_API_TOKEN não configurado.");
  return value;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Cota da Guru: 360 chamadas por janela de ~60s, contadas do lado do servidor.
 * Um sync completo usa ~280, então dois seguidos (outro processo, outra instância)
 * estouram a cota. Em vez de adivinhar, seguimos o x-ratelimit-remaining que vem
 * em cada resposta: quando ele está no fim, todas as chamadas pausam juntas até a
 * janela virar. É isso que evita o 429 em vez de simplesmente falhar.
 */
let pausedUntil = 0;

async function waitForQuota() {
  const waitMs = pausedUntil - Date.now();
  if (waitMs > 0) await sleep(waitMs);
}

function noteQuota(res: Response) {
  const remaining = Number(res.headers.get("x-ratelimit-remaining"));
  if (Number.isFinite(remaining) && remaining <= RESERVE) {
    pausedUntil = Math.max(pausedUntil, Date.now() + WINDOW_MS);
  }
}

async function request<T>(path: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    await waitForQuota();
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" },
      cache: "no-store",
    });
    noteQuota(res);
    if (res.ok) return (await res.json()) as T;

    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= MAX_ATTEMPTS) {
      throw new Error(`Guru respondeu ${res.status} em ${path}`);
    }
    // 429: a cota da janela acabou (possivelmente gasta por outra instância).
    // Pausa todas as chamadas em andamento até a janela virar.
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait = res.status === 429
      ? (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : WINDOW_MS)
      : attempt * 2000 + Math.random() * 500;
    if (res.status === 429) pausedUntil = Math.max(pausedUntil, Date.now() + wait);
    await sleep(wait);
  }
}

async function listAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | null = null;
  do {
    const sep = path.includes("?") ? "&" : "?";
    const page: Page<T> = await request(cursor ? `${path}${sep}cursor=${encodeURIComponent(cursor)}` : path);
    items.push(...page.data);
    cursor = page.has_more_pages ? page.next_cursor : null;
  } while (cursor);
  return items;
}

async function mapLimit<T, R>(list: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(list.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (next < list.length) {
        const index = next++;
        results[index] = await fn(list[index]);
      }
    }),
  );
  return results;
}

export type ProductWithOffers = { product: GuruProduct; offers: GuruOffer[] };

async function syncAll(): Promise<ProductWithOffers[]> {
  // Traz TODOS os produtos, inclusive os ocultos no catálogo da Guru: muitos deles ainda
  // têm ofertas ativas que a equipe usa (aulões, camisas de operação). Elas entram no site
  // marcadas como arquivadas; a oferta inativa é que fica de fora.
  const products = await listAll<GuruProduct>("/products");
  return mapLimit(products, CONCURRENCY, async (product) => ({
    product,
    offers: await listAll<GuruOffer>(`/products/${product.id}/offers`),
  }));
}

let inFlight: Promise<ProductWithOffers[]> | null = null;

/**
 * Todos os produtos com suas ofertas (~510 chamadas, ~2 janelas de cota).
 * Um sync por vez no processo: dois em paralelo estouram o limite da Guru (360/min).
 */
export function fetchProductsWithOffers(): Promise<ProductWithOffers[]> {
  inFlight ??= syncAll().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
