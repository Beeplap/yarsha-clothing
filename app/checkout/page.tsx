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
  const [paymentMethod, setPaymentMethod] = useState("card");
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
      
      // Initialize payment session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethod })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initialization failed");
      
      // Redirect to payment provider
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback
        router.push(`/checkout/success?order=${orderId}`);
      }
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during checkout.");
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

            <section className="checkout-form__section">
              <h2 className="checkout-form__title">Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `1px solid ${paymentMethod === 'card' ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`, borderRadius: '0.5rem', background: paymentMethod === 'card' ? 'rgba(0, 212, 255, 0.05)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: '#00d4ff', width: '1.2rem', height: '1.2rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: '#fff' }}>Credit / Debit Card (Stripe)</span>
                    <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Secure global payments</span>
                  </div>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `1px solid ${paymentMethod === 'wallet' ? '#22c55e' : 'rgba(255,255,255,0.1)'}`, borderRadius: '0.5rem', background: paymentMethod === 'wallet' ? 'rgba(34, 197, 94, 0.05)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === 'wallet'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: '#22c55e', width: '1.2rem', height: '1.2rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: '#fff' }}>Digital Wallet</span>
                    <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Pay via eSewa or Khalti</span>
                  </div>
                </label>
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
