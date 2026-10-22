import type { Metadata } from "next";
import { Inter, Oxanium, Rajdhani } from "next/font/google";
import "./globals.css";

// Mesmas três fontes do site novo: Inter (corpo), Oxanium (títulos), Rajdhani (rótulos).
const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const oxanium = Oxanium({ variable: "--font-display", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-ui", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Links de Pagamento | CPPEM",
  description: "Busque o produto e copie o link de pagamento. Uso interno da equipe.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${oxanium.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="page-shell min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
