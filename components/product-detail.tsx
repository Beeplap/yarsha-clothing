"use client";

import { useState } from "react";
import type { Product } from "@/types/database";
import { useCart } from "@/context/cart-context";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const { addToCart } = useCart();

  const baseImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder-product.jpg"];
      
  // For sticky scroll gallery, ensure we have enough images to scroll
  const displayImages = baseImages.length >= 3 
    ? baseImages 
    : [...baseImages, ...baseImages, ...baseImages].slice(0, 3);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const inStock = product.stock_quantity > 0;

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    setAdding(true);
    setAddedMessage("");

    try {
      await addToCart(product, quantity, selectedSize);
      setAddedMessage("Added to cart!");
      setTimeout(() => setAddedMessage(""), 3000);
    } catch {
      setAddedMessage("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="pdp">
      {/* Image Gallery (Scrolling) */}
      <div className="pdp__gallery">
        {displayImages.map((img, index) => (
          <div key={index} className="pdp__main-image-wrapper">
            <img
              src={img}
              alt={`${product.name} - View ${index + 1}`}
              className="pdp__main-image"
            />
            {index === 0 && hasDiscount && (
              <span className="pdp__badge">-{discountPercent}% OFF</span>
            )}
          </div>
        ))}
      </div>

      {/* Product Info */}
      <div className="pdp__info">
        {product.categories && (
          <span className="pdp__category">{product.categories.name}</span>
        )}

        <h1 className="pdp__title">{product.name}</h1>

        <div className="pdp__price-row">
          <span className="pdp__price">
            Rs. {Number(product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="pdp__compare-price">
              Rs. {Number(product.compare_at_price!).toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={`pdp__stock ${inStock ? "pdp__stock--in" : "pdp__stock--out"}`}>
          <span className="pdp__stock-dot" />
          {inStock
            ? product.stock_quantity <= 5
              ? `Only ${product.stock_quantity} left in stock`
              : "In Stock"
            : "Out of Stock"}
        </div>

        {/* Description */}
        {product.description && (
          <p className="pdp__description">{product.description}</p>
        )}

        {/* Size Selector */}
        <div className="pdp__section">
          <h3 className="pdp__section-title">
            Size {selectedSize && <span className="pdp__size-selected">— {selectedSize}</span>}
          </h3>
          <div className="pdp__sizes">
            {SIZES.map((size) => (
              <button
                key={size}
                className={`pdp__size-btn ${selectedSize === size ? "pdp__size-btn--active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="pdp__section">
          <h3 className="pdp__section-title">Quantity</h3>
          <div className="pdp__quantity">
            <button
              className="pdp__qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="pdp__qty-value">{quantity}</span>
            <button
              className="pdp__qty-btn"
              onClick={() =>
                setQuantity(Math.min(product.stock_quantity, quantity + 1))
              }
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          className="pdp__add-btn"
          onClick={handleAddToCart}
          disabled={!inStock || !selectedSize || adding}
          id="add-to-cart"
        >
          {adding ? (
            <span className="auth-spinner" />
          ) : !inStock ? (
            "Out of Stock"
          ) : !selectedSize ? (
            "Select a Size"
          ) : (
            "Add to Cart"
          )}
        </button>

        {addedMessage && (
          <p className="pdp__added-msg">{addedMessage}</p>
        )}

        {/* Details */}
        <div className="pdp__details">
          <div className="pdp__detail-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Free shipping across Nepal</span>
          </div>
          <div className="pdp__detail-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <span>Easy 7-day returns</span>
          </div>
          <div className="pdp__detail-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <span>100% authentic guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
