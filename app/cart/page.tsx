"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <h1 className="cart-page__title">Your Cart</h1>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product ? item.product.price * item.quantity : 0),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h1 className="cart-page__title">Your Cart</h1>

        {items.length === 0 ? (
          <div className="cart-page__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="cart-page__empty-icon">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p>Your cart is currently empty.</p>
            <Link href="/products" className="cart-page__continue-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-page__items">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const image = product.images?.[0] || "/placeholder-product.jpg";

                return (
                  <div key={item.id} className="cart-item">
                    <Link href={`/products/${product.slug}`} className="cart-item__image-link">
                      <img src={image} alt={product.name} className="cart-item__image" />
                    </Link>
                    
                    <div className="cart-item__details">
                      <div className="cart-item__header">
                        <h3 className="cart-item__name">
                          <Link href={`/products/${product.slug}`}>{product.name}</Link>
                        </h3>
                        <span className="cart-item__price">Rs. {Number(product.price).toLocaleString()}</span>
                      </div>
                      
                      {item.size && <p className="cart-item__size">Size: {item.size}</p>}
                      
                      <div className="cart-item__actions">
                        <div className="cart-item__quantity">
                          <button 
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-item__qty-value">{item.quantity}</span>
                          <button 
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className="cart-item__remove"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-page__summary">
              <h2 className="cart-page__summary-title">Order Summary</h2>
              
              <div className="cart-page__summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="cart-page__summary-total">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <Link href="/checkout" className="cart-page__checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
