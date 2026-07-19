"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type MenuIconProps = {
  open?: boolean;
  className?: string;
};

const paths = {
  lineA: {
    closed: "M5.07849 11 L5.07849 60",
    open: "M5.07849 34.5 L5.07849 35",
  },
  lineB: {
    closed: "M15.0785 16 L15.0785 45",
    open: "M21 30 L9 30",
  },
  lineC: {
    closed: "M25.0784 1 L25.0784 50",
    open: "M25.0784 25 L25.0784 25.5",
  },
  pointA: {
    closed:
      "M5.07843 11 L9 8.4482 L9 3.61273 L5.07843 1 L1.07843 3.61273 L1 8.4482 L5.07843 11 Z",
    open:
      "M5.07843 35 L9 32.4482 L9 27.6127 L5.07843 25 L1.07843 27.6127 L1 32.4482 L5.07843 35 Z",
  },
  pointB: {
    closed:
      "M25.0784 60 L29 57.4482 L29 52.6127 L25.0784 50 L21.0784 52.6127 L21 57.4482 L25.0784 60 Z",
    open:
      "M25.0784 35 L29 32.4482 L29 27.6127 L25.0784 25 L21.0784 27.6127 L21 32.4482 L25.0784 35 Z",
  },
} as const;

export function MenuIcon({ open = false, className }: MenuIconProps) {
  const reduceMotion = useReducedMotion();
  const transition = {
    duration: reduceMotion ? 0 : 1,
    ease: [0.76, 0, 0.24, 1] as const,
  };

  return (
    <svg
      viewBox="0 0 30 61"
      className={cn("h-[3.8rem] w-[1.875rem]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {Object.entries(paths).map(([name, path]) => (
        <motion.path
          key={name}
          d={path.closed}
          animate={{ d: open ? path.open : path.closed }}
          transition={transition}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
