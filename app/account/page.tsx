import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Package, MapPin, Settings } from "lucide-react";

export const metadata = {
  title: "My Dashboard | Yarsha Clothing",
};

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, created_at, status, total_amount")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Welcome back, {profile?.full_name || 'Customer'}</h1>
        <p className="mt-2 text-[var(--foreground)]/70">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/orders" className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] hover:border-[var(--accent)] transition-colors flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]">
          <Package className="w-10 h-10 mb-4 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Orders</h3>
          <p className="text-xs text-[var(--foreground)]/60">Track & return orders</p>
        </Link>
        <Link href="/account/addresses" className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] hover:border-[var(--accent)] transition-colors flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]">
          <MapPin className="w-10 h-10 mb-4 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Addresses</h3>
          <p className="text-xs text-[var(--foreground)]/60">Edit delivery info</p>
        </Link>
        <Link href="/account/settings" className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] hover:border-[var(--accent)] transition-colors flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]">
          <Settings className="w-10 h-10 mb-4 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Settings</h3>
          <p className="text-xs text-[var(--foreground)]/60">Password & details</p>
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight uppercase">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-bold underline underline-offset-4 hover:text-[var(--accent)]">View All</Link>
        </div>
        
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))] transition-colors">
                    <td className="py-4 px-4 text-sm font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-4 px-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-[#e2e8db] text-[#334b28]' : 
                          order.status === 'processing' ? 'bg-[#dde5ee] text-[#2c3e50]' : 
                          order.status === 'cancelled' ? 'bg-[#eedddd] text-[#6b2c2c]' : 
                          'bg-[var(--menu-bg)] text-[var(--foreground)]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-right">Rs. {order.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))] p-8 text-center text-[var(--foreground)]/60 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
            You haven&apos;t placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
