import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OrderStatusSelect from "./status-select";

export default async function AdminOrdersPage() {
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

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Orders</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="admin-table__id">{order.id.split("-")[0].toUpperCase()}</span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="admin-table__customer">
                    <span className="admin-table__name">
                      {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                    </span>
                    <span className="admin-table__subtext">{order.shipping_address?.email}</span>
                  </div>
                </td>
                <td>Rs. {Number(order.total_amount).toLocaleString()}</td>
                <td>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </td>
                <td>
                  <span className={`admin-badge ${order.payment_status === 'paid' ? 'admin-badge--success' : 'admin-badge--warning'}`}>
                    {order.payment_status}
                  </span>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
