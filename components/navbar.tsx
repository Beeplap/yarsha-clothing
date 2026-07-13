"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const { items } = useCart();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container">
          {/* Logo */}
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-text">YARSHA</span>
            <span className="navbar__logo-sub">CLOTHING</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar__link ${
                    pathname === link.href ? "navbar__link--active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="navbar__actions">
            {/* Search Icon */}
            <button className="navbar__icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* User / Auth */}
            {user ? (
              <div className="navbar__user-menu">
                <button className="navbar__icon-btn" aria-label="Account">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="navbar__signout-btn"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="navbar__auth-btn">
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="navbar__icon-btn" aria-label="Cart" style={{ position: "relative" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItemCount > 0 && (
                <span className="navbar__cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? "navbar__hamburger-line--open" : ""}`} />
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? "navbar__hamburger-line--open" : ""}`} />
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? "navbar__hamburger-line--open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__content">
          <ul className="mobile-menu__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-menu__link ${
                    pathname === link.href ? "mobile-menu__link--active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-menu__footer">
            {user ? (
              <button onClick={handleSignOut} className="mobile-menu__auth-btn">
                Sign Out
              </button>
            ) : (
              <Link href="/auth/login" className="mobile-menu__auth-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
