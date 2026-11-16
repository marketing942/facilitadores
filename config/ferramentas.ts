// Tipos e setores da aba Ferramentas. Os acessos ficam no banco (tabela ferramentas) e são editados em /admin/ferramentas.
// A tag "Todas" faz o item aparecer em qualquer filtro.

export const SETORES = ["Comercial", "Gestão", "Marketing", "Pedagógico", "RH", "Tecnologia"] as const;
export type Setor = (typeof SETORES)[number];
export type Tag = Setor | "Todas";

export type Ferramenta = { id: string; nome: string; descricao: string; url: string; tags: Tag[] };
