// Tipos das trilhas (G4 Skills e Internas). Os dados ficam no banco (trilhas e trilha_cursos) e são editados
// em /admin/trilhas-g4 e /admin/trilhas-internas. A ordem dos cursos é a ordem do passo a passo.

export type Curso = {
  titulo: string;
  emoji?: string;
  url: string;
  /** Resumo curto (usado nas Trilhas Internas) */
  descricao?: string;
  /** Vídeo, Texto, PDF... (usado nas Trilhas Internas) */
  formatos?: string[];
};
export type Trilha = { slug: string; nome: string; area: string; cursos: Curso[] };

/** Entrada da plataforma G4 Skills */
export const G4_URL = "https://online.g4business.com/";
