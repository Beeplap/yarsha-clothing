"use client";

import { useState, useMemo } from "react";
import type { Product, Category } from "@/types/database";
import ProductCard from "./product-card";

const PRICE_RANGES = [
  { label: "Under Rs. 1,000", min: 0, max: 1000 },
  { label: "Rs. 1,000 – 3,000", min: 1000, max: 3000 },
  { label: "Rs. 3,000 – 5,000", min: 3000, max: 5000 },
  { label: "Rs. 5,000 – 10,000", min: 5000, max: 10000 },
  { label: "Over Rs. 10,000", min: 10000, max: Infinity },
];

const CATEGORY_TABS = [
  { label: "SHOES", slug: "shoes" },
  { label: "CLOTHING", slug: "clothing" },
  { label: "ACCESSORIES", slug: "accessories" },
  { label: "SPORTS", slug: "sports" },
  { label: "COLLECTIONS", slug: "collections" },
];

// Helper to determine product category slug dynamically when DB categories are empty or null
function getProductCategorySlug(p: Product): string {
  if (p.categories?.slug) return p.categories.slug;
  if (p.category_id) return p.category_id; // in case UUID matches
  
  const name = p.name.toLowerCase();
  if (name.includes("shoes") || name.includes("sneakers") || name.includes("slides") || name.includes("sandals")) {
    return "shoes";
  }
  if (name.includes("watch") || name.includes("bag") || name.includes("hat") || name.includes("backpack") || name.includes("socks")) {
    return "accessories";
  }
  if (name.includes("soccer") || name.includes("basketball") || name.includes("running") || name.includes("performance") || name.includes("track pants") || name.includes("joggers")) {
    return "sports";
  }
  if (name.includes("jacket") || name.includes("coat") || name.includes("hoodie") || name.includes("sweatshirt") || name.includes("tee") || name.includes("t-shirt") || name.includes("pants") || name.includes("shorts") || name.includes("shirt") || name.includes("polo") || name.includes("vest") || name.includes("parka") || name.includes("denim") || name.includes("fleece")) {
    return "clothing";
  }
  return "collections";
}

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ProductGrid({
  products,
  categories,
  initialCategory,
}: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || ""
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fallback categories list for sidebar rendering when database categories are empty
  const activeCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    return [
      { id: "shoes", name: "Shoes", slug: "shoes", description: null, created_at: "" },
      { id: "clothing", name: "Clothing", slug: "clothing", description: null, created_at: "" },
      { id: "accessories", name: "Accessories", slug: "accessories", description: null, created_at: "" },
      { id: "sports", name: "Sports", slug: "sports", description: null, created_at: "" },
      { id: "collections", name: "Collections", slug: "collections", description: null, created_at: "" },
    ];
  }, [categories]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Category Filter using database relation or dynamic fallback slug resolver
    if (selectedCategory) {
      result = result.filter((p) => {
        const slug = getProductCategorySlug(p);
        // check if slug matches slug directly, or if it matches active UUID representation in DB
        return slug === selectedCategory || p.category_id === selectedCategory;
      });
    }

    // Price range
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(
        (p) => Number(p.price) >= range.min && Number(p.price) < range.max
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [products, search, selectedCategory, selectedPriceRange, sortBy]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + (selectedPriceRange !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPriceRange(null);
    setSearch("");
  };

  const filterSidebar = (
    <aside className="filters">
      <div className="filters__header">
        <h3 className="filters__title">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="filters__clear">
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="filters__group">
        <h4 className="filters__group-title">Category</h4>
        <ul className="filters__list">
          <li>
            <button
              className={`filters__option ${selectedCategory === "" ? "filters__option--active" : ""}`}
              onClick={() => setSelectedCategory("")}
            >
              <span>All Categories</span>
              {selectedCategory === "" && <span className="filters__check">✓</span>}
            </button>
          </li>
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  className={`filters__option ${isSelected ? "filters__option--active" : ""}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  <span>{cat.name}</span>
                  {isSelected && <span className="filters__check">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div className="filters__group">
        <h4 className="filters__group-title">Price Range</h4>
        <ul className="filters__list">
          <li>
            <button
              className={`filters__option ${selectedPriceRange === null ? "filters__option--active" : ""}`}
              onClick={() => setSelectedPriceRange(null)}
            >
              <span>All Prices</span>
              {selectedPriceRange === null && <span className="filters__check">✓</span>}
            </button>
          </li>
          {PRICE_RANGES.map((range, i) => (
            <li key={range.label}>
              <button
                className={`filters__option ${selectedPriceRange === i ? "filters__option--active" : ""}`}
                onClick={() => setSelectedPriceRange(i)}
              >
                <span>{range.label}</span>
                {selectedPriceRange === i && <span className="filters__check">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  return (
    <div className="catalog">
      {/* Horizontal Category Division Bar (as shown in user screenclip) */}
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap",
          padding: "1.5rem 1rem",
          borderBottom: "1px solid color-mix(in srgb, var(--foreground) 8%, transparent)",
          marginBottom: "2.5rem"
        }}
      >
        <button
          onClick={() => setSelectedCategory("")}
          style={{
            background: "none",
            border: "none",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "2.5px",
            color: selectedCategory === "" ? "var(--accent)" : "var(--foreground)",
            cursor: "pointer",
            padding: "0.5rem 0",
            borderBottom: selectedCategory === "" ? "2px solid var(--accent)" : "2px solid transparent",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            fontFamily: "var(--display-font)"
          }}
        >
          ALL
        </button>
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.slug;
          return (
            <button
              key={tab.slug}
              onClick={() => setSelectedCategory(tab.slug)}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "2.5px",
                color: isActive ? "var(--accent)" : "var(--foreground)",
                cursor: "pointer",
                padding: "0.5rem 0",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: "var(--display-font)"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Top Bar */}
      <div className="catalog__topbar">
        <div className="catalog__search-wrapper">
          <svg className="catalog__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="catalog__search"
            id="product-search"
          />
        </div>

        <div className="catalog__topbar-right">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="catalog__sort"
            id="product-sort"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>

          <button
            className="catalog__filter-toggle"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="4" y1="21" y2="14" />
              <line x1="4" x2="4" y1="10" y2="3" />
              <line x1="12" x2="12" y1="21" y2="12" />
              <line x1="12" x2="12" y1="8" y2="3" />
              <line x1="20" x2="20" y1="21" y2="16" />
              <line x1="20" x2="20" y1="12" y2="3" />
              <line x1="1" x2="7" y1="14" y2="14" />
              <line x1="9" x2="15" y1="8" y2="8" />
              <line x1="17" x2="23" y1="16" y2="16" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="catalog__filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="catalog__layout">
        {/* Desktop Sidebar */}
        <div className="catalog__sidebar">{filterSidebar}</div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="catalog__mobile-overlay">
            <div className="catalog__mobile-panel">
              <div className="catalog__mobile-panel-header">
                <h3>Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              {filterSidebar}
              <button
                className="catalog__mobile-apply"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="catalog__grid-area">
          <p className="catalog__count">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          {filtered.length > 0 ? (
            <div className="catalog__grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="catalog__empty">
              <p className="catalog__empty-title">No products found</p>
              <p className="catalog__empty-text">
                Try adjusting your search or filters.
              </p>
              <button onClick={clearFilters} className="catalog__empty-btn">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
