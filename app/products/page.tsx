import { createClient } from "@/utils/supabase/server";
import ProductGrid from "@/components/product-grid";
import type { Metadata } from "next";
import type { Product, Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Shop All Products | Yarsha Clothing",
  description:
    "Browse the full Yarsha Clothing collection. Filter by category, price, and more.",
};

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
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
      <div className="products-page__header">
        <h1 className="products-page__title">Our Collection</h1>
        <p className="products-page__subtitle">
          Discover premium clothing crafted with care and purpose.
        </p>
      </div>
      <ProductGrid
        products={(products as unknown as Product[]) || []}
        categories={(categories as unknown as Category[]) || []}
        initialCategory={category}
      />
    </section>
  );
}
