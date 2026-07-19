"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  MenuBottomWave,
  menuWavePaths,
} from "@/components/menu-bottom-wave";
import { menuLinks } from "@/data/nav";
import { socialLinks } from "@/data/socials";

gsap.registerPlugin(useGSAP, CustomEase);

type FullscreenMenuProps = {
  open: boolean;
  onClose: () => void;
};

type MenuElements = {
  root: HTMLDivElement;
  panel: HTMLElement;
  desktopSvg: SVGSVGElement;
  desktopPath: SVGPathElement;
  mobilePath: SVGPathElement;
  links: HTMLElement[];
  social: HTMLElement;
};

const menuLinkWidths = ["12vw", "18.6vw", "13.6vw", "17vw"] as const;
const linkRevealEase = CustomEase.create(
  "menu-link-reveal",
  "M0,0 C0,0 0.259,-0.011 0.364,0.158 0.48,0.346 0.394,0.716 0.53,0.874 0.63,0.99 0.842,1 0.874,1 0.964,1 1,1 1,1",
);

function MenuHexDot() {
  return (
    <svg viewBox="0 0 12 14" className="inline-block h-3 w-3 shrink-0" aria-hidden="true">
      <polygon points="6,1 11,4 11,10 6,13 1,10 1,4" fill="var(--accent)" />
    </svg>
  );
}

export function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<MenuElements | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const hasOpenedRef = useRef(false);

  useGSAP(
    () => {
      const root = dialogRef.current;
      if (!root) {
        return;
      }

      const panel = root.querySelector<HTMLElement>(".menu-panel");
      const desktopSvg = root.querySelector<SVGSVGElement>(".menu-wave-desktop");
      const mobileSvg = root.querySelector<SVGSVGElement>(".menu-wave-mobile");
      const desktopPath = desktopSvg?.querySelector("path");
      const mobilePath = mobileSvg?.querySelector("path");
      const links = gsap.utils.toArray<HTMLElement>(".menu-link-reveal", root);
      const social = root.querySelector<HTMLElement>(".menu-social");

      if (!panel || !desktopSvg || !mobileSvg || !desktopPath || !mobilePath || !social) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(panel, { yPercent: -100 });
      gsap.set(links, { autoAlpha: 0, pointerEvents: "none", yPercent: -150 });
      gsap.set(social, { autoAlpha: 0, yPercent: 0 });
      gsap.set(desktopSvg, { yPercent: 0 });
      gsap.set(desktopPath, { attr: { d: menuWavePaths.desktop.start } });
      gsap.set(mobilePath, { attr: { d: menuWavePaths.mobile.start } });

      elementsRef.current = {
        root,
        panel,
        desktopSvg,
        desktopPath,
        mobilePath,
        links,
        social,
      };
      root.dataset.reduceMotion = String(reduceMotion);

      return () => {
        elementsRef.current = null;
      };
    },
    { scope: dialogRef, dependencies: [] },
  );

  useEffect(() => {
    const elements = elementsRef.current;
    if (!elements) {
      return;
    }

    const {
      root,
      panel,
      desktopSvg,
      desktopPath,
      mobilePath,
      links,
      social,
    } = elements;
    const duration = root.dataset.reduceMotion === "true" ? 0 : 1;

    animationRef.current?.kill();

    if (open) {
      hasOpenedRef.current = true;
      gsap.set(root, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(panel, { yPercent: -100 });
      gsap.set(links, { autoAlpha: 0, pointerEvents: "none", yPercent: -150 });
      gsap.set(social, { autoAlpha: 0, yPercent: 0 });
      gsap.set(desktopSvg, { yPercent: 0 });
      gsap.set(desktopPath, { attr: { d: menuWavePaths.desktop.start } });
      gsap.set(mobilePath, { attr: { d: menuWavePaths.mobile.start } });

      const timeline = gsap.timeline();
      animationRef.current = timeline;

      timeline
        .to(
          desktopPath,
          {
            attr: { d: menuWavePaths.desktop.middle },
            duration: 0.6 * duration,
            ease: "expo.in",
          },
          0,
        )
        .to(
          mobilePath,
          {
            attr: { d: menuWavePaths.mobile.middle },
            duration: 0.6 * duration,
            ease: "expo.in",
          },
          0,
        )
        .to(
          desktopPath,
          {
            attr: { d: menuWavePaths.desktop.end },
            duration: 0.6 * duration,
            ease: "expo.out",
          },
          0.6 * duration,
        )
        .to(
          mobilePath,
          {
            attr: { d: menuWavePaths.mobile.end },
            duration: 0.6 * duration,
            ease: "expo.out",
          },
          0.6 * duration,
        )
        .to(
          desktopSvg,
          {
            yPercent: 63,
            duration: 0.6 * duration,
            ease: "expo.out",
          },
          0.6 * duration,
        )
        .to(
          panel,
          {
            yPercent: 0,
            duration: 0.35 * duration,
            ease: "power4.out",
          },
          0,
        )
        .to(
          links,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            yPercent: 0,
            duration: 0.9 * duration,
            stagger: { amount: 0.1 * duration },
            ease: linkRevealEase,
          },
          0.35 * duration,
        )
        .to(
          social,
          {
            autoAlpha: 1,
            yPercent: 150,
            duration: 0.6 * duration,
            ease: "power4.out",
          },
          0.75 * duration,
        );

      const focusTimer = window.setTimeout(() => {
        dialogRef.current?.focus({ preventScroll: true });
      }, 360);

      return () => window.clearTimeout(focusTimer);
    }

    if (!hasOpenedRef.current) {
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    gsap.set(root, { pointerEvents: "none" });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
        window.dispatchEvent(new Event("yarsha:menu-closed"));
      },
    });
    animationRef.current = timeline;

    timeline
      .to(
        links,
        {
          autoAlpha: 0,
          pointerEvents: "none",
          yPercent: -150,
          duration: 0.45 * duration,
          stagger: { amount: 0.08 * duration, from: "end" },
          ease: "power4.in",
        },
        0,
      )
      .to(
        social,
        {
          autoAlpha: 0,
          pointerEvents: "none",
          yPercent: 0,
          duration: 0.45 * duration,
          ease: "power4.in",
        },
        0,
      )
      .to(
        desktopPath,
        {
          attr: { d: menuWavePaths.desktop.middle },
          duration: 0.6 * duration,
          ease: "expo.in",
        },
        0.15 * duration,
      )
      .to(
        mobilePath,
        {
          attr: { d: menuWavePaths.mobile.middle },
          duration: 0.6 * duration,
          ease: "expo.in",
        },
        0.15 * duration,
      )
      .to(
        desktopSvg,
        {
          yPercent: 0,
          duration: 0.6 * duration,
          ease: "expo.in",
        },
        0.15 * duration,
      )
      .to(
        desktopPath,
        {
          attr: { d: menuWavePaths.desktop.start },
          duration: 0.6 * duration,
          ease: "expo.out",
        },
        0.75 * duration,
      )
      .to(
        mobilePath,
        {
          attr: { d: menuWavePaths.mobile.start },
          duration: 0.6 * duration,
          ease: "expo.out",
        },
        0.75 * duration,
      )
      .to(
        panel,
        {
          yPercent: -100,
          duration: 0.35 * duration,
          ease: "power4.in",
        },
        1 * duration,
      );
  }, [open]);

  return (
    <div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal={open ? "true" : undefined}
      aria-hidden={!open}
      aria-label="Site navigation"
      inert={!open}
      tabIndex={-1}
      className="invisible pointer-events-none fixed inset-0 z-[80] overflow-hidden bg-menu-bg outline-none lg:bottom-[10px] lg:left-[10px] lg:right-[10px] lg:top-0"
    >
      <MenuBottomWave />

      <div className="menu-panel relative z-10 h-[60vh] w-full overflow-hidden">
        <nav
          className="relative flex h-full flex-col items-center pt-[16.6664vw] md:pt-[4.1666vw]"
          aria-label="Primary navigation"
        >
        <ul className="grid w-full grid-cols-1 items-start justify-items-center gap-y-[2vw] overflow-visible md:grid-cols-[auto_auto_auto] md:justify-center md:gap-x-[3.75vw] md:gap-y-[1.4vw]">
  {menuLinks.map((link, index) => (
    <li
      key={link.href}
      className={`overflow-visible ${
        index === 3
          ? "md:col-span-3 md:row-start-2"
          : ""
      }`}
    >
      <div className="menu-link-reveal flex items-start justify-center overflow-visible">
        <Link
          href={link.href}
          onClick={onClose}
          className="group relative inline-flex items-start gap-2 text-foreground transition-colors hover:text-accent"
        >
          <span className="font-helvetica-bold block whitespace-nowrap text-[14vw] uppercase leading-none tracking-[-0.04em] md:text-[5.4vw]">
            {link.label}
          </span>

          <span className="mt-[0.72em] inline-flex shrink-0">
            <MenuHexDot />
          </span>
        </Link>
      </div>
    </li>
  ))}
</ul>

          <ul className="menu-social mt-[8.3332vw] flex flex-wrap items-center justify-center gap-x-5 gap-y-1 md:absolute md:bottom-[4.1666vw] md:mt-0 md:gap-x-8">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:text-accent md:text-[0.68rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
