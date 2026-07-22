import { createClient } from "@/utils/supabase/server";
import ProductGrid from "@/components/product-grid";
import type { Metadata } from "next";
import type { Product, Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Sports & Activewear | Yarsha Wears",
  description: "Performance activewear, running shoes, training pants, and sports gear.",
};

export default async function SportsPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <section className="products-page">
      <div className="products-page__header" style={{ textAlign: "center" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          PERFORMANCE GEAR
        </span>
        <h1 className="products-page__title" style={{ marginTop: "0.25rem" }}>Sports &amp; Activewear</h1>
        <p className="products-page__subtitle">
          Engineered for performance, movement, and durability.
        </p>
      </div>
      <ProductGrid
        products={(products as unknown as Product[]) || []}
        categories={(categories as unknown as Category[]) || []}
        initialCategory="sports"
      />
    </section>
  );
}
