import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use service role key to bypass RLS for webhook updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // fallback if service role missing
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;
    
    let event: Stripe.Event;
    
    // In production with Stripe, you verify the signature
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For local testing or generic wallet webhooks
      const jsonBody = JSON.parse(body);
      
      // Generic digital wallet webhook structure bypass
      if (jsonBody.wallet_webhook) {
        const { order_id, status } = jsonBody;
        if (status === "success") {
          await supabase
            .from("orders")
            .update({ payment_status: "paid", status: "processing" })
            .eq("id", order_id);
          return NextResponse.json({ received: true });
        }
      }
      
      // Fallback for stripe locally without signature
      event = jsonBody as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing"
          })
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order status:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
