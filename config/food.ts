// Food Service: onde comer no CPPEM. Os horários alimentam o selo "Provavelmente ativa".
// Dias: 0 = domingo ... 6 = sábado. Horários no fuso de Recife.

export type Janela = { dias: number[]; inicio: string; fim: string };

export type Local = {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  /** Texto dos horários, como aparece na tela */
  horarioTexto: string;
  janelas: Janela[];
  link?: { label: string; url: string };
};

const SEG_SEX = [1, 2, 3, 4, 5];

export const LOCAIS: Local[] = [
  {
    id: "la-cozzina",
    nome: "La Cozzina",
    tipo: "Restaurante parceiro",
    descricao: "Ótimo para almoço e marmitas, com entrega no CPPEM.",
    horarioTexto: "Pedidos das 8h às 11h · segunda a sexta",
    janelas: [{ dias: SEG_SEX, inicio: "08:00", fim: "11:00" }],
    link: { label: "Pedir pelo WhatsApp", url: "https://wa.me/5581998036171" },
  },
  {
    id: "cantina-diurna",
    nome: "Cantina diurna",
    tipo: "Lanches no prédio",
    descricao: "Cantina de lanches dentro do prédio, de manhã e à tarde.",
    horarioTexto: "Das 8h30 às 9h (aprox.) e das 15h30 às 16h · segunda a sexta",
    janelas: [
      { dias: SEG_SEX, inicio: "08:30", fim: "09:00" },
      { dias: SEG_SEX, inicio: "15:30", fim: "16:00" },
    ],
    link: { label: "Chamar no WhatsApp", url: "https://wa.me/5581993979592" },
  },
  {
    id: "cantina-noturna",
    nome: "Cantina noturna",
    tipo: "Lanches no prédio",
    descricao: "Cantina de lanches dentro do prédio, à noite.",
    horarioTexto: "Das 20h20 às 22h · segunda a sexta",
    janelas: [{ dias: SEG_SEX, inicio: "20:20", fim: "22:00" }],
    link: { label: "Chamar no WhatsApp", url: "https://wa.me/5581992904051" },
  },
];

export const APPS = [
  { nome: "iFood", descricao: "Delivery de restaurantes e mercados", url: "https://www.ifood.com.br/", logo: "/logos/ifood.svg" },
  { nome: "99Food", descricao: "Delivery de comida e bebidas", url: "https://99app.com/99food/", logo: "/logos/99food.svg" },
];
