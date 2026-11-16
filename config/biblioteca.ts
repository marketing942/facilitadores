// Tipo dos livros da Biblioteca. O catálogo fica no banco (tabela livros) e é editado em /admin/biblioteca.
// Os PDFs NÃO ficam no sistema: o botão "Ler no Notion" abre a página do livro no Notion da CPPEM.

export type Livro = {
  slug: string;
  titulo: string;
  autor: string;
  categorias: string[];
  /** O que o livro entrega */
  objetivos: string[];
  /** Para quem é */
  publico: string[];
  /** Página do livro na Biblioteca Gratuita do Notion, onde fica o PDF (exige acesso ao Notion da CPPEM) */
  notion: string;
  /** Busca do livro na Amazon */
  compra: string;
  preenchido?: boolean;
  /** Endereço da capa. Vazio: usa /biblioteca/<slug>.jpg */
  capa?: string | null;
};
