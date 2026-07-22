import Link from "next/link";
import { RefreshCw, Package, Truck, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Orders & Returns | Yarsha Wears Nepal",
  description: "Learn about 7-day hassle-free returns, order exchanges, tracking, and refunds at Yarsha Wears.",
};

export default function OrdersReturnsPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Title */}
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          POLICIES & ASSISTANCE
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 0 0" }}>
          Orders &amp; Returns
        </h1>
      </div>

      {/* Grid Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
        <div style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          <RefreshCw size={32} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>7-Day Easy Returns</h3>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", lineHeight: 1.5, margin: 0 }}>
            Return any unworn, unwashed item with tags attached within 7 days of delivery for a full refund or exchange.
          </p>
        </div>

        <div style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          <Package size={32} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Free Size Exchange</h3>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", lineHeight: 1.5, margin: 0 }}>
            Wrong size? We exchange your items at no extra delivery fee in Kathmandu Valley and major cities.
          </p>
        </div>

        <div style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          <ShieldCheck size={32} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Instant Refund Processing</h3>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", lineHeight: 1.5, margin: 0 }}>
            Refunds are issued directly to your eSewa, bank account, or as store credit with bonus points.
          </p>
        </div>
      </div>

      {/* Detailed Steps Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>How to Initiate a Return</h2>
          <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
            <li>Go to your <Link href="/account/orders" style={{ color: "var(--accent)", fontWeight: 700 }}>Account Orders Page</Link> or contact our customer team via WhatsApp/Phone.</li>
            <li>Select the order and items you wish to return or exchange.</li>
            <li>Pack the items securely in their original packaging with price tags intact.</li>
            <li>Our courier partner will pick up the parcel from your doorstep or you can drop it at any Yarsha store outlet.</li>
          </ol>
        </section>

        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>Non-Returnable Items</h2>
          <p style={{ fontSize: "0.95rem", color: "color-mix(in srgb, var(--foreground) 80%, transparent)", lineHeight: 1.6 }}>
            For hygiene reasons, innerwear, socks, and bodysuits cannot be returned once opened unless damaged upon delivery.
          </p>
        </section>

        {/* CTA */}
        <div style={{ padding: "2rem", borderRadius: "16px", backgroundColor: "color-mix(in srgb, var(--foreground) 4%, var(--background))", border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.25rem 0" }}>Need help with an order?</h3>
            <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", margin: 0 }}>View your recent purchases or track live shipments.</p>
          </div>
          <Link href="/account/orders" style={{ padding: "0.75rem 1.5rem", borderRadius: "24px", backgroundColor: "var(--foreground)", color: "var(--background)", textDecoration: "none", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase" }}>
            My Orders →
          </Link>
        </div>

      </div>

    </div>
  );
}
