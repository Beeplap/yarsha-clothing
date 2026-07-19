"use client";

import type { ReactNode } from "react";

import { useLenisScroll } from "@/hooks/use-lenis-scroll";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useLenisScroll();

  return children;
}
