import { createClient } from "@/utils/supabase/server";
import AccountDashboard from "@/components/account-dashboard";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My YarshaClub Dashboard | Yarsha Clothing",
};

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, created_at, status, total_amount")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <AccountDashboard
      initialProfile={profile}
      userEmail={user.email || ""}
      initialOrders={recentOrders || []}
    />
  );
}
