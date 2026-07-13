import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/product-card";
import CategorySlider from "@/components/category-slider";
import type { Product, Category } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featured }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__tag">By Yarsha Byte</span>
          <h1 className="hero__title">
            Wear the <strong>Future</strong>
          </h1>
          <p className="hero__subtitle">
            Premium clothing crafted at the intersection of technology and
            textile. Designed for those who move forward.
          </p>
          <div className="hero__actions">
            <Link href="/products" className="hero__btn-primary">
              Shop Collection
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link href="/about" className="hero__btn-secondary">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="section">
          <div className="section__container">
            <div className="section__header">
              <div>
                <h2 className="section__title">Shop by Category</h2>
                <p className="section__subtitle">
                  Find exactly what you&apos;re looking for
                </p>
              </div>
            </div>
            <CategorySlider categories={categories as unknown as Category[]} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section section--alt">
        <div className="section__container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Featured Apparel</h2>
              <p className="section__subtitle">
                Handpicked pieces from our latest collection
              </p>
            </div>
            <Link href="/products" className="section__link">
              View All
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          {featured && featured.length > 0 ? (
            <div className="product-grid">
              {(featured as unknown as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="section__empty">
              <p>No featured products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Promise */}
      <section className="section">
        <div className="section__container">
          <div className="promise-grid">
            <div className="promise-card">
              <div className="promise-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="promise-card__title">Premium Quality</h3>
              <p className="promise-card__text">
                Every piece is crafted with the finest materials for lasting comfort.
              </p>
            </div>
            <div className="promise-card">
              <div className="promise-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="promise-card__title">Free Shipping</h3>
              <p className="promise-card__text">
                Complimentary delivery across Nepal on all orders.
              </p>
            </div>
            <div className="promise-card">
              <div className="promise-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
              </div>
              <h3 className="promise-card__title">Easy Returns</h3>
              <p className="promise-card__text">
                Hassle-free 7-day returns if you&apos;re not completely satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
