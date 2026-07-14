import { createClient } from "@/utils/supabase/server";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Orders Found</h2>
        <p style={{ color: '#a3a3a3' }}>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="orders-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Your Orders</h1>
      
      {orders.map(order => {
        const statusIndex = STATUS_STEPS.indexOf(order.status);
        const isCancelled = order.status === 'cancelled';
        
        return (
          <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                <p style={{ fontWeight: 600, fontFamily: 'monospace', color: '#00d4ff' }}>#{order.id.split('-')[0].toUpperCase()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Date Placed</p>
                <p style={{ fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</p>
                <p style={{ fontWeight: 500 }}>Rs. {Number(order.total_amount).toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
                <p style={{ 
                  fontWeight: 600, 
                  color: isCancelled ? '#ef4444' : order.status === 'delivered' ? '#22c55e' : '#f97316',
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </p>
              </div>
            </div>

            {/* Tracking Bar */}
            {!isCancelled && (
              <div style={{ padding: '2rem 1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)', transform: 'translateY(-50%)', zIndex: 0 }} />
                  
                  {/* Progress Line */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: 0, 
                    height: '4px', 
                    background: '#0ea5e9', 
                    transform: 'translateY(-50%)', 
                    zIndex: 1,
                    width: `${(Math.max(0, statusIndex) / (STATUS_STEPS.length - 1)) * 100}%`,
                    transition: 'width 1s ease'
                  }} />

                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.5rem' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: idx <= statusIndex ? '#0ea5e9' : '#333',
                        border: `4px solid ${idx <= statusIndex ? '#0ea5e9' : '#111'}`,
                        boxShadow: idx <= statusIndex ? '0 0 10px rgba(14, 165, 233, 0.5)' : 'none'
                      }} />
                      <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: idx <= statusIndex ? '#e5e5e5' : '#737373', fontWeight: idx <= statusIndex ? 600 : 400 }}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                
                {order.shipping_address?.tracking_number && (
                  <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                    <p style={{ fontSize: '0.85rem', color: '#a3a3a3' }}>Tracking Number</p>
                    <p style={{ fontWeight: 600, color: '#0ea5e9', letterSpacing: '1px' }}>{order.shipping_address.tracking_number}</p>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.order_items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img 
                      src={item.product?.images?.[0] || '/placeholder-product.jpg'} 
                      alt={item.product?.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem' }} 
                    />
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ fontWeight: 500 }}>{item.product?.name}</p>
                      <p style={{ fontSize: '0.85rem', color: '#a3a3a3' }}>
                        Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}
                      </p>
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      Rs. {Number(item.price_at_purchase * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
