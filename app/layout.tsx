import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laguarderiadekira.com"),
  title: "La Guardería de Kira 🐾 | Guardería Canina en Barranquilla (100% Sin Jaulas & A/C)",
  description:
    "El segundo hogar de tu peludo en Barranquilla. Guardería canina familiar, 100% libre de jaulas, aire acondicionado 24/7, 2 paseos diarios al parque y reportes continuos por WhatsApp.",
  keywords: [
    "guardería canina barranquilla",
    "hotel para perros barranquilla",
    "la guardería de kira",
    "guardería canina sin jaulas",
    "aire acondicionado perros barranquilla",
    "hospedaje canino barranquilla",
  ],
  openGraph: {
    title: "La Guardería de Kira 🐾 | Barranquilla • Convivencia Familiar",
    description:
      "100% Libre de jaulas con aire acondicionado, 2 paseos diarios al parque y fotos/videos continuos por WhatsApp.",
    images: ["/images/kira-walk-hero.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${plusJakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-sky-200 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
