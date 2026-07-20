import Link from "next/link";
import ProductCard from "@/components/product-card";

export function TopProductsSection({ products }: { products: any[] }) {
  return (
    <section className="top-products-section" style={{ padding: '6rem 5vw', backgroundColor: '#f9f9f9' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
            Top Products
          </h2>
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>
            Discover our most popular wears
          </p>
        </div>
        <Link 
          href="/products" 
          className="magnetic-btn" 
          style={{ 
            display: 'inline-block', 
            border: '2px solid #000', 
            padding: '0.8rem 2rem', 
            borderRadius: '3rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
          }}
        >
          View All
        </Link>
      </div>
      
      <div 
        className="products-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
