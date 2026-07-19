"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import { ArrowRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { socialLinks } from "@/data/socials";

const shopLinks = [
  { label: "All Collections", href: "/products" },
  { label: "New Arrivals", href: "/products?category=new" },
  { label: "Best Sellers", href: "/products?category=best-sellers" },
  { label: "Accessories", href: "/products?category=accessories" },
] as const;

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact Us", href: "/contact" },
] as const;

const smallLabelClass =
  "text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-background/50";

const footerLinkClass =
  "w-fit text-background/60 transition-colors hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background";

function SocialIcon({
  label,
}: {
  label: (typeof socialLinks)[number]["label"];
}) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.756 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.402-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
  }

  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.125 0-2.517.236-2.517 1.428v2.547h3.739l-.498 3.667h-3.24V24h-4.564v-.309z"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path fill="currentColor" d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
  );
}

function AnimatedContactTitle({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <h2 className={className}>
      {lines.map((line, li) => {
        const words = line.trim().split(/\s+/);
        return (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <span key={wi} className="inline-block">
                <span className="inline-block overflow-hidden align-bottom leading-[0.88] pb-[0.05em] -mb-[0.05em]">
                  {word.split("").map((char, ci) => (
                    <span key={ci} data-contact-char className="inline-block will-change-transform">
                      {char}
                    </span>
                  ))}
                </span>
                {wi < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </span>
        );
      })}
    </h2>
  );
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const siteFrame = document.querySelector<HTMLElement>(".site-frame");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      const charSpans = gsap.utils.toArray<HTMLElement>("[data-contact-char]", section);
      if (!reduceMotion && charSpans.length > 0) {
        gsap.set(charSpans, { y: "100%" });
      }

      const initTitleAnimation = () => {
        if (reduceMotion || charSpans.length === 0) return;
        
        const isLenisActive = siteFrame?.dataset.lenisReady === "true";
        const scroller: HTMLElement | Window = isLenisActive ? siteFrame! : window;

        gsap.to(charSpans, {
          y: "0%",
          duration: 1.2,
          stagger: 0.02,
          ease: "power4.out",
          scrollTrigger: {
            trigger: charSpans[0].closest("h2"),
            scroller,
            start: "top 90%",
          },
        });
      };

      const waitsForLenis =
        window.matchMedia("(min-width: 1024px)").matches &&
        window.matchMedia("(pointer: fine)").matches;

      if (!waitsForLenis || siteFrame?.dataset.lenisReady === "true") {
        initTitleAnimation();
      } else if (siteFrame) {
        window.addEventListener("lenis:ready", initTitleAnimation, {
          once: true,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative bg-foreground text-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid gap-12 border-b border-background/15 pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-background/60">
              <span className="size-1.5 rounded-full bg-background/60" />
              Join the collective
            </p>
            <AnimatedContactTitle
              lines={["Elevate your", "wardrobe"]}
              className="mt-6 font-display text-[clamp(2.5rem,5vw,5.5rem)] uppercase leading-[0.95] tracking-[-0.02em]"
            />
          </div>

          <div className="w-full max-w-sm lg:w-80">
            <p className="mb-4 text-sm text-background/60">
              Sign up for exclusive updates, new arrivals, and insider-only discounts.
            </p>
            <form className="group relative flex items-center border-b border-background/30 pb-2 transition-colors focus-within:border-background hover:border-background">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm placeholder:text-background/40 focus:outline-none"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center p-1 transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8 lg:py-16">
          <section className="max-w-sm">
            <Link href="/" className="inline-block text-xl font-bold uppercase tracking-widest">
              Yarsha Wears
            </Link>
            <p className="mt-5 text-sm leading-6 text-background/60">
              Crafting premium apparel that blends modern aesthetics with timeless comfort. Designed for the bold and ambitious.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-background/60">
              <a
                href="mailto:hello@yarshawears.com"
                className={`${footerLinkClass} inline-flex items-center gap-3 hover:text-background`}
              >
                <Mail className="size-4" aria-hidden="true" />
                <span>hello@yarshawears.com</span>
              </a>
              <span className="inline-flex items-center gap-3">
                <MapPin className="size-4" aria-hidden="true" />
                Butwal, Nepal
              </span>
            </div>
          </section>

          <nav aria-label="Shop">
            <p className={smallLabelClass}>Shop</p>
            <div className="mt-6 flex flex-col gap-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${footerLinkClass} text-sm`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Support">
            <p className={smallLabelClass}>Support</p>
            <div className="mt-6 flex flex-col gap-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${footerLinkClass} text-sm`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <section>
            <p className={smallLabelClass}>Follow Us</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="grid size-10 place-items-center rounded-full border border-background/20 text-background/70 transition-all duration-300 hover:border-background hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse justify-between gap-4 border-t border-background/15 pt-8 text-xs font-medium text-background/40 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Yarsha Wears. A sub-brand of <a href="https://yarshabyte.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-background">Yarsha Byte</a>.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-background">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-background">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
