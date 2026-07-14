import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/product-card";
import CategorySlider from "@/components/category-slider";
import ParallaxShowcase from "@/components/parallax-showcase";
import FloatingApparel from "@/components/floating-apparel";
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
      <section className="hero hero-grid-bg noise-overlay" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <FloatingApparel />
        
        <div className="hero__accent-orb" aria-hidden="true" style={{ position: 'absolute', zIndex: 1 }} />
        
        <div className="hero__content" data-gsap-stagger style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
          <span className="hero__tag gsap-fade-up" style={{ display: 'inline-block', marginBottom: '1.5rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#00d4ff', textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>YARSHA FUTURE TECH</span>
          
          <h1 className="hero__title gsap-fade-up" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 900, textTransform: 'uppercase' }}>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)', backgroundImage: 'linear-gradient(90deg, #fff, #a3a3a3)', WebkitBackgroundClip: 'text' }}>Wear the</span>
            <strong style={{ display: 'block', backgroundImage: 'linear-gradient(90deg, #00d4ff, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: '0 0 40px rgba(0, 212, 255, 0.3)' }}>Future</strong>
          </h1>
          
          <p className="hero__subtitle gsap-fade-up" data-gsap-delay="0.1" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', color: '#a3a3a3', lineHeight: 1.6 }}>
            Premium clothing crafted at the intersection of technology and
            textile. Designed for those who move forward.
          </p>
          
          <div className="hero__actions gsap-fade-up" data-gsap-delay="0.2" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', pointerEvents: 'auto' }}>
            <Link href="/products" className="hero__btn-primary magnetic-btn" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.5)', padding: '1rem 2.5rem', borderRadius: '2rem', color: '#00d4ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }}>
              Shop Collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link href="/about" className="hero__btn-secondary magnetic-btn" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2.5rem', borderRadius: '2rem', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
              Our Story
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </section>

      {/* GSAP Parallax Showcase */}
      <ParallaxShowcase />

      {/* Marquee Text Section */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          <span className="marquee-text">
            FUTURISTIC &bull; PREMIUM &bull; INNOVATIVE &bull; TECH-WEAR &bull;
            YARSHA &bull; FUTURISTIC &bull; PREMIUM &bull; INNOVATIVE &bull;
            TECH-WEAR &bull; YARSHA &bull; FUTURISTIC &bull; PREMIUM &bull;
            INNOVATIVE &bull; TECH-WEAR &bull; YARSHA &bull;
          </span>
          <span className="marquee-text">
            FUTURISTIC &bull; PREMIUM &bull; INNOVATIVE &bull; TECH-WEAR &bull;
            YARSHA &bull; FUTURISTIC &bull; PREMIUM &bull; INNOVATIVE &bull;
            TECH-WEAR &bull; YARSHA &bull; FUTURISTIC &bull; PREMIUM &bull;
            INNOVATIVE &bull; TECH-WEAR &bull; YARSHA &bull;
          </span>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="section">
          <div className="section__container">
            <div className="section__header">
              <div>
                <h2 className="section__title gsap-fade-up">
                  Shop by Category
                </h2>
                <p className="section__subtitle gsap-fade-up" data-gsap-delay="0.1">
                  Find exactly what you&apos;re looking for
                </p>
              </div>
            </div>
            <div data-gsap-stagger>
              <CategorySlider categories={categories as unknown as Category[]} />
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section section--alt">
        <div className="section__container">
          <div className="section__header">
            <div>
              <h2 className="section__title gsap-fade-up">Featured Apparel</h2>
              <p className="section__subtitle gsap-fade-up" data-gsap-delay="0.1">
                Handpicked pieces from our latest collection
              </p>
            </div>
            <Link href="/products" className="section__link gsap-fade-up" data-gsap-delay="0.2">
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
            <div className="product-grid" data-gsap-stagger>
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
          <div className="promise-grid" data-gsap-stagger>
            <div className="promise-card gsap-fade-up">
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
            <div className="promise-card gsap-fade-up">
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
            <div className="promise-card gsap-fade-up">
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

      {/* Newsletter / CTA Section */}
      <section className="newsletter-section gsap-scale-in">
        <div className="newsletter__glow" aria-hidden="true" />
        <div className="newsletter__container">
          <h2 className="newsletter__title">Join the Revolution</h2>
          <p className="newsletter__subtitle">
            Be the first to experience our latest drops, exclusive offers, and
            the future of fashion technology.
          </p>
          <form className="newsletter__form" action="#" method="POST">
            <div className="newsletter__input-group">
              <input
                type="email"
                className="newsletter__input"
                placeholder="Enter your email address"
                aria-label="Email address"
                required
              />
              <button type="submit" className="newsletter__btn">
                Subscribe
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
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
