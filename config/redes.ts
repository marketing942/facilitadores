// Redes sociais de cada BU. Fonte: rodapé do site de vagas (vagas.cppem.com.br).
// Para incluir ou trocar uma rede, edite a lista da BU.

export type SocialKey = "instagram" | "youtube" | "tiktok" | "threads" | "facebook" | "x" | "linkedin" | "whatsapp";

export type Rede = { key: SocialKey; label: string; perfil: string; url: string };
export type BuRedes = { id: string; nome: string; descricao: string; site?: { label: string; url: string }; redes: Rede[] };

export const REDES: BuRedes[] = [
  {
    id: "cppem",
    nome: "CPPEM Concursos",
    descricao: "Cursos e preparação para concursos públicos",
    site: { label: "cppem.com.br", url: "https://cppem.com.br" },
    redes: [
      { key: "instagram", label: "Instagram", perfil: "@cppemconcursos", url: "https://www.instagram.com/cppemconcursos/" },
      { key: "youtube", label: "YouTube", perfil: "@cppemconcursos", url: "https://www.youtube.com/@cppemconcursos" },
      { key: "tiktok", label: "TikTok", perfil: "@cppemconcursos", url: "https://www.tiktok.com/@cppemconcursos" },
      { key: "threads", label: "Threads", perfil: "@cppemconcursos", url: "https://www.threads.net/@cppemconcursos" },
      { key: "facebook", label: "Facebook", perfil: "Cppem Cursos preparatórios", url: "https://www.facebook.com/people/Cppem-Cursos-preparat%C3%B3rios/61550943416378/" },
      { key: "x", label: "X", perfil: "@cppem_concursos", url: "https://x.com/cppem_concursos" },
      { key: "linkedin", label: "LinkedIn", perfil: "CPPEM", url: "https://www.linkedin.com/company/cppem" },
    ],
  },
  {
    id: "colegio",
    nome: "Colégio CPPEM",
    descricao: "Educação que forma para a vida",
    site: { label: "colegio.cppem.com.br", url: "https://colegio.cppem.com.br" },
    redes: [
      { key: "instagram", label: "Instagram", perfil: "@colegiocppem", url: "https://www.instagram.com/colegiocppem/" },
      { key: "youtube", label: "YouTube", perfil: "@colegiocppem", url: "https://www.youtube.com/@colegiocppem" },
      { key: "tiktok", label: "TikTok", perfil: "@colegiocppem", url: "https://www.tiktok.com/@colegiocppem" },
      { key: "threads", label: "Threads", perfil: "@colegiocppem", url: "https://www.threads.com/@colegiocppem" },
    ],
  },
  {
    id: "unicive",
    nome: "Unicive Caruaru",
    descricao: "Ensino superior EAD",
    site: { label: "unicive.cppem.com.br", url: "https://unicive.cppem.com.br" },
    redes: [
      { key: "instagram", label: "Instagram", perfil: "@unicive.caruaru", url: "https://www.instagram.com/unicive.caruaru" },
      { key: "tiktok", label: "TikTok", perfil: "@unicive.caruaru", url: "https://www.tiktok.com/@unicive.caruaru" },
      { key: "threads", label: "Threads", perfil: "@unicive.caruaru", url: "https://www.threads.com/@unicive.caruaru" },
      { key: "facebook", label: "Facebook", perfil: "Unicive Caruaru", url: "https://www.facebook.com/profile.php?id=61558200731928" },
    ],
  },
];
