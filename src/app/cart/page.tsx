"use client";

import { Navbar } from "@/components/Navbar";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          totalAmount: total(),
        }),
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Checkout failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border p-4 rounded-lg">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">${item.price * item.quantity}</p>
                  <Button variant="destructive" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-4">
              <h2 className="text-2xl font-bold">Total: ${total()}</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                <Button onClick={handleCheckout} disabled={loading}>
                  {loading ? "Processing..." : "Checkout with Chapa"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
