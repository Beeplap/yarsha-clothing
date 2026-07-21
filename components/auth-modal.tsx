"use client";

import { useState } from "react";
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

  const supabase = createClient();

  if (!isOpen) return null;

  const handleOAuthSignIn = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    setError(null);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-[var(--background)] text-[var(--foreground)] border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* YarshaClub Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Sparkles size={160} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-bold uppercase px-3 py-1 rounded-full backdrop-blur-md tracking-wider flex items-center gap-1">
                <Sparkles size={14} /> YarshaClub Rewards
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight uppercase">
              {mode === "signup" ? "Join YarshaClub Today" : "Welcome Back"}
            </h2>
            <p className="text-xs text-white/90 mt-1 max-w-xs leading-relaxed">
              Unlock exclusive benefits, instant signup rewards, free shipping & earn 1 point for every Rs 100 spent!
            </p>

            {/* Perks Strip */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <Gift size={15} className="text-yellow-300 shrink-0" />
                <span>100 Signup Pts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-yellow-300 shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coins size={15} className="text-yellow-300 shrink-0" />
                <span>Daily Rewards</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-full bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
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
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                  mode === "signin"
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                }`}
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Social Authentication Options */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] bg-[var(--background)] hover:bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] transition-colors text-xs font-bold tracking-wide"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("facebook")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] bg-[#1877F2] text-white hover:opacity-90 transition-opacity text-xs font-bold"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("apple")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity text-xs font-bold"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.61.71-1.15 1.87-.99 2.99 1.09.08 2.22-.54 2.88-1.36z" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] w-full" />
              <span className="absolute bg-[var(--background)] px-3 text-[10px] font-bold tracking-wider uppercase text-[var(--foreground)]/50">
                Or with email address
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--foreground)]/80">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      required={mode === "signup"}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--foreground)]/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--foreground)]/80">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_18%,transparent)] bg-transparent text-sm font-medium placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full bg-[var(--accent)] text-white font-extrabold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 mt-2"
              >
                {loading
                  ? "Processing..."
                  : mode === "signup"
                  ? "Join YarshaClub & Claim 100 Points"
                  : "Sign In to Account"}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-center text-[var(--foreground)]/50">
              By continuing, you agree to Yarsha Wears Terms of Service & Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
