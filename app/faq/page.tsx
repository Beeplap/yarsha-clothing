"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I earn YarshaClub points?",
    a: "You earn 1 YarshaClub point for every Rs. 100 spent on Yarsha Wears. You also receive 100 bonus points upon signup, plus daily sign-in streak points!",
  },
  {
    q: "What is the value of 1 YarshaClub point?",
    a: "100 YarshaClub points are equivalent to Rs. 1. Points can be redeemed directly at checkout to discount your total bill.",
  },
  {
    q: "How long does shipping take inside Kathmandu Valley?",
    a: "Orders inside Kathmandu, Lalitpur, and Bhaktapur are delivered within 1 to 2 business days. Members get free shipping!",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept eSewa, Stripe (Credit/Debit Card), Khalti, and Cash on Delivery (COD) across Nepal.",
  },
  {
    q: "What is your return & exchange policy?",
    a: "We offer a 7-day hassle-free return and exchange policy on all unworn items with tags attached.",
  },
  {
    q: "Where are Yarsha retail outlets located?",
    a: "Our stores are located at Durbar Marg (Kathmandu), Labim Mall (Lalitpur), Lakeside (Pokhara), and Narayangarh (Chitwan).",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          GOT QUESTIONS?
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 1rem 0" }}>
          Frequently Asked Questions
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              style={{
                border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))"
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  color: "var(--foreground)",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
              </button>

              {isOpen && (
                <div style={{ padding: "0 1.5rem 1.25rem 1.5rem", color: "color-mix(in srgb, var(--foreground) 75%, transparent)", fontSize: "0.95rem", lineHeight: 1.6, borderTop: "1px solid color-mix(in srgb, var(--foreground) 8%, transparent)" }}>
                  <p style={{ margin: "0.75rem 0 0 0" }}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
