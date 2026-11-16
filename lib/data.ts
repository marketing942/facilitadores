import "server-only";

import { unstable_cache } from "next/cache";
import type { Bu, Channel, Kind, ServiceLink } from "@/config/atendimento";
import type { Livro } from "@/config/biblioteca";
import { EMPRESA_VAZIA, type Empresa, type Telefone } from "@/config/empresa";
import type { Ferramenta, Tag } from "@/config/ferramentas";
import type { BuRedes, SocialKey } from "@/config/redes";
import type { Trilha } from "@/config/trilhas";
import type { WifiInterna, WifiVisitantes } from "@/config/wifi";
import { getSetting, query } from "@/lib/db";
import { TAGS } from "@/lib/tags";

// Leitura dos dados editáveis pelo painel /admin. Cada grupo tem uma tag de cache: ao salvar no painel,
// a tag é invalidada (app/admin/actions.ts) e a página já mostra o dado novo. Sem edição, renova a cada 1 hora.


const cached = <T,>(fn: () => Promise<T>, key: string, tag: string) =>
  unstable_cache(fn, ["dados", key, "v1"], { revalidate: 3600, tags: [tag] });

export const getAtendimento = cached(async (): Promise<ServiceLink[]> => {
  const rows = await query<{ id: string; bu: Bu; kind: Kind; channel: Channel; url: string; photo: string }>(
    "select id, bu, kind, channel, url, photo from atendimento_links where ativo order by position, bu, kind",
  );
  return rows.map((r) => ({ ...r, title: `${r.kind} ${r.channel}` }));
}, "atendimento", TAGS.atendimento);

export const getEmpresa = cached(async (): Promise<{ empresa: Empresa; telefones: Telefone[] }> => {
  const empresa = { ...EMPRESA_VAZIA, ...((await getSetting<Empresa>("empresa")) ?? {}) };
  const telefones = await query<Telefone>("select id, nome, exibicao, digitos, whatsapp from telefones order by position, nome");
  return { empresa, telefones };
}, "empresa", TAGS.empresa);

export const getWifiVisitantes = cached(
  async (): Promise<WifiVisitantes> => (await getSetting<WifiVisitantes>("wifi_visitantes")) ?? { nome: "", senha: "" },
  "wifi-visitantes",
  TAGS.wifi,
);

/** SEM cache: as senhas internas só são lidas depois de conferir a senha da equipe (lib/auth.ts). */
export async function getWifiInternas(): Promise<WifiInterna[]> {
  return query<WifiInterna>("select id, nome, senha from wifi_redes order by position, nome");
}

export const getRedes = cached(async (): Promise<BuRedes[]> => {
  const bus = await query<{ id: string; slug: string; nome: string; descricao: string; site_label: string | null; site_url: string | null }>(
    "select id, slug, nome, descricao, site_label, site_url from redes_bus order by position, nome",
  );
  const redes = await query<{ bu_id: string; key: SocialKey; label: string; perfil: string; url: string }>(
    "select bu_id, key, label, perfil, url from redes order by position, label",
  );
  return bus.map((bu) => ({
    id: bu.slug,
    nome: bu.nome,
    descricao: bu.descricao,
    site: bu.site_url ? { label: bu.site_label || bu.site_url, url: bu.site_url } : undefined,
    redes: redes.filter((r) => r.bu_id === bu.id).map(({ key, label, perfil, url }) => ({ key, label, perfil, url })),
  }));
}, "redes", TAGS.redes);

export const getFerramentas = cached(async (): Promise<Ferramenta[]> => {
  return query<Ferramenta>("select id, nome, descricao, url, tags::text[] as tags from ferramentas order by position, nome") as Promise<Ferramenta[]>;
}, "ferramentas", TAGS.ferramentas);

export const getLivros = cached(async (): Promise<{ livros: Livro[]; categorias: string[] }> => {
  const livros = await query<Livro>(
    "select slug, titulo, autor, categorias, objetivos, publico, notion, compra, preenchido, capa from livros order by position, titulo",
  );
  const categorias = [...new Set(livros.flatMap((l) => l.categorias))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  return { livros, categorias };
}, "livros", TAGS.biblioteca);

export type TrilhaTipo = "g4" | "interna";

export function getTrilhas(tipo: TrilhaTipo) {
  return cached(async (): Promise<{ trilhas: Trilha[]; areas: string[] }> => {
    const trilhas = await query<{ id: string; slug: string; nome: string; area: string }>(
      "select id, slug, nome, area from trilhas where tipo = $1 order by position, nome",
      [tipo],
    );
    const cursos = await query<{ trilha_id: string; titulo: string; emoji: string | null; url: string; descricao: string | null; formatos: string[] }>(
      "select c.trilha_id, c.titulo, c.emoji, c.url, c.descricao, c.formatos from trilha_cursos c join trilhas t on t.id = c.trilha_id where t.tipo = $1 order by c.position, c.titulo",
      [tipo],
    );
    const lista: Trilha[] = trilhas.map((t) => ({
      slug: t.slug,
      nome: t.nome,
      area: t.area,
      cursos: cursos
        .filter((c) => c.trilha_id === t.id)
        .map((c) => ({
          titulo: c.titulo,
          url: c.url,
          ...(c.emoji ? { emoji: c.emoji } : {}),
          ...(c.descricao ? { descricao: c.descricao } : {}),
          ...(c.formatos.length ? { formatos: c.formatos } : {}),
        })),
    }));
    // as áreas aparecem na ordem em que surgem nas trilhas
    return { trilhas: lista, areas: [...new Set(lista.map((t) => t.area))] };
  }, `trilhas-${tipo}`, TAGS.trilhas)();
}

export type { Tag };
