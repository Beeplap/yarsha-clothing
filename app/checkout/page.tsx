"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, loading, cartId, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push("/cart");
    }
    
    // Auto-fill email if logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) {
        setFormData(prev => ({ ...prev, email: user.email! }));
      }
    });
  }, [loading, items, router, supabase]);

  if (loading || items.length === 0) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product ? item.product.price * item.quantity : 0),
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("Please sign in to complete your purchase.");
        setSubmitting(false);
        return;
      }
      
      if (!cartId) {
        setError("Your cart is empty or invalid.");
        setSubmitting(false);
        return;
      }

      // Call the RPC function for secure checkout
      const { data: orderId, error: rpcError } = await supabase.rpc("checkout_cart", {
        p_cart_id: cartId,
        p_shipping_address: formData
      });

      if (rpcError) throw new Error(rpcError.message);

      // Clear local cart context state
      await clearCart();
      
      // Redirect to success
      router.push(`/checkout/success?order=${orderId}`);
      
    } catch (err: any) {
      setError(err.message || "An error occurred during checkout.");
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        
        <div className="checkout-page__main">
          <div className="checkout-page__header">
            <Link href="/" className="checkout-page__logo">YARSHA</Link>
            <nav className="checkout-page__breadcrumbs">
              <Link href="/cart">Cart</Link>
              <span>›</span>
              <span className="active">Information & Shipping</span>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            {error && (
              <div className="auth-error" style={{ marginBottom: "1.5rem" }}>
                {error}
              </div>
            )}
            
            <section className="checkout-form__section">
              <h2 className="checkout-form__title">Contact Information</h2>
              <div className="auth-field">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="auth-input"
                  required
                />
              </div>
            </section>

            <section className="checkout-form__section">
              <h2 className="checkout-form__title">Shipping Address</h2>
              
              <div className="checkout-form__row">
                <div className="auth-field">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="auth-input"
                    required
                  />
                </div>
                <div className="auth-field">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field" style={{ marginTop: "1rem" }}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="auth-input"
                  required
                />
              </div>

              <div className="checkout-form__row" style={{ marginTop: "1rem" }}>
                <div className="auth-field">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="auth-input"
                    required
                  />
                </div>
                <div className="auth-field">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field" style={{ marginTop: "1rem" }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="auth-input"
                  required
                />
              </div>
            </section>

            <div className="checkout-form__actions">
              <Link href="/cart" className="checkout-form__back">
                Return to cart
              </Link>
              <button 
                type="submit" 
                className="auth-button"
                style={{ width: "auto" }}
                disabled={submitting}
              >
                {submitting ? <span className="auth-spinner" /> : "Complete Order"}
              </button>
            </div>
          </form>
        </div>

        <aside className="checkout-page__sidebar">
          <div className="checkout-sidebar__items">
            {items.map(item => {
              const product = item.product;
              if (!product) return null;
              
              return (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item__image-wrap">
                    <img 
                      src={product.images?.[0] || "/placeholder-product.jpg"} 
                      alt={product.name} 
                    />
                    <span className="checkout-item__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item__info">
                    <p className="checkout-item__name">{product.name}</p>
                    {item.size && <p className="checkout-item__size">{item.size}</p>}
                  </div>
                  <div className="checkout-item__price">
                    Rs. {(product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-sidebar__totals">
            <div className="checkout-sidebar__row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="checkout-sidebar__row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="checkout-sidebar__total">
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
