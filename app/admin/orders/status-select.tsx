"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    
    setUpdating(false);
  };

  return (
    <select 
      value={status} 
      onChange={handleChange} 
      disabled={updating}
      className={`admin-status-select admin-status--${status}`}
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
