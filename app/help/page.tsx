import Link from "next/link";
import { Search, HelpCircle, Package, RefreshCw, Truck, CreditCard, Gift, PhoneCall, Mail, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Help & Customer Support | Yarsha Wears",
  description: "Find help, order assistance, delivery tracking, and contact customer care at Yarsha Wears.",
};

const CATEGORIES = [
  { icon: Package, title: "Orders & Tracking", desc: "Track shipments, modify items, and order status." },
  { icon: RefreshCw, title: "Returns & Exchanges", desc: "7-day easy returns policy and exchange guidelines." },
  { icon: Truck, title: "Delivery & Shipping", desc: "Shipping times and rates across Nepal." },
  { icon: CreditCard, title: "Payments & eSewa", desc: "Digital wallet, Stripe, COD, and card troubleshooting." },
  { icon: Gift, title: "YarshaClub Rewards", desc: "Earning 1 pt per Rs 100, welcome bonus, and redemption." },
  { icon: HelpCircle, title: "Product & Sizing", desc: "Size charts, care guides, and fabric details." },
];

export default function HelpPage() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Header Banner */}
      <div 
        style={{
          borderRadius: "24px",
          backgroundColor: "color-mix(in srgb, var(--foreground) 4%, var(--background))",
          border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
          padding: "3.5rem 2rem",
          textAlign: "center",
          marginBottom: "3.5rem"
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          CUSTOMER SUPPORT CENTER
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 1rem 0" }}>
          How can we help you today?
        </h1>
        
        {/* Help Search */}
        <div style={{ maxWidth: "550px", margin: "1.5rem auto 0 auto", position: "relative" }}>
          <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "color-mix(in srgb, var(--foreground) 40%, transparent)" }} />
          <input 
            type="text" 
            placeholder="Search questions, order help, returns..." 
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3rem",
              borderRadius: "30px",
              border: "1px solid color-mix(in srgb, var(--foreground) 20%, transparent)",
              backgroundColor: "var(--background)",
              fontSize: "0.95rem",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Support Categories Grid */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1.5rem" }}>
        Browse Help Topics
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link
              key={i}
              href="/faq"
              style={{
                padding: "2rem",
                borderRadius: "16px",
                border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Icon size={24} style={{ margin: "auto" }} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>{cat.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", margin: 0, lineHeight: 1.5 }}>{cat.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Direct Contact Cards */}
      <div 
        style={{
          borderRadius: "24px",
          border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
          padding: "2.5rem",
          backgroundColor: "color-mix(in srgb, var(--foreground) 3%, var(--background))",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2rem"
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <MessageSquare size={28} style={{ color: "#25D366", flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 0.25rem 0" }}>WhatsApp Support</h4>
            <p style={{ fontSize: "0.85rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", margin: "0 0 0.75rem 0" }}>Available 10 AM – 7 PM daily in Nepal.</p>
            <a href="https://wa.me/9766272646" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 800, fontSize: "0.85rem", textDecoration: "none" }}>Chat +977 9766272646 →</a>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Mail size={28} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 0.25rem 0" }}>Email Support</h4>
            <p style={{ fontSize: "0.85rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", margin: "0 0 0.75rem 0" }}>Response within 24 hours guaranteed.</p>
            <a href="mailto:support@yarshawears.com" style={{ color: "var(--accent)", fontWeight: 800, fontSize: "0.85rem", textDecoration: "none" }}>support@yarshawears.com →</a>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <PhoneCall size={28} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 0.25rem 0" }}>Phone Assistance</h4>
            <p style={{ fontSize: "0.85rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", margin: "0 0 0.75rem 0" }}>Call customer care directly.</p>
            <span style={{ color: "var(--foreground)", fontWeight: 800, fontSize: "0.85rem" }}>+977 01-4221199</span>
          </div>
        </div>
      </div>

    </div>
  );
}
