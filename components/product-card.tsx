import Link from "next/link";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const primaryImage =
    product.images?.[0] || "/placeholder-product.jpg";

  return (
    <Link href={`/products/${product.slug}`} className="product-card" id={`product-${product.slug}`}>
      <div className="product-card__image-wrapper">
        <img
          src={primaryImage}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="product-card__badge">-{discountPercent}%</span>
        )}
        {product.stock_quantity === 0 && (
          <span className="product-card__badge product-card__badge--soldout">
            Sold Out
          </span>
        )}
      </div>
      <div className="product-card__info">
        {product.categories && (
          <span className="product-card__category">
            {product.categories.name}
          </span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">
            Rs. {Number(product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="product-card__compare-price">
              Rs. {Number(product.compare_at_price!).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
