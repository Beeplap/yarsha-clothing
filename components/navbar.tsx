"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";
import { menuLinks } from "@/data/nav";
import { Search, User as UserIcon, Heart, ShoppingBag, Menu, X, Sparkles, LogOut, Package, Gift, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AuthModal from "@/components/auth-modal";
import type { Profile } from "@/types/database";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signup");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { items } = useCart();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMobileMenuOpen(false);
      setHoveredCategory(null);
      setUserDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalMode("signin");
      setAuthModalOpen(true);
    } else {
      setUserDropdownOpen(!userDropdownOpen);
    }
  };

  const handleJoinClubClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalMode("signup");
      setAuthModalOpen(true);
    } else {
      router.push("/account");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserDropdownOpen(false);
    router.push("/");
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className="w-full bg-[var(--background)] relative z-50 shadow-sm font-sans">
        {/* Top Utility Bar */}
        <div className="hidden md:flex justify-end items-center px-8 py-1.5 text-xs font-medium text-[var(--foreground)]/80 space-x-4 bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))] border-b border-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
          <Link href="/store-finder" className="hover:underline">store finder</Link>
          <Link href="/help" className="hover:underline">help</Link>
          <Link href="/orders-returns" className="hover:underline">orders and returns</Link>
          <Link href="/gift-cards" className="hover:underline">gift cards</Link>
          <button 
            onClick={handleJoinClubClick} 
            className="hover:underline font-bold text-[var(--accent)] flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-xs"
          >
            <Sparkles size={12} /> Join YarshaClub (100 Pts)
          </button>
        </div>

        {/* Main Navbar */}
        <div className="flex items-center justify-between px-4 md:px-8 h-16 md:h-20 bg-[var(--background)] relative">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <svg className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent)]" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 0L0 200H50L125 50L100 0Z" />
              <path d="M150 0L50 200H100L175 50L150 0Z" />
              <path d="M200 0L100 200H150L225 50L200 0Z" />
            </svg>
            <span className="font-bold text-xl tracking-tighter hidden lg:block uppercase">Yarsha</span>
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden md:flex flex-1 justify-center h-full">
            <ul className="flex items-center space-x-6 h-full">
              {menuLinks.map((category) => (
                <li
                  key={category.label}
                  className="h-full flex items-center"
                  onMouseEnter={() => setHoveredCategory(category.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={category.href}
                    className={`text-sm font-bold tracking-widest text-[var(--foreground)] hover:underline underline-offset-8 decoration-2 ${category.label === 'SALE' ? 'text-[var(--accent)]' : ''}`}
                  >
                    {category.label}
                  </Link>
                  
                  {/* Mega Menu */}
                  {category.megaMenu && hoveredCategory === category.label && (
                    <div className="absolute top-full left-0 w-full bg-[var(--background)] border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] shadow-xl py-8 px-8 flex justify-center space-x-16 transition-opacity duration-200 z-50">
                      {category.megaMenu.map((col) => (
                        <div key={col.title} className="flex flex-col min-w-[150px]">
                          <h3 className="font-bold text-sm mb-4 tracking-wider text-[var(--foreground)]">{col.title}</h3>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link href={link.href} className="text-[var(--foreground)]/70 text-sm hover:text-[var(--foreground)] hover:underline">
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="hidden lg:flex items-center bg-[var(--menu-bg)] rounded-sm px-3 py-1.5 focus-within:ring-1 focus-within:ring-[var(--foreground)] transition-all">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-[var(--foreground)]/60 text-[var(--foreground)]"
              />
              <Search size={18} className="text-[var(--foreground)] ml-2" />
            </div>
            
            {/* Account Icon Button */}
            <div className="relative">
              <button 
                onClick={handleAccountClick} 
                className="text-[var(--foreground)] hover:opacity-70 p-1 flex items-center gap-1 rounded-full border-none bg-transparent cursor-pointer"
                title={user ? "Account Dashboard" : "Sign In / Join YarshaClub"}
              >
                <UserIcon size={22} />
                {user && <ChevronDown size={14} className="opacity-70" />}
              </button>

              {/* User Dropdown Menu for Logged In Users */}
              <AnimatePresence>
                {userDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-[var(--background)] border border-[color-mix(in_srgb,var(--foreground)_15%,transparent)] rounded-2xl shadow-2xl py-3 px-4 z-50 text-[var(--foreground)]"
                  >
                    <div className="border-b border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] pb-3 mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/60">Signed in as</p>
                      <p className="text-sm font-black truncate">{profile?.full_name || user.email}</p>
                      <p className="text-xs text-[var(--foreground)]/60 truncate">{user.email}</p>

                      {/* YarshaClub Rewards Badge */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift size={16} className="text-[var(--accent)]" />
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">YarshaClub Member</p>
                            <p className="text-xs font-black">{profile?.points ?? 100} Points (Rs. {((profile?.points ?? 100) / 100).toFixed(2)})</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-[var(--accent)] text-white px-2 py-0.5 rounded-full uppercase">
                          Free Ship
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 py-1 text-sm font-semibold">
                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
                      >
                        <UserIcon size={16} />
                        <span>My Account</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
                      >
                        <Package size={16} />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-colors"
                      >
                        <Heart size={16} />
                        <span>Saved Items</span>
                      </Link>
                    </div>

                    <div className="border-t border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] pt-2 mt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm font-bold bg-transparent border-none cursor-pointer text-left"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/wishlist" className="hidden sm:block text-[var(--foreground)] hover:opacity-70 p-1">
              <Heart size={22} />
            </Link>
            <Link href="/cart" className="text-[var(--foreground)] hover:opacity-70 p-1 relative">
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[var(--accent)] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 top-[64px] bg-[var(--background)] z-40 overflow-y-auto pb-20"
            >
              <div className="p-4 space-y-6">
                {menuLinks.map((category) => (
                  <div key={category.label}>
                    <Link
                      href={category.href}
                      className={`block text-xl font-bold mb-4 ${category.label === 'SALE' ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}
                    >
                      {category.label}
                    </Link>
                    {category.megaMenu && (
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        {category.megaMenu.map((col) => (
                          <div key={col.title}>
                            <h4 className="font-semibold text-sm mb-2">{col.title}</h4>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-[var(--foreground)]/70 text-sm">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    <hr className="my-4 border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]" />
                  </div>
                ))}
                <div className="space-y-4 pt-4 text-sm font-medium">
                  <button 
                    onClick={handleJoinClubClick}
                    className="block text-[var(--accent)] font-bold text-left bg-transparent border-none p-0 text-base"
                  >
                    Join YarshaClub (100 Bonus Pts)
                  </button>
                  <Link href="/store-finder" className="block text-[var(--foreground)]/80">Store Finder</Link>
                  <Link href="/help" className="block text-[var(--foreground)]/80">Help</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal for Email / YarshaClub Sign Up / Social Logins */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) fetchProfile(user.id);
          });
        }}
      />
    </>
  );
}
