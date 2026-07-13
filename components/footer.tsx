"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="footer">
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
        <div className="footer__divider" />

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
