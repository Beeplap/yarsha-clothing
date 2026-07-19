import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("studio-container", className)} {...props}>
      {children}
    </div>
  );
}
