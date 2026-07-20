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
        <p className="mt-2 text-gray-600">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/orders" className="p-6 border border-gray-200 hover:border-black transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
          <Package className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Orders</h3>
          <p className="text-xs text-gray-500">Track & return orders</p>
        </Link>
        <Link href="/account/addresses" className="p-6 border border-gray-200 hover:border-black transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
          <MapPin className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Addresses</h3>
          <p className="text-xs text-gray-500">Edit delivery info</p>
        </Link>
        <Link href="/account/settings" className="p-6 border border-gray-200 hover:border-black transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
          <Settings className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Settings</h3>
          <p className="text-xs text-gray-500">Password & details</p>
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight uppercase">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-bold underline underline-offset-4 hover:text-gray-600">View All</Link>
        </div>
        
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-4 px-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-right">${order.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center text-gray-500 border border-gray-200">
            You haven&apos;t placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
