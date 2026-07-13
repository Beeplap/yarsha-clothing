import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Yarsha Clothing",
  description: "Sign in or create your Yarsha Clothing account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
