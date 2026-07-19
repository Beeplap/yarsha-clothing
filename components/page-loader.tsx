"use client";

import { useEffect, useState, type ReactNode } from "react";

import { LoadingScreen } from "@/components/loading-screen";

const MIN_LOAD_MS = 900;

type PageLoaderProps = {
  children: ReactNode;
};

export function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const shouldShowContent = isExiting || !isLoading;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => setIsLoading(false), 0);
      window.dispatchEvent(new CustomEvent("yarsha:blob-enter"));
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let cancelled = false;

    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 800);
    });

    void minDelay.then(() => {
      if (cancelled) {
        return;
      }

      setIsExiting(true);
      window.dispatchEvent(new CustomEvent("yarsha:blob-enter"));
      window.setTimeout(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      }, 700);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {isLoading ? <LoadingScreen isExiting={isExiting} /> : null}
      <div className="visible opacity-100" aria-hidden={!shouldShowContent}>
        {children}
      </div>
    </>
  );
}
