"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PremiumButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  showIcon?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function PremiumButton({
  children,
  href,
  variant = "primary",
  showIcon = true,
  className,
  onPointerLeave,
  onPointerMove,
  ...props
}: PremiumButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition duration-300 will-change-transform",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky",
        variant === "primary"
          ? "button-gradient text-background hover:brightness-110"
          : "button-ghost text-foreground hover:border-sky/50 hover:bg-foreground/[0.08]",
        className,
      )}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const target = ref.current;
        if (!target) {
          return;
        }

        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        target.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (ref.current) {
          ref.current.style.transform = "translate(0, 0)";
        }
      }}
      {...props}
    >
      {children}
      {showIcon ? (
        <ArrowUpRight
          className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      ) : null}
    </a>
  );
}
