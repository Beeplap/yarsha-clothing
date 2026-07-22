import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TopProductsSection } from "@/components/sections/top-products-section";
import { RecentlyViewedSection } from "@/components/sections/recently-viewed-section";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Yarsha Wears | Premium Wears",
  description: "Yarsha Wears - Premium wears and sub-brand of Yarsha Byte.",
  keywords: ["wears", "Yarsha", "fashion"],
  alternates: { canonical: "https://yarshawears.com/" },
};

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yarshawears.com/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main>
        <HeroSection />
        <TopProductsSection products={products || []} />
        <RecentlyViewedSection />
        <ContactSection />
      </main>
    </>
  );
}
