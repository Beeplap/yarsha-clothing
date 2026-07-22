"use client";

import { useState } from "react";
import { User, Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPass("");
    setNewPass("");
  };

  return (
    <div style={{ fontFamily: "var(--body-font)", maxWidth: "600px" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.5rem" }}>Account Settings</h1>
      <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", marginBottom: "2rem" }}>
        Update your profile details and security credentials.
      </p>

      {/* Profile Info Form */}
      <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", padding: "1.75rem", borderRadius: "16px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <User size={18} style={{ color: "var(--accent)" }} /> Profile Details
        </h3>

        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>FULL NAME</label>
          <input type="text" placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
        </div>

        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>PHONE NUMBER</label>
          <input type="text" placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
        </div>

        <button type="submit" style={{ padding: "0.75rem", borderRadius: "20px", backgroundColor: "var(--foreground)", color: "var(--background)", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <Save size={16} /> Save Profile
        </button>
      </form>

      {/* Password Security Form */}
      <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)", padding: "1.75rem", borderRadius: "16px", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <Lock size={18} style={{ color: "var(--accent)" }} /> Security &amp; Password
        </h3>

        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>CURRENT PASSWORD</label>
          <input type="password" required value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
        </div>

        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>NEW PASSWORD</label>
          <input type="password" required value={newPass} onChange={(e) => setNewPass(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
        </div>

        <button type="submit" style={{ padding: "0.75rem", borderRadius: "20px", backgroundColor: "var(--accent)", color: "#ffffff", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <ShieldCheck size={16} /> Update Password
        </button>
      </form>
    </div>
  );
}
