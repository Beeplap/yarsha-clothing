"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="checkout-success__container">
      <div className="checkout-success__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      </div>
      
      <h1 className="checkout-success__title">Thank you for your order!</h1>
      
      <p className="checkout-success__message">
        Your order has been successfully placed. We'll send you an email confirmation shortly.
      </p>
      
      {orderId && (
        <div className="checkout-success__order-id">
          Order Reference: <strong>{orderId}</strong>
        </div>
      )}
      
      <div className="checkout-success__actions">
        <Link href="/products" className="auth-button" style={{ display: "inline-flex", width: "auto" }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="checkout-success">
      <Suspense fallback={<div className="checkout-success__container">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
