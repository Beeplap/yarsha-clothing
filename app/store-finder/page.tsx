import Link from "next/link";
import { MapPin, Clock, Phone, Navigation, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Store Finder | Yarsha Wears Outlets Nepal",
  description: "Find official Yarsha Wears retail stores across Kathmandu, Pokhara, Lalitpur, and Nepal.",
};

const STORES = [
  {
    city: "Kathmandu",
    name: "Yarsha Flagship Store — Durbar Marg",
    address: "Durbar Marg, Opp. Royal Palace, Kathmandu 44600",
    phone: "+977 01-4221199",
    hours: "Sun – Sat: 10:00 AM – 8:00 PM",
    status: "Open Now",
    features: ["Full Collection", "YarshaClub Rewards", "Express Pickup"],
  },
  {
    city: "Lalitpur",
    name: "Yarsha Studio — Labim Mall",
    address: "Level 2, Labim Mall, Pulchowk, Lalitpur 44700",
    phone: "+977 01-5538877",
    hours: "Sun – Sat: 10:30 AM – 8:30 PM",
    status: "Open Now",
    features: ["Sneaker Bar", "Personal Styling", "Free Fitting"],
  },
  {
    city: "Pokhara",
    name: "Yarsha Wears — Lakeside Outlet",
    address: "Lakeside Street No. 6, Pokhara 33700",
    phone: "+977 061-465522",
    hours: "Sun – Sat: 10:00 AM – 9:00 PM",
    status: "Open Now",
    features: ["Outdoor Gear", "Tourist Tax Refund", "Gift Cards"],
  },
  {
    city: "Chitwan",
    name: "Yarsha Express Store — Narayangarh",
    address: "Lions Chowk, Narayangarh, Chitwan 44200",
    phone: "+977 056-521144",
    hours: "Sun – Fri: 10:00 AM – 7:30 PM",
    status: "Open Now",
    features: ["New Arrivals", "Easy Exchange"],
  },
];

export default function StoreFinderPage() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Page Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem auto" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          RETAIL LOCATIONS
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 1rem 0" }}>
          Find a Yarsha Store
        </h1>
        <p style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)", fontSize: "1rem", lineHeight: 1.6 }}>
          Visit our official retail outlets across Nepal to experience our premium fabrics, get custom styling recommendations, and redeem YarshaClub points.
        </p>
      </div>

      {/* Stores Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {STORES.map((store, i) => (
          <div
            key={i}
            style={{
              border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
              borderRadius: "20px",
              padding: "2rem",
              backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "1.5rem"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)", padding: "4px 10px", borderRadius: "12px" }}>
                  {store.city}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a" }} />
                  {store.status}
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem 0" }}>{store.name}</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 80%, transparent)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPin size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  <span>{store.address}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Clock size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>{store.hours}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Phone size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>{store.phone}</span>
                </div>
              </div>

              {/* Store Perks */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "1.25rem" }}>
                {store.features.map((feat, fIdx) => (
                  <span key={fIdx} style={{ fontSize: "0.75rem", fontWeight: 600, backgroundColor: "color-mix(in srgb, var(--foreground) 6%, transparent)", padding: "4px 10px", borderRadius: "8px" }}>
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0.85rem",
                borderRadius: "12px",
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              <Navigation size={16} /> Get Directions
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
