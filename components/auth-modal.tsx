"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Sparkles, Gift, Truck, Coins, ShieldCheck, Mail, Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "signup",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulateOAuth, setSimulateOAuth] = useState(false);

  const supabase = createClient();

  // Notify hero blob to hide/show on mobile when the auth panel opens/closes
  useEffect(() => {
    if (!isOpen) return;
    window.dispatchEvent(new Event("yarsha:auth-open"));
    return () => {
      window.dispatchEvent(new Event("yarsha:auth-close"));
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
          toast.success(`Demo ${provider} login simulated successfully!`);
          if (onSuccess) onSuccess();
          onClose();
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
      setError(err instanceof Error ? err.message : "Failed to initiate social sign in");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split("@")[0],
              role: "customer", // General user role
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          toast.success("Welcome to YarshaClub! 🎁 100 Welcome Points awarded to your account.");
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          toast.success("Signed in successfully!");
          if (onSuccess) onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-50 flex">
        {/* Left backdrop — clicking it closes the panel (desktop only) */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden md:block flex-1 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        />

        {/* Right panel — full width on mobile, fixed width on desktop */}
        <motion.div
          key="panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full md:w-[480px] lg:w-[520px] h-full bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-y-auto shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] transition-colors z-10"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* YarshaClub Banner */}
          <div className="bg-gradient-to-br from-[#2a1a0e] via-[#3d2010] to-[#1e1008] text-white px-8 py-8 relative overflow-hidden flex-shrink-0">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Sparkles size={200} />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs font-bold uppercase px-3 py-1 rounded-full backdrop-blur-md tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} /> YarshaClub Rewards
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight uppercase leading-tight">
              {mode === "signup" ? "Join YarshaClub Today" : "Welcome Back"}
            </h2>
            <p className="text-sm text-white/90 mt-2 max-w-xs leading-relaxed">
              Unlock exclusive benefits, instant signup rewards, free shipping &amp; earn 1 point for every Rs 100 spent!
            </p>

            {/* Perks Strip */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/20 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-yellow-300 shrink-0" />
                <span>100 Signup Pts</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-yellow-300 shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-yellow-300 shrink-0" />
                <span>Daily Rewards</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 px-8 py-8">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-full bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] p-1 mb-7">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                  mode === "signup"
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                }`}
              >
                Join YarshaClub (100 Pts)
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                  mode === "signin"
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                }`}
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Social Authentication Options */}
            <div className="space-y-3 mb-7">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] bg-[var(--background)] hover:bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] transition-colors text-sm font-bold tracking-wide"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] bg-[#1877F2] text-white hover:opacity-90 transition-opacity text-sm font-bold"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>

              {/* Simulation Switch */}
              <div className="flex items-center justify-between text-xs text-[var(--foreground)]/60 px-1 mt-3">
                <span>OAuth credentials not configured?</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[var(--accent)] hover:opacity-80">
                  <input
                    type="checkbox"
                    checked={simulateOAuth}
                    onChange={(e) => setSimulateOAuth(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  Simulate Social Sign In
                </label>
              </div>
            </div>

            <div className="relative flex items-center justify-center mb-7">
              <div className="border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] w-full" />
              <span className="absolute bg-[var(--background)] px-3 text-[10px] font-bold tracking-wider uppercase text-[var(--foreground)]/50">
                Or with email address
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      required={mode === "signup"}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[var(--accent)] text-white font-extrabold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 mt-1"
              >
                {loading
                  ? "Processing..."
                  : mode === "signup"
                  ? "Join YarshaClub & Claim 100 Points"
                  : "Sign In to Account"}
              </button>
            </form>

            <p className="mt-5 text-[11px] text-center text-[var(--foreground)]/50">
              By continuing, you agree to Yarsha Wears Terms of Service &amp; Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
