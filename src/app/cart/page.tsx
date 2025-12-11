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
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
                <div className="font-mono text-xs text-primary tracking-widest uppercase mb-2">
                    System.Storage.Manifest
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
                    Cargo Manifest
                </h1>
            </div>
            <div className="font-mono text-xs text-gray-500 text-right hidden sm:block">
                <div>CAPACITY: UNLIMITED</div>
                <div>STATUS: {items.length > 0 ? 'ACTIVE' : 'IDLE'}</div>
            </div>
        </div>

        {items.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5">
            <div className="text-6xl mb-4 opacity-20">📦</div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Manifest Empty</h3>
            <p className="text-gray-500 font-mono text-sm mb-8">No items requisitioned.</p>
            <Button onClick={() => router.push('/')} className="neo-button">
                Return to Supply
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center border border-white/10 bg-white/5 p-6 relative group overflow-hidden">
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-black border border-white/20 flex items-center justify-center text-xs font-mono text-gray-600">
                            IMG
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Item_ID: {item.id.substring(0,6)}</div>
                            <h3 className="font-bold text-xl uppercase tracking-tight">{item.name}</h3>
                            <div className="text-xs font-mono text-gray-500 mt-1 flex gap-4">
                                <span>QTY: {item.quantity}</span>
                                <span>UNIT: ${item.price}</span>
                                {item.variant && (
                                    <span className="text-white">
                                        {item.variant.color && item.variant.size 
                                            ? `[${item.variant.color} / ${item.variant.size}]`
                                            : `[${item.variant.name || 'Standard'}]`
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 sm:mt-0 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
                        <p className="font-black text-2xl font-mono text-white">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 uppercase text-xs font-bold tracking-widest">
                            [Eject]
                        </Button>
                    </div>
                </div>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="border border-white/10 bg-black p-8 sticky top-24">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Requisition Summary</h2>
                    
                    <div className="space-y-4 font-mono text-sm mb-8">
                        <div className="flex justify-between text-gray-400">
                            <span>SUBTOTAL</span>
                            <span>${total().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>TAX (EST)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>SHIPPING</span>
                            <span className="text-primary">FREE</span>
                        </div>
                        <div className="flex justify-between text-white text-lg font-bold border-t border-white/10 pt-4 mt-4">
                            <span>TOTAL</span>
                            <span>${total().toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-col">
                        <Button variant="outline" onClick={clearCart} className="w-full border-white/20 hover:bg-white/10 text-gray-400 uppercase text-xs tracking-widest h-12">
                            Clear Manifest
                        </Button>
                        <Button onClick={handleCheckout} disabled={loading} className="w-full neo-button h-14 text-sm">
                            {loading ? "Processing..." : "Initialize Checkout"}
                        </Button>
                    </div>
                    
                    <div className="mt-6 text-[10px] font-mono text-gray-600 text-center">
                        SECURE TRANSACTION // ENCRYPTED
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
