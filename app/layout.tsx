import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Les Sept Merveilles du Monde",
  description: "Un voyage éditorial immersif autour des sept nouvelles merveilles du monde.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
