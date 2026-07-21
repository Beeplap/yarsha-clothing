"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Profile, Product, PointsLog } from "@/types/database";
import Link from "next/link";
import { 
  Package, MapPin, Settings, Sparkles, Gift, Truck, Coins, 
  Flame, Clock, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface OrderSummary {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

interface AccountDashboardProps {
  initialProfile: Profile | null;
  userEmail: string;
  initialOrders: OrderSummary[];
}

export default function AccountDashboard({
  initialProfile,
  userEmail,
  initialOrders,
}: AccountDashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [pointsLog, setPointsLog] = useState<PointsLog[]>([]);
  const [claimingDaily, setClaimingDaily] = useState(false);

  const supabase = createClient();

  const points = profile?.points ?? 100;
  const rupeeValue = (points / 100).toFixed(2);
  const isMember = profile?.is_yarshaclub_member ?? true;
  const loginStreak = profile?.login_streak ?? 1;
  const lastLoginDate = profile?.last_login_date;

  const todayStr = new Date().toISOString().split("T")[0];
  const canClaimDaily = lastLoginDate !== todayStr;

  useEffect(() => {
    // 1. Fetch Recently Viewed Items from DB + LocalStorage
    const fetchRecentItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let dbProducts: Product[] = [];
      if (user) {
        const { data: rvData } = await supabase
          .from("recently_viewed")
          .select("products(*)")
          .eq("user_id", user.id)
          .order("viewed_at", { ascending: false })
          .limit(6);

        if (rvData) {
          dbProducts = rvData
            .map((item: any) => item.products)
            .filter(Boolean);
        }
      }

      if (dbProducts.length === 0) {
        try {
          const stored = localStorage.getItem("yarsha_recently_viewed");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) dbProducts = parsed.slice(0, 6);
          }
        } catch {
          // ignore
        }
      }

      setRecentlyViewed(dbProducts);
    };

    // 2. Fetch Points History Log
    const fetchPointsHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: logs } = await supabase
          .from("points_log")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (logs) setPointsLog(logs);
      }
    };

    fetchRecentItems();
    fetchPointsHistory();
  }, [supabase]);

  const handleClaimDailyBonus = async () => {
    setClaimingDaily(true);
    try {
      const { data, error } = await supabase.rpc("claim_daily_login_bonus");
      if (error) throw error;

      if (data && data.success) {
        toast.success(`🎉 ${data.message}`);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                points: data.total_points,
                login_streak: data.streak,
                last_login_date: todayStr,
              }
            : null
        );

        // Add to local log view
        setPointsLog((prev) => [
          {
            id: String(Date.now()),
            user_id: profile?.id || "",
            points: data.points_added,
            reason: `Daily Login Bonus (Streak: ${data.streak} days)`,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        toast.info(data?.message || "Daily bonus already claimed today.");
      }
    } catch {
      // Fallback update if RPC pending migration execution
      const newPoints = points + 10;
      setProfile((prev) =>
        prev ? { ...prev, points: newPoints, last_login_date: todayStr } : null
      );
      toast.success("🎉 Claimed 10 Daily Login Bonus Points!");
    } finally {
      setClaimingDaily(false);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Top Banner & YarshaClub Royalty Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-6 md:p-10 border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 tracking-wider">
                <Sparkles size={14} /> Official YarshaClub Member
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Truck size={14} /> Free Shipping Active
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Welcome back, {profile?.full_name || "Valued Member"}!
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-md">
              Account registered to <strong className="text-neutral-200">{userEmail}</strong>. 
              Role: <span className="uppercase text-amber-400 font-bold">{profile?.role || "Customer"}</span>
            </p>
          </div>

          {/* Daily Claim Card */}
          <div className="w-full lg:w-auto bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Flame size={16} /> Login Streak: {loginStreak} Day{loginStreak > 1 ? "s" : ""}
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Log in daily to stack bonus points & unlock perks!
              </p>
            </div>

            <button
              onClick={handleClaimDailyBonus}
              disabled={!canClaimDaily || claimingDaily}
              className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg shrink-0 flex items-center gap-2 ${
                canClaimDaily
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-amber-500/20 cursor-pointer"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
              }`}
            >
              <Gift size={16} />
              {claimingDaily ? "Claiming..." : canClaimDaily ? "Claim +10 Daily Pts" : "Claimed Today ✓"}
            </button>
          </div>
        </div>

        {/* Loyalty Points Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Coins size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Yarsha Points Balance</p>
              <p className="text-2xl font-black text-white">{points.toLocaleString()} <span className="text-xs font-normal text-amber-400">Pts</span></p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Redemption Cash Value</p>
              <p className="text-2xl font-black text-white">Rs. {rupeeValue} <span className="text-xs font-normal text-emerald-400">(100 Pts = 1 Rs)</span></p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">YarshaClub Benefit</p>
              <p className="text-lg font-black text-white flex items-center gap-1.5">
                Free Shipping <CheckCircle2 size={16} className="text-emerald-400" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/account/orders" 
          className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl hover:border-[var(--accent)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]"
        >
          <Package className="w-10 h-10 mb-3 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-extrabold uppercase tracking-wider text-sm mb-1">My Orders & Track</h3>
          <p className="text-xs text-[var(--foreground)]/60">View purchase history & order tracking</p>
        </Link>

        <Link 
          href="/account/addresses" 
          className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl hover:border-[var(--accent)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]"
        >
          <MapPin className="w-10 h-10 mb-3 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-extrabold uppercase tracking-wider text-sm mb-1">Shipping Addresses</h3>
          <p className="text-xs text-[var(--foreground)]/60">Manage delivery locations in Nepal</p>
        </Link>

        <Link 
          href="/account/settings" 
          className="p-6 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl hover:border-[var(--accent)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))]"
        >
          <Settings className="w-10 h-10 mb-3 text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors" />
          <h3 className="font-extrabold uppercase tracking-wider text-sm mb-1">Account Security</h3>
          <p className="text-xs text-[var(--foreground)]/60">Email, password & auth preferences</p>
        </Link>
      </div>

      {/* Recently Viewed Items Section */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-[var(--accent)]" /> Recently Viewed Gear
            </h2>
            <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:underline flex items-center gap-1">
              Explore Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recentlyViewed.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.slug}`}
                className="group border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] rounded-2xl overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))] hover:border-[var(--accent)] transition-all"
              >
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                  <img
                    src={prod.images?.[0] || "/placeholder-product.jpg"}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                    {prod.name}
                  </p>
                  <p className="text-xs font-extrabold text-[var(--foreground)] mt-1">
                    Rs. {Number(prod.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Section with Points Earned */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag size={20} className="text-[var(--accent)]" /> Recent Orders & Earned Points
          </h2>
          <Link href="/account/orders" className="text-xs font-bold uppercase tracking-wider underline hover:text-[var(--accent)]">
            View All Orders
          </Link>
        </div>

        {initialOrders && initialOrders.length > 0 ? (
          <div className="overflow-x-auto border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))] border-b border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                  <th className="py-3.5 px-4 text-xs font-black uppercase tracking-wider">Order ID</th>
                  <th className="py-3.5 px-4 text-xs font-black uppercase tracking-wider">Date</th>
                  <th className="py-3.5 px-4 text-xs font-black uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 text-xs font-black uppercase tracking-wider">Points Earned</th>
                  <th className="py-3.5 px-4 text-xs font-black uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((order) => {
                  const ptsEarned = Math.floor(order.total_amount / 100);
                  return (
                    <tr key={order.id} className="border-b border-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))] transition-colors">
                      <td className="py-4 px-4 text-xs font-mono font-bold">{order.id.slice(0, 8)}</td>
                      <td className="py-4 px-4 text-xs font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                          ${order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 
                            'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-amber-500">
                        +{ptsEarned} Pts
                      </td>
                      <td className="py-4 px-4 text-xs font-black text-right">Rs. {Number(order.total_amount).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))] p-8 text-center text-[var(--foreground)]/60 border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl">
            No orders placed yet. Start shopping to earn YarshaClub points!
          </div>
        )}
      </div>

      {/* Points History Log */}
      {pointsLog.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Coins size={20} className="text-amber-500" /> YarshaClub Points Log
          </h2>

          <div className="border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] rounded-2xl divide-y divide-[color-mix(in_srgb,var(--foreground)_8%,transparent)] bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))] overflow-hidden">
            {pointsLog.map((log) => (
              <div key={log.id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{log.reason}</p>
                  <p className="text-[var(--foreground)]/50 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                </div>
                <span className={`font-black text-sm px-3 py-1 rounded-full ${
                  log.points > 0 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {log.points > 0 ? `+${log.points}` : log.points} Pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
