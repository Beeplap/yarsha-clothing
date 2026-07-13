import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Fetch Total Sales
  const { data: salesData } = await supabase
    .from("orders")
    .select("total_amount")
    .neq("status", "cancelled");

  const totalSales = salesData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;
  const totalOrders = salesData?.length || 0;

  // Fetch Low Stock
  const { count: lowStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lte("stock_quantity", 5);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Dashboard Overview</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="admin-stat-card__info">
            <h3 className="admin-stat-card__label">Total Sales</h3>
            <p className="admin-stat-card__value">Rs. {totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ backgroundColor: "#f0fdf4", color: "#22c55e" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="admin-stat-card__info">
            <h3 className="admin-stat-card__label">Total Orders</h3>
            <p className="admin-stat-card__value">{totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
          </div>
          <div className="admin-stat-card__info">
            <h3 className="admin-stat-card__label">Low Stock Alerts</h3>
            <p className="admin-stat-card__value">{lowStockCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="admin-actions-grid">
          <Link href="/admin/products/new" className="admin-action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add New Product
          </Link>
          <Link href="/admin/orders" className="admin-action-btn admin-action-btn--secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            View Recent Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
