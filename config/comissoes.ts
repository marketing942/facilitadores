// Regras da Calculadora de Comissões (/comissoes). Valores em CENTAVOS para não haver erro de arredondamento.
// Para mudar uma regra (valor por matrícula, bônus, valor por aluno recuperado), edite só este arquivo.

export const REGRAS = {
  colegio: {
    /** R$ 25,00 fixos por matrícula */
    porMatriculaCentavos: 2500,
    /** R$ 100,00 de bônus a cada grupo COMPLETO de 10 matrículas */
    bonusCentavos: 10000,
    matriculasPorBonus: 10,
  },
  suporte: {
    /** R$ 30,00 por aluno recuperado (editável em cada colaborador) */
    porAlunoCentavos: 3000,
  },
};

export type Categoria = "cppem" | "colegio" | "suporte" | "unicive";

export const CATEGORIAS: { id: Categoria; titulo: string; botao: string }[] = [
  { id: "cppem", titulo: "CPPEM", botao: "+ Adicionar colaborador CPPEM" },
  { id: "colegio", titulo: "COLÉGIO CPPEM", botao: "+ Adicionar colaborador do Colégio" },
  { id: "suporte", titulo: "SUPORTE — ALUNOS RECUPERADOS", botao: "+ Adicionar colaborador de recuperados" },
  { id: "unicive", titulo: "UNICIVE", botao: "+ Adicionar colaborador UNICIVE" },
];
