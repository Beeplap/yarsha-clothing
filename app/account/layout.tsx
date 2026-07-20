import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Package, User, MapPin, Heart } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 min-h-[80vh] font-sans text-[var(--foreground)]">
      <aside className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight mb-8">MY ACCOUNT</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/account" className="flex items-center px-4 py-3 bg-[var(--menu-bg)] hover:bg-[color-mix(in_srgb,var(--menu-bg)_90%,var(--foreground))] font-bold uppercase text-sm tracking-wider transition-colors">
            <User className="mr-3 w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/account/orders" className="flex items-center px-4 py-3 hover:bg-[var(--menu-bg)] font-bold uppercase text-sm tracking-wider transition-colors">
            <Package className="mr-3 w-5 h-5" />
            Order History
          </Link>
          <Link href="/account/addresses" className="flex items-center px-4 py-3 hover:bg-[var(--menu-bg)] font-bold uppercase text-sm tracking-wider transition-colors">
            <MapPin className="mr-3 w-5 h-5" />
            Addresses
          </Link>
          <Link href="/wishlist" className="flex items-center px-4 py-3 hover:bg-[var(--menu-bg)] font-bold uppercase text-sm tracking-wider transition-colors">
            <Heart className="mr-3 w-5 h-5" />
            Wishlist
          </Link>
          <form action="/auth/logout" method="post" className="pt-4 mt-4 border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
            <button type="submit" className="flex items-center w-full px-4 py-3 hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] font-bold uppercase text-sm tracking-wider transition-colors text-left">
              <LogOut className="mr-3 w-5 h-5" />
              Sign Out
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 bg-[var(--background)] p-6 md:p-8 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] shadow-sm">
        {children}
      </main>
    </div>
  );
}
