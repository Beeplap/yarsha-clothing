"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CreditCard, Wallet } from "lucide-react";

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
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push("/cart");
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) {
        setFormData((prev) => ({ ...prev, email: user.email! }));
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      const { data: orderId, error: rpcError } = await supabase.rpc("checkout_cart", {
        p_cart_id: cartId,
        p_shipping_address: formData,
      });

      if (rpcError) throw new Error(rpcError.message);

      await clearCart();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initialization failed");

      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/checkout/success?order=${orderId}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during checkout.");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--body-font)",
        padding: "2rem 5vw 4rem 5vw",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
        }}
      >
        {/* Main Checkout Details Form */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "var(--accent)",
                textDecoration: "none",
                letterSpacing: "0.05em",
              }}
            >
              YARSHA WEARS
            </Link>
            <nav style={{ fontSize: "0.85rem", marginTop: "0.5rem", display: "flex", gap: "6px", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>
              <Link href="/cart" style={{ color: "inherit", textDecoration: "none" }}>Cart</Link>
              <span>›</span>
              <span style={{ fontWeight: 700, color: "var(--foreground)" }}>Shipping & Payment</span>
            </nav>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {error && (
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  backgroundColor: "rgba(197, 48, 48, 0.1)",
                  color: "#c53030",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                1. Contact Information
              </h2>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                2. Shipping Address (Nepal)
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="auth-input"
                  required
                />
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

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address or Area"
                  className="auth-input"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City (e.g. Kathmandu, Pokhara)"
                  className="auth-input"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="auth-input"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile Phone Number (+977)"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                3. Select Payment Gateway
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: paymentMethod === "card" ? "2px solid var(--accent)" : "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                    backgroundColor: paymentMethod === "card" ? "color-mix(in srgb, var(--accent) 8%, var(--background))" : "var(--background)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ accentColor: "var(--accent)", width: "1.2rem", height: "1.2rem" }}
                  />
                  <CreditCard size={24} color="var(--accent)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Credit / Debit Card (Stripe)</div>
                    <div style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)" }}>Visa, Mastercard, International Cards</div>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: paymentMethod === "wallet" ? "2px solid var(--accent)" : "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                    backgroundColor: paymentMethod === "wallet" ? "color-mix(in srgb, var(--accent) 8%, var(--background))" : "var(--background)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ accentColor: "var(--accent)", width: "1.2rem", height: "1.2rem" }}
                  />
                  <Wallet size={24} color="var(--accent)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Digital Wallet (eSewa / Khalti)</div>
                    <div style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)" }}>Instant wallet transfer across Nepal</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem" }}>
              <Link href="/cart" style={{ color: "var(--foreground)", textDecoration: "underline", fontSize: "0.9rem" }}>
                ← Return to cart
              </Link>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.875rem 2.5rem",
                  borderRadius: "30px",
                  backgroundColor: "var(--accent)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                {submitting ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div
          style={{
            padding: "2rem",
            borderRadius: "16px",
            backgroundColor: "color-mix(in srgb, var(--foreground) 4%, transparent)",
            height: "fit-content",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Order Summary ({items.length})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    <img src={product.images?.[0] || "/placeholder-product.jpg"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "var(--accent)",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderBottomLeftRadius: "6px",
                      }}
                    >
                      x{item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.name}</div>
                    {item.size && <div style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>Size: {item.size}</div>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Rs. {(product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Shipping</span>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, paddingTop: "0.5rem", borderTop: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)" }}>
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)" }}>
            <CheckCircle2 size={16} color="var(--accent)" />
            <span>Secure 256-bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
