"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    let trackingNumber = null;
    
    // If setting to shipped, ask for tracking number
    if (newStatus === "shipped") {
      trackingNumber = window.prompt("Enter the tracking number for this shipment (optional):");
    }

    setUpdating(true);
    setStatus(newStatus);
    
    try {
      if (trackingNumber) {
        // We need to fetch current shipping address to merge it
        const { data: order } = await supabase.from("orders").select("shipping_address").eq("id", orderId).single();
        const updatedAddress = { ...(order?.shipping_address || {}), tracking_number: trackingNumber };
        
        await supabase.from("orders").update({ 
          status: newStatus,
          shipping_address: updatedAddress
        }).eq("id", orderId);
      } else {
        await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      }

      // If shipped, trigger the email
      if (newStatus === "shipped") {
        await fetch("/api/emails/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, type: "shipped" })
        });
        alert("Order status updated and customer notified!");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
      setStatus(currentStatus); // revert
    } finally {
      setUpdating(false);
    }
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
