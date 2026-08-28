import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://les-7-merveilles.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Les Sept Merveilles du Monde",
  url: siteUrl,
  description: "Un voyage éditorial immersif autour des sept nouvelles merveilles du monde.",
  inLanguage: "fr",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
