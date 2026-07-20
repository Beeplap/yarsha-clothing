"use client";

import { useEffect, type ReactNode } from "react";

type PageLoaderProps = {
  children: ReactNode;
};

export function PageLoader({ children }: PageLoaderProps) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("yarsha:blob-enter"));
  }, []);

  return <>{children}</>;
}
