import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Yarsha Wears",
  description: "Sign in or create your Yarsha Wears account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
