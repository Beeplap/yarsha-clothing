import Link from "next/link";
import { Truck, Clock, Shield, Gift, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Yarsha Wears",
  description: "Delivery times, shipping fees, free shipping for YarshaClub members, and courier coverage in Nepal.",
};

export default function ShippingPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Title */}
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          DELIVERY INFORMATION
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 0 0" }}>
          Shipping &amp; Delivery
        </h1>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
        
        <div style={{ padding: "2rem", borderRadius: "20px", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          <Truck size={36} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Kathmandu Valley</h3>
          <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
            Inside Kathmandu, Lalitpur, and Bhaktapur.
          </p>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>1 – 2 Business Days</div>
          <span style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>Flat Rs. 100 (Free for YarshaClub Members)</span>
        </div>

        <div style={{ padding: "2rem", borderRadius: "20px", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          <Clock size={36} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Outside Valley</h3>
          <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
            Pokhara, Chitwan, Dharan, Butwal, Biratnagar, and major cities.
          </p>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>2 – 4 Business Days</div>
          <span style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>Flat Rs. 150 (Free for YarshaClub Members)</span>
        </div>

      </div>

      {/* YarshaClub Free Shipping Feature Box */}
      <div 
        style={{
          borderRadius: "20px",
          backgroundColor: "color-mix(in srgb, var(--foreground) 4%, var(--background))",
          border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
          padding: "2.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "3.5rem"
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem" }}>
            <Gift size={16} /> YarshaClub Perk
          </div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0 0 0.5rem 0" }}>Enjoy FREE Delivery Nationwide</h3>
          <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 75%, transparent)", margin: 0, lineHeight: 1.5 }}>
            Create a free YarshaClub account today to instantly unlock zero delivery fees on all your orders plus 100 welcome reward points!
          </p>
        </div>

        <Link 
          href="/auth/signup" 
          style={{
            padding: "0.85rem 1.75rem",
            borderRadius: "30px",
            backgroundColor: "var(--accent)",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "0.85rem",
            textTransform: "uppercase"
          }}
        >
          Join Free
        </Link>
      </div>

    </div>
  );
}
