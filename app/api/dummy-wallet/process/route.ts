import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const orderId = formData.get("orderId") as string;
  
  if (!orderId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Simulate calling our own webhook
  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  
  try {
    await fetch(`${origin}/api/webhooks/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_webhook: true,
        order_id: orderId,
        status: "success"
      })
    });
  } catch (error) {
    console.error("Failed to call webhook:", error);
  }

  // Redirect back to success page
  return NextResponse.redirect(new URL(`/checkout/success?order=${orderId}`, req.url), 303);
}
