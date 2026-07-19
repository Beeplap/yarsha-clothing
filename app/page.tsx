import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { WearsSection } from "@/components/sections/wears-section";
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
    .select("name, images")
    .limit(7);

  const wearsImages = products?.flatMap(p => 
    (p.images || []).filter(Boolean).map((img: string) => ({ src: img, alt: p.name }))
  ) || [];

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
        <WearsSection products={wearsImages} />
        <ContactSection />
      </main>
    </>
  );
}
