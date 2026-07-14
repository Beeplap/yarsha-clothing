"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";
import gsap from "gsap";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const { items } = useCart();

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
    // Avoid synchronous state update in effect
    const timeout = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // GSAP entrance animation
  useEffect(() => {
    if (hasAnimated.current) return;
    if (!logoRef.current || !linksRef.current || !actionsRef.current) return;
    hasAnimated.current = true;

    const logo = logoRef.current;
    const linkItems = linksRef.current.querySelectorAll("li");
    const actions = actionsRef.current;

    gsap.set(logo, { x: -40, opacity: 0 });
    gsap.set(linkItems, { y: -15, opacity: 0 });
    gsap.set(actions, { x: 40, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(logo, {
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
    })
      .to(
        linkItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .to(
        actions,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Collections" },
    { href: "/about", label: "About" },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
        style={{
          ...(scrolled
            ? {
                backgroundColor: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }
            : {}),
        }}
      >
        <div className="navbar__container">
          {/* Logo */}
          <Link href="/" className="navbar__logo" ref={logoRef}>
            <span className="navbar__logo-text" style={{ color: "#fff" }}>
              YARSHA
            </span>
            <span
              className="navbar__logo-sub"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              CLOTHING
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar__links" ref={linksRef}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar__link ${
                    pathname === link.href ? "navbar__link--active" : ""
                  }`}
                  style={{
                    color:
                      pathname === link.href
                        ? "#fff"
                        : "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      pathname === link.href
                        ? "#fff"
                        : "rgba(255,255,255,0.6)")
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="navbar__actions" ref={actionsRef}>
            {/* Search Icon */}
            <button
              className="navbar__icon-btn"
              aria-label="Search"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* User / Auth */}
            {user ? (
              <div className="navbar__user-menu">
                <button
                  className="navbar__icon-btn"
                  aria-label="Account"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="navbar__signout-btn"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="navbar__auth-btn"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="navbar__icon-btn"
              aria-label="Cart"
              style={{ position: "relative", color: "rgba(255,255,255,0.7)" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
            <span
              className={`navbar__hamburger-line ${
                mobileMenuOpen ? "navbar__hamburger-line--open" : ""
              }`}
              style={{ backgroundColor: "#fff" }}
            />
            <span
              className={`navbar__hamburger-line ${
                mobileMenuOpen ? "navbar__hamburger-line--open" : ""
              }`}
              style={{ backgroundColor: "#fff" }}
            />
            <span
              className={`navbar__hamburger-line ${
                mobileMenuOpen ? "navbar__hamburger-line--open" : ""
              }`}
              style={{ backgroundColor: "#fff" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? "mobile-menu--open" : ""}`}
        style={{
          backgroundColor: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="mobile-menu__content">
          <ul className="mobile-menu__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-menu__link ${
                    pathname === link.href ? "mobile-menu__link--active" : ""
                  }`}
                  style={{
                    color:
                      pathname === link.href
                        ? "#fff"
                        : "rgba(255,255,255,0.6)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-menu__footer">
            {user ? (
              <button
                onClick={handleSignOut}
                className="mobile-menu__auth-btn"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="mobile-menu__auth-btn"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
