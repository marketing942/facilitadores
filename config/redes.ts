// Tipos das Redes sociais. Os dados ficam no banco (redes_bus e redes) e são editados em /admin/redes.

export type SocialKey = "instagram" | "youtube" | "tiktok" | "threads" | "facebook" | "x" | "linkedin" | "whatsapp";

export type Rede = { key: SocialKey; label: string; perfil: string; url: string };
export type BuRedes = { id: string; nome: string; descricao: string; site?: { label: string; url: string }; redes: Rede[] };

export const SOCIAL_KEYS: SocialKey[] = ["instagram", "youtube", "tiktok", "threads", "facebook", "x", "linkedin", "whatsapp"];
