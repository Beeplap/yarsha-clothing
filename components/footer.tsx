"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const footer = footerRef.current;

    const ctx = gsap.context(() => {
      // Stagger grid columns fading up
      const gridCols = footer.querySelectorAll(
        ".footer__brand, .footer__col"
      );
      if (gridCols.length > 0) {
        gsap.set(gridCols, { y: 40, opacity: 0 });

        ScrollTrigger.create({
          trigger: footer,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(gridCols, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
            });
          },
        });
      }

      // Glowing divider line animation
      const divider = dividerRef.current;
      if (divider) {
        // Set initial state — a subtle gradient line
        gsap.set(divider, {
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
          backgroundSize: "200% 100%",
          backgroundPosition: "-100% 0",
          height: "1px",
        });

        ScrollTrigger.create({
          trigger: divider,
          start: "top 90%",
          toggleActions: "play none none none",
          onEnter: () => {
            // Sweep glow across
            gsap.to(divider, {
              backgroundImage:
                "linear-gradient(90deg, transparent, rgba(0,255,200,0.4), rgba(120,0,255,0.3), transparent)",
              backgroundPosition: "100% 0",
              duration: 1.5,
              ease: "power2.inOut",
            });
            // Then settle to a subtle glow
            gsap.to(divider, {
              backgroundImage:
                "linear-gradient(90deg, transparent 5%, rgba(0,255,200,0.15) 30%, rgba(120,0,255,0.1) 70%, transparent 95%)",
              backgroundPosition: "0% 0",
              delay: 1.5,
              duration: 1,
              ease: "power1.out",
            });
          },
        });
      }

      // Bottom section fade in
      const bottomSection = footer.querySelector(".footer__bottom");
      if (bottomSection) {
        gsap.set(bottomSection, { y: 20, opacity: 0 });
        ScrollTrigger.create({
          trigger: bottomSection,
          start: "top 95%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(bottomSection, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: 0.3,
            });
          },
        });
      }
    }, footer);

    return () => {
      ctx.revert();
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__container">
        {/* Top Section */}
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <span className="footer__logo-text">YARSHA</span>
              <span className="footer__logo-sub">CLOTHING</span>
            </Link>
            <p className="footer__tagline">
              Premium clothing crafted with purpose. A sub-brand of Yarsha Byte.
            </p>
          </div>

          {/* Shop Column */}
          <div className="footer__col">
            <h3 className="footer__heading">Shop</h3>
            <ul className="footer__links">
              <li><Link href="/products">All Collections</Link></li>
              <li><Link href="/products?category=new">New Arrivals</Link></li>
              <li><Link href="/products?featured=true">Featured</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer__col">
            <h3 className="footer__heading">Company</h3>
            <ul className="footer__links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="footer__col">
            <h3 className="footer__heading">Help</h3>
            <ul className="footer__links">
              <li><Link href="/shipping">Shipping &amp; Returns</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider" ref={dividerRef} />

        {/* Bottom Section */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} Yarsha Clothing. A sub-brand of{" "}
            <a
              href="https://yarshabyte.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__ext-link"
            >
              Yarsha Byte
            </a>
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram" className="footer__social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="footer__social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="footer__social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
