import { createClient } from "@/utils/supabase/server";
import ProductGrid from "@/components/product-grid";
import type { Metadata } from "next";
import type { Product, Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Sale & Clearance | Yarsha Wears",
  description: "Special offers and discounted wears up to 40% off.",
};

export default async function SalePage() {
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
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#dc2626" }}>
          LIMITED TIME OFFERS
        </span>
        <h1 className="products-page__title" style={{ marginTop: "0.25rem" }}>Seasonal Sale</h1>
        <p className="products-page__subtitle">
          Save on selected apparel, sneakers, and accessories while stocks last.
        </p>
      </div>
      <ProductGrid
        products={(products as unknown as Product[]) || []}
        categories={(categories as unknown as Category[]) || []}
      />
    </section>
  );
}
