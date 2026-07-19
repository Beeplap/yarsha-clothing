import type { Metadata } from "next";

import { PageLoader } from "@/components/page-loader";
import { PageWaveTransition } from "@/components/page-wave-transition";
import { ScrollHexBackground } from "@/components/scroll-hex-background";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { SiteHeader } from "@/components/site-header";
import { HeroCanvasShell } from "@/components/hero/hero-canvas-shell";
import { CartProvider } from "@/context/cart-context";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yarsha Clothing | Premium Wears",
  description:
    "Yarsha Clothing provides premium clothing, streetwear, and fashion apparel in Nepal.",
  metadataBase: new URL("https://yarshaclothing.com"),
  alternates: { canonical: "https://yarshaclothing.com" },
  openGraph: {
    title: "Yarsha Clothing | Premium Wears",
    description:
      "Yarsha Clothing provides premium clothing, streetwear, and fashion apparel in Nepal.",
    siteName: "YarshaClothing",
    locale: "en_US",
    type: "website",
    url: "https://yarshaclothing.com",
    images: [
      {
        url: "https://yarshaclothing.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yarsha Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarsha Clothing | Premium Wears",
    description:
      "Yarsha Clothing provides premium clothing, streetwear, and fashion apparel in Nepal.",
    images: ["https://yarshaclothing.com/og-image.png"],
    creator: "@yarshaclothing",
    site: "@yarshaclothing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full subpixel-antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/SuisseIntl-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/TTTunnels-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/TTLakesNeue-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Structured Data: Organization & LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Yarsha Clothing",
              url: "https://yarshaclothing.com",
              logo: "https://yarshaclothing.com/logo.webp",
              sameAs: [
                "https://www.facebook.com/yarshaclothing",
                "https://www.instagram.com/yarshaclothing",
                "https://www.linkedin.com/company/yarshaclothing",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Yarsha Clothing",
              description:
                "Premium streetwear and apparel brand in Nepal",
              url: "https://yarshaclothing.com",
              telephone: "+977-1234567890",
              address: {
                "@type": "PostalAddress",
                addressCountry: "NP",
                addressLocality: "Kathmandu",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full font-sans text-foreground">
        <PageLoader>
          <PageWaveTransition />
          <HeroCanvasShell />
          <SiteHeader />
          <div className="site-frame">
            <ScrollHexBackground />
            <div className="site-frame-content">
              <SmoothScrollProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </SmoothScrollProvider>
            </div>
          </div>
        </PageLoader>
      </body>
    </html>
  );
}
