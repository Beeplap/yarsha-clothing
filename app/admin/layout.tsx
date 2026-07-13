import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Yarsha Clothing",
  description: "Manage products, orders, and customers.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
