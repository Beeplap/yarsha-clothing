"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Gift } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulateOAuth, setSimulateOAuth] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    setError(null);

    if (simulateOAuth) {
      const mockEmail = `${provider}-test-${Math.floor(Math.random() * 100000)}@yarshaclub.com`;
      const mockPassword = "demopassword123";
      const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Test User`;

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: mockEmail,
          password: mockPassword,
          options: {
            data: {
              full_name: mockName,
              role: "customer",
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          router.push("/account");
          router.refresh();
        }
      } catch (err: any) {
        setError(err?.message || "Demo login failed");
        setLoading(false);
      }
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in with provider");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const redirectPath =
        profile?.role === "admin" || profile?.role === "manager"
          ? "/admin"
          : "/account";

      router.push(redirectPath);
      router.refresh();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            YARSHA
          </Link>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your YarshaClub account</p>
        </div>

        {/* Social Auth Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
            className="auth-button"
            style={{
              backgroundColor: "transparent",
              color: "var(--foreground)",
              border: "1px solid color-mix(in srgb, var(--foreground) 18%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={loading}
            className="auth-button"
            style={{
              backgroundColor: "#1877F2",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>

          {/* Simulation Switch */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)", padding: "0 0.5rem", marginTop: "0.5rem" }}>
            <span>OAuth credentials not configured?</span>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 700, color: "var(--accent)" }}>
              <input
                type="checkbox"
                checked={simulateOAuth}
                onChange={(e) => setSimulateOAuth(e.target.checked)}
                style={{ accentColor: "var(--accent)" }}
              />
              Simulate Sign In
            </label>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "1rem 0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "color-mix(in srgb, var(--foreground) 40%, transparent)" }}>
          Or sign in with email
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && (
            <div className="auth-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.75" fill="currentColor" />
              </svg>
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="auth-link">
            Join YarshaClub (Get 100 Pts)
          </Link>
        </p>
      </div>
    </div>
  );
}
