"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const AMOUNTS = [1000, 2500, 5000, 10000];

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(2500);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error("Please enter recipient email");
      return;
    }
    toast.success(`Gift card of Rs. ${selectedAmount.toLocaleString()} generated for ${recipientName || recipientEmail}! Redirecting to checkout...`);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 3.5rem auto" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          THE PERFECT GIFT
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 1rem 0" }}>
          Yarsha Digital Gift Cards
        </h1>
        <p style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)", fontSize: "1rem", lineHeight: 1.6 }}>
          Give the gift of choice. Digital gift cards are delivered instantly via email and can be redeemed online or at any Yarsha store outlet.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "start" }}>
        
        {/* Gift Card Preview Graphic */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div 
            style={{
              aspectRatio: "1.58/1",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #111111 0%, #222222 50%, #333333 100%)",
              color: "#ffffff",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            <div style={{ position: "absolute", right: "-30px", bottom: "-30px", opacity: 0.15 }}>
              <Gift size={220} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "2px" }}>YARSHA</span>
                <span style={{ fontSize: "0.65rem", display: "block", letterSpacing: "3px", opacity: 0.7 }}>GIFT CARD</span>
              </div>
              <Sparkles size={24} style={{ color: "var(--accent)" }} />
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, display: "block" }}>VALUE</span>
              <span style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.5px" }}>Rs. {selectedAmount.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 75%, transparent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} /> Instant delivery via Email or SMS
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} /> Valid for 12 months from purchase date
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} /> Earns YarshaClub rewards points upon purchase
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePurchase} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", padding: "2rem", borderRadius: "20px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
          
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
              1. SELECT AMOUNT (NPR)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    border: selectedAmount === amt ? "2px solid var(--accent)" : "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                    backgroundColor: selectedAmount === amt ? "color-mix(in srgb, var(--accent) 10%, var(--background))" : "transparent",
                    color: selectedAmount === amt ? "var(--accent)" : "var(--foreground)",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "0.95rem"
                  }}
                >
                  Rs. {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
              2. RECIPIENT EMAIL
            </label>
            <input 
              type="email" 
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="friend@example.com"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                backgroundColor: "var(--background)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
              3. RECIPIENT NAME (OPTIONAL)
            </label>
            <input 
              type="text" 
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Full Name"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                backgroundColor: "var(--background)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
              4. GIFT MESSAGE
            </label>
            <textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enjoy your gift! Happy Shopping..."
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                backgroundColor: "var(--background)",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "30px",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              fontWeight: 800,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "0.5rem"
            }}
          >
            Buy Gift Card (Rs. {selectedAmount.toLocaleString()}) <ArrowRight size={16} />
          </button>
        </form>

      </div>

    </div>
  );
}
