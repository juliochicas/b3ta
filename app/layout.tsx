import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | B3TA",
    default: "B3TA - Consultoria Tech Guatemala | Paginas Web, Sistemas y Automatizacion",
  },
  description:
    "Consultoria tech en Guatemala. Paginas web profesionales, tiendas Shopify, sistemas a medida, integraciones SAP y automatizacion de procesos para empresas en LATAM.",
  keywords: [
    "consultoria tech guatemala",
    "paginas web guatemala",
    "desarrollo software guatemala",
    "shopify guatemala",
    "sap business one guatemala",
    "automatizacion empresas",
    "sistemas a medida",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "B3TA" }],
  metadataBase: new URL("https://b3ta.us"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_GT",
    url: "https://b3ta.us",
    siteName: "B3TA",
    title: "B3TA - Consultoria Tech Guatemala",
    description:
      "Paginas web, sistemas a medida y automatizacion para empresas en Guatemala y LATAM.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "B3TA - Consultoria Tech Guatemala",
    description:
      "Paginas web, sistemas a medida y automatizacion para empresas en Guatemala y LATAM.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  other: {
    "geo.region": "GT",
    "geo.placename": "Guatemala",
    "content-language": "es",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "B3TA",
    url: "https://b3ta.us",
    description: "Consultoria tech en Guatemala",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://b3ta.us/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "B3TA",
    url: "https://b3ta.us",
    description:
      "Consultoria tech: paginas web, tiendas online, sistemas a medida y automatizacion para empresas en Guatemala y LATAM.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guatemala City",
      addressCountry: "GT",
    },
    areaServed: [
      { "@type": "Country", name: "Guatemala" },
      { "@type": "Country", name: "Mexico" },
      { "@type": "Country", name: "Colombia" },
    ],
    priceRange: "$$",
    email: "hi@b3ta.us",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={plusJakarta.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
