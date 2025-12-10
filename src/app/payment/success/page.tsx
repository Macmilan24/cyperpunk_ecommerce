"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCartStore } from "@/lib/store";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (tx_ref) {
      fetch(`/api/payment/verify?tx_ref=${tx_ref}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setStatus("success");
            clearCart();
          } else {
            setStatus("failed");
          }
        })
        .catch(() => setStatus("failed"));
    } else {
        setStatus("failed");
    }
  }, [tx_ref, clearCart]);

  return (
    <div className="text-center">
      {status === "loading" && <p>Verifying payment...</p>}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="mb-6">Something went wrong with your payment verification.</p>
          <Link href="/cart">
            <Button variant="outline">Return to Cart</Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-16 flex justify-center">
        <Suspense fallback={<p>Loading...</p>}>
            <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
