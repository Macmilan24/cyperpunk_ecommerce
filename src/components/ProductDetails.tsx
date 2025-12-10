"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/lib/store";
import { Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
}

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isTransferring, setIsTransferring] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setIsTransferring(true);
    setTimeout(() => {
        addItem({ ...product, quantity });
        setIsTransferring(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <div className="absolute -top-6 left-0 text-xs font-mono text-gray-600 tracking-widest">
        // SYSTEM.PRODUCT.DETAILS
      </div>
      
      <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-none text-white">
        {product.name}
      </h1>
      
      <div className="flex items-center mb-8 border-b border-white/10 pb-8">
        <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-500 mb-1">PRICE_UNIT</span>
            <span className="text-4xl font-black text-primary font-mono">
            ${Number(product.price).toFixed(2)}
            </span>
        </div>
        
        <div className="ml-12 flex flex-col">
            <span className="text-xs font-mono text-gray-500 mb-1">STOCK_STATUS</span>
            {product.stock > 0 ? (
            <span className="text-primary font-bold uppercase text-sm tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                AVAILABLE [{product.stock}]
            </span>
            ) : (
            <span className="text-red-500 font-bold uppercase text-sm tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                UNAVAILABLE
            </span>
            )}
        </div>
      </div>
      
      <div className="mb-10 font-mono text-sm bg-black/30 p-6 border border-white/10">
        <div className="text-gray-500 mb-2">// DESCRIPTION_LOG</div>
        <p className="text-gray-300 leading-relaxed">
            {product.description}
        </p>
      </div>

      <div className="mb-10 relative overflow-hidden">
        <h3 className="font-bold uppercase mb-4 text-white tracking-widest text-xs border-b border-white/10 pb-2 inline-block">
            Technical_Specifications
        </h3>
        <div className="grid grid-cols-1 gap-2 font-mono text-xs text-gray-400">
            <div className="flex justify-between border-b border-white/5 py-2">
                <span>const MATERIAL</span>
                <span className="text-white">"Synthetic_Polymer_V2"</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
                <span>const DURABILITY</span>
                <span className="text-white">"Grade_A_Military"</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
                <span>const STYLE</span>
                <span className="text-white">"Neo_Brutalist"</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
                <span>const EDITION</span>
                <span className="text-primary">"Limited_Drop"</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex items-center border border-white/20 bg-black/50 h-14">
            <button 
                onClick={decrement}
                disabled={quantity <= 1}
                className="px-4 h-full hover:bg-white/10 hover:text-white text-gray-400 transition-colors disabled:opacity-50"
            >
                <Minus className="w-4 h-4" />
            </button>
            <div className="h-full w-16 flex items-center justify-center font-bold text-xl text-white font-mono border-x border-white/20">
                {quantity}
            </div>
            <button 
                onClick={increment}
                disabled={quantity >= product.stock}
                className="px-4 h-full hover:bg-white/10 hover:text-white text-gray-400 transition-colors disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <Button 
            className="flex-1 h-14 neo-button text-lg relative overflow-hidden group" 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isTransferring}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isTransferring ? "TRANSFERRING DATA..." : "INITIATE TRANSFER"}
          </span>
          {isTransferring && (
            <div className="absolute inset-0 bg-white/20 animate-progress origin-left"></div>
          )}
        </Button>
      </div>
    </div>
  );
}
