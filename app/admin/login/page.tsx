"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fetch the user's role to confirm admin/manager privilege
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error("Could not retrieve user profile.");
        }

        if (profile.role === "admin" || profile.role === "manager") {
          toast.success("Welcome to the Admin Control Panel");
          router.push("/admin");
          router.refresh();
        } else {
          // If NOT an admin/manager, log them out, show error, and send to landing page
          setError("Access denied: You do not have administrator permissions.");
          await supabase.auth.signOut();
          
          toast.error("Access Denied: Non-admin account redirected to landing page.");
          
          // Delay redirect slightly so they can see the message
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err?.message || "An authentication error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--background)" }}>
      <div className="auth-card" style={{ maxWidth: "450px", width: "100%", padding: "2.5rem", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}>
        
        {/* Back Link to Store */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--foreground)", opacity: 0.7, textDecoration: "none", marginBottom: "1.5rem", fontWeight: 600 }}>
          <ArrowLeft size={16} /> Return to Storefront
        </Link>

        <div className="auth-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" className="auth-logo" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.05em" }}>
            YARSHA
          </Link>
          <h1 className="auth-title" style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Admin Portal
          </h1>
          <p className="auth-subtitle" style={{ fontSize: "0.85rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)", marginTop: "0.25rem" }}>
            Sign in with authorized administrator credentials
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {error && (
            <div className="auth-error" style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "0.75rem 1rem", backgroundColor: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "8px", color: "#dc2626", fontSize: "0.8rem", fontWeight: 600 }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="email" className="auth-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Administrator Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "color-mix(in srgb, var(--foreground) 40%, transparent)" }} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yarsha.clothing"
                className="auth-input"
                style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem" }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="password" className="auth-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Secret Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "color-mix(in srgb, var(--foreground) 40%, transparent)" }} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
                style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.5rem" }}
                required
                autoComplete="current-password"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            style={{ width: "100%", padding: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", transition: "opacity 0.2s" }}
            disabled={loading}
          >
            {loading ? "Authenticating Admin..." : "Sign In to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
