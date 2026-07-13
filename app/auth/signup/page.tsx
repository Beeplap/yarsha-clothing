"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              YARSHA
            </Link>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">
              We&apos;ve sent a confirmation link to{" "}
              <strong>{email}</strong>. Click it to activate your account.
            </p>
          </div>
          <Link href="/auth/login" className="auth-button" style={{ textAlign: "center", textDecoration: "none" }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            YARSHA
          </Link>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join the Yarsha Clothing community</p>
        </div>

        <form onSubmit={handleSignUp} className="auth-form">
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
            <label htmlFor="fullName" className="auth-label">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="auth-input"
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Min. 6 characters"
              className="auth-input"
              required
              autoComplete="new-password"
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
              "Create Account"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/auth/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
