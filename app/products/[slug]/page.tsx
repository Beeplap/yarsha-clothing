import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProductDetail from "@/components/product-detail";
import type { Metadata } from "next";
import type { Product } from "@/types/database";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Yarsha Clothing`,
    description:
      product.description || `Shop ${product.name} at Yarsha Clothing.`,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  return (
    <section className="pdp-page">
      <ProductDetail product={product as unknown as Product} />
    </section>
  );
}
