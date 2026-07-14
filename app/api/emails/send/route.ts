import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, type } = await req.json();

    if (!orderId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch order details
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*, product:products(*)), profiles(email, full_name)")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Find the email address
    // In our DB schema, email can be in shipping_address JSON or in profiles
    const customerEmail = order.shipping_address?.email || order.profiles?.email;
    const customerName = order.shipping_address?.firstName || order.profiles?.full_name || "Customer";
    
    if (!customerEmail) {
      return NextResponse.json({ error: "No email found for customer" }, { status: 400 });
    }

    let subject = "";
    let htmlContent = "";
    
    const shortOrderId = order.id.split('-')[0].toUpperCase();
    const formattedTotal = Number(order.total_amount).toLocaleString();

    if (type === "confirmation") {
      subject = `Order Confirmation - #${shortOrderId}`;
      
      let itemsHtml = order.order_items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.product?.name}</strong><br/>
            <small>Qty: ${item.quantity} ${item.size ? `| Size: ${item.size}` : ''}</small>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            Rs. ${Number(item.price_at_purchase * item.quantity).toLocaleString()}
          </td>
        </tr>
      `).join("");

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">Thank you for your order!</h1>
          <p>Hi ${customerName},</p>
          <p>We've received your order <strong>#${shortOrderId}</strong> and are getting it ready.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${itemsHtml}
            <tr>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Rs. ${formattedTotal}</td>
            </tr>
          </table>
          
          <p>You can track your order status in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/orders">account portal</a>.</p>
          <p>Thanks,<br/>The YARSHA Team</p>
        </div>
      `;
    } else if (type === "shipped") {
      subject = `Your Order #${shortOrderId} has shipped!`;
      const trackingNumber = order.shipping_address?.tracking_number;
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">Great news! Your order is on the way.</h1>
          <p>Hi ${customerName},</p>
          <p>Your order <strong>#${shortOrderId}</strong> has been shipped.</p>
          
          ${trackingNumber ? `
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #52525b; font-size: 14px;">Tracking Number</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #0ea5e9; letter-spacing: 2px;">
              ${trackingNumber}
            </p>
          </div>
          ` : ''}
          
          <p>You can monitor your delivery progress in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/orders">account portal</a>.</p>
          <p>Thanks,<br/>The YARSHA Team</p>
        </div>
      `;
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const { data, error: resendError } = await resend.emails.send({
      from: "YARSHA <orders@yarshaclothing.com>", // You must verify this domain in Resend
      to: [customerEmail],
      subject: subject,
      html: htmlContent,
    });

    if (resendError) {
      console.error("Resend Error:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
