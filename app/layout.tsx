import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Les Sept Merveilles du Monde",
  description: "Un voyage éditorial immersif autour des sept nouvelles merveilles du monde.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
