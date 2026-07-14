import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const { orderId, paymentMethod } = await req.json();
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

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the order to get the correct total_amount
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = `${protocol}://${host}`;

    if (paymentMethod === "card") {
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "npr", // Using NPR for Nepalese Rupees, or usd
              product_data: {
                name: `Order #${order.id.split('-')[0].toUpperCase()}`,
              },
              unit_amount: Math.round(order.total_amount * 100), // Stripe expects cents/paisa
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/checkout/success?order=${order.id}`,
        cancel_url: `${origin}/checkout?canceled=true`,
        client_reference_id: order.id,
        customer_email: order.shipping_address.email,
      });

      return NextResponse.json({ url: session.url });
    } else if (paymentMethod === "wallet") {
      // Simulate Digital Wallet (e.g. eSewa / Khalti)
      // In a real app, this would call the wallet provider's API to get a payment URL
      const walletUrl = `/dummy-wallet?orderId=${order.id}&amount=${order.total_amount}`;
      return NextResponse.json({ url: walletUrl });
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
