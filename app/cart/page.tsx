"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart, cartId, clearCart } = useCart();
  const supabase = createClient();
  const router = useRouter();

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

  const handleWhatsAppCheckout = async () => {
    // 1. Generate WhatsApp message content
    const phoneNumber = "9766272646";
    let message = "Hello YARSHA, I would like to place an order:\n\n";
    
    items.forEach(item => {
      const product = item.product;
      if (!product) return;
      message += `${item.quantity}x ${product.name} ${item.size ? `(Size: ${item.size})` : ''} - Rs. ${(product.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Total: Rs. ${subtotal.toLocaleString()}*`;
    message += "\n\nPlease let me know the next steps for delivery and payment.";
    
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      // 2. Call RPC to deduct stock, create order, and clear cart
      // We pass an empty shipping address since it's handled via WhatsApp
      if (cartId) {
        const { data: orderId, error } = await supabase.rpc("checkout_cart", {
          p_cart_id: cartId,
          p_shipping_address: { via: "whatsapp" }
        });
        
        if (error) {
          const errorDetails = JSON.stringify({
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          }, null, 2);
          console.error("Failed to deduct stock:", errorDetails);
          toast.error(`There was an issue processing your order:\n${error.message}\n\nMake sure you ran the SQL migration provided previously!`);
          return;
        }

        // Fire confirmation email asynchronously
        if (orderId) {
          fetch("/api/emails/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, type: "confirmation" })
          }).catch(err => console.error("Failed to send email", err));
        }
      }
      
      // 3. Clear local cart
      await clearCart();
      
      // 4. Redirect to WhatsApp (avoid popup blockers)
      window.location.href = whatsappLink;
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to process order.");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h1 className="cart-page__title">Your Cart</h1>

        {items.length === 0 ? (
          <div className="cart-page__empty" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '5rem 2rem', borderRadius: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem', animation: 'float 6s ease-in-out infinite' }}>
              <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(249, 115, 22, 0.3)', borderRadius: '50%', animation: 'spin 20s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '20px', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '50%', animation: 'spin 15s linear infinite reverse' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(249, 115, 22, 0.5)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="cart-page__empty-icon">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#fff' }}>Cart Empty</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '2rem' }}>No items detected in your payload. Explore the catalog to select your gear.</p>
            <Link href="/products" className="cart-page__continue-btn magnetic-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#000', padding: '1rem 2.5rem', borderRadius: '3rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', transition: 'transform 0.2s' }}>
              Access Catalog
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
                <span>Calculated via WhatsApp</span>
              </div>
              
              <div className="cart-page__summary-total">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleWhatsAppCheckout}
                className="cart-page__checkout-btn"
                style={{ background: '#25D366', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none', width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600, borderRadius: '0.5rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
