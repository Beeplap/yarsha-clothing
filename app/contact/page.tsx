"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you! Your message has been received.");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      
      {/* Title */}
      <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem auto" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          GET IN TOUCH
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 1rem 0" }}>
          Contact Us
        </h1>
        <p style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)", fontSize: "1rem", lineHeight: 1.6 }}>
          Have a question about our clothing, your order, or YarshaClub membership? We are here to help.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
        
        {/* Info Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", padding: "2rem", borderRadius: "20px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1.5rem 0" }}>Contact Details</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <MapPin size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "3px" }} />
                <div>
                  <strong style={{ display: "block" }}>Headquarters</strong>
                  <span style={{ color: "color-mix(in srgb, var(--foreground) 75%, transparent)" }}>Yarsha Byte Headquarters, Durbar Marg, Kathmandu 44600, Nepal</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Mail size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "3px" }} />
                <div>
                  <strong style={{ display: "block" }}>Email Us</strong>
                  <span style={{ color: "color-mix(in srgb, var(--foreground) 75%, transparent)" }}>support@yarshawears.com</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Phone size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "3px" }} />
                <div>
                  <strong style={{ display: "block" }}>Customer Phone</strong>
                  <span style={{ color: "color-mix(in srgb, var(--foreground) 75%, transparent)" }}>+977 01-4221199 (10 AM – 7 PM NPR)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div>
          {submitted ? (
            <div style={{ padding: "3rem 2rem", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", borderRadius: "20px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))", textAlign: "center" }}>
              <CheckCircle2 size={48} style={{ color: "#16a34a", margin: "0 auto 1rem auto" }} />
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Message Sent!</h3>
              <p style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)", fontSize: "0.95rem" }}>
                Thank you for reaching out, {name}. A member of our support team will reply to <strong>{email}</strong> within 24 hours.
              </p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: "1.5rem", padding: "0.75rem 1.5rem", borderRadius: "24px", backgroundColor: "var(--foreground)", color: "var(--background)", border: "none", fontWeight: 800, cursor: "pointer" }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", padding: "2rem", borderRadius: "20px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>Send a Message</h3>
              
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>YOUR NAME</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ram Shrestha" 
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", backgroundColor: "var(--background)", outline: "none" }} 
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="ram@example.com" 
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", backgroundColor: "var(--background)", outline: "none" }} 
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>MESSAGE</label>
                <textarea 
                  rows={4} 
                  required 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="How can we help?" 
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", backgroundColor: "var(--background)", outline: "none", resize: "none" }} 
                />
              </div>

              <button type="submit" style={{ width: "100%", padding: "0.9rem", borderRadius: "24px", backgroundColor: "var(--foreground)", color: "var(--background)", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textTransform: "uppercase" }}>
                Send Message <Send size={16} />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
