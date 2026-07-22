"use client";

import { useState } from "react";
import ProductCard from "@/components/product-card";
import PaginationBar from "@/components/pagination-bar";

export function TopProductsSection({ products }: { products: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil((products?.length || 0) / itemsPerPage));

  const pagedProducts = (products || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="top-products-section" style={{ padding: '6rem 5vw', backgroundColor: '#f9f9f9' }}>
      {/* Header without View All at the top */}
      <div className="section-header" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
          Top Products
        </h2>
        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>
          Discover our most popular wears
        </p>
      </div>
      
      {/* Product Grid */}
      <div 
        className="products-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {pagedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Footer at the BOTTOM with Page changer and View All option */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        viewAllHref="/products"
      />
    </section>
  );
}
