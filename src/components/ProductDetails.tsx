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
  stock?: number;
  type?: 'physical' | 'digital'; // Added type
}

interface Variant {
  id: string;
  name: string;
  size?: string; // Optional for digital
  color?: string; // Optional for digital
  options?: any; // Flexible options for digital (e.g. License)
  stock: number;
}

export function ProductDetails({ product, variants = [] }: { product: Product; variants?: Variant[] }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants.length > 0 ? variants[0] : null);
  const [isTransferring, setIsTransferring] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Group variants logic (Adaptive)
  const isPhysical = product.type !== 'digital';
  
  // Only extract colors/sizes if physical
  const colors = isPhysical ? Array.from(new Set(variants.map(v => v.color).filter(Boolean))) : [];
  const sizes = isPhysical ? Array.from(new Set(variants.map(v => v.size).filter(Boolean))) : [];
  
  // For digital, we might have "License Types" instead
  const licenses = !isPhysical ? variants : [];

  const currentStock = selectedVariant ? selectedVariant.stock : (product.stock || 0);

  const increment = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant && variants.length > 0) return;
    
    setIsTransferring(true);
    setTimeout(() => {
        addItem({ 
            ...product, 
            id: selectedVariant ? selectedVariant.id : product.id, // Use variant ID if available
            productId: product.id,
            name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
            quantity,
            variant: selectedVariant ? {
                id: selectedVariant.id,
                size: selectedVariant.size,
                color: selectedVariant.color
            } : undefined
        });
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
      
      <div className="flex items-center mb-8 gap-4">
        <div className="flex flex-col bg-white/5 border border-white/10 p-4 min-w-[140px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
            <span className="text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Price_Unit</span>
            <span className="text-3xl font-black text-white font-mono group-hover:text-primary transition-colors">
            ${Number(product.price).toFixed(2)}
            </span>
        </div>
        
        <div className="flex flex-col bg-white/5 border border-white/10 p-4 min-w-[140px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-white/20"></div>
            <span className="text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Stock_Status</span>
            {currentStock > 0 ? (
            <span className="text-primary font-bold uppercase text-sm tracking-widest flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                AVAILABLE [{currentStock}]
            </span>
            ) : (
            <span className="text-red-500 font-bold uppercase text-sm tracking-widest flex items-center gap-2 mt-1">
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

      {/* Variant Selection */}
      {variants.length > 0 && (
        <div className="mb-8 space-y-6">
            {/* Physical: Color Selection */}
            {isPhysical && colors.length > 0 && (
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Select_Color</span>
                <div className="flex gap-3">
                    {colors.map(color => (
                        <button
                            key={color as string}
                            onClick={() => {
                                const newVariant = variants.find(v => v.color === color && v.size === (selectedVariant?.size || sizes[0]));
                                if (newVariant) setSelectedVariant(newVariant);
                            }}
                            className={`h-10 px-4 border font-mono text-xs uppercase transition-all ${
                                selectedVariant?.color === color 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-white/20 text-gray-400 hover:border-white/50'
                            }`}
                        >
                            {color as string}
                        </button>
                    ))}
                </div>
            </div>
            )}

            {/* Physical: Size Selection */}
            {isPhysical && sizes.length > 0 && (
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Select_Size</span>
                <div className="flex gap-3">
                    {sizes.map(size => {
                        const variantForSize = variants.find(v => v.size === size && v.color === (selectedVariant?.color || colors[0]));
                        const isAvailable = variantForSize && variantForSize.stock > 0;
                        
                        return (
                            <button
                                key={size as string}
                                disabled={!isAvailable}
                                onClick={() => {
                                    if (variantForSize) setSelectedVariant(variantForSize);
                                }}
                                className={`w-12 h-12 border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                                    selectedVariant?.size === size
                                    ? 'border-primary bg-primary text-black'
                                    : isAvailable 
                                        ? 'border-white/20 text-white hover:border-white' 
                                        : 'border-white/5 text-white/20 cursor-not-allowed diagonal-strike'
                                }`}
                            >
                                {size as string}
                            </button>
                        );
                    })}
                </div>
            </div>
            )}

            {/* Digital: License Selection */}
            {!isPhysical && (
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Select_License_Type</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {licenses.map(license => (
                            <button
                                key={license.id}
                                onClick={() => setSelectedVariant(license)}
                                className={`p-4 border text-left transition-all ${
                                    selectedVariant?.id === license.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-white/20 hover:border-white/50'
                                }`}
                            >
                                <div className={`font-bold uppercase mb-1 ${selectedVariant?.id === license.id ? 'text-primary' : 'text-white'}`}>
                                    {license.name}
                                </div>
                                <div className="text-xs font-mono text-gray-500">
                                    {license.stock > 0 ? `AVAILABLE: ${license.stock}` : 'SOLD OUT'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}

      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center border border-white/20 bg-black h-14">
            <button 
                onClick={decrement}
                className="w-14 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            >
                <Minus className="w-4 h-4" />
            </button>
            <div className="w-16 text-center font-mono text-lg font-bold text-white border-x border-white/10 h-full flex items-center justify-center">
                {quantity}
            </div>
            <button 
                onClick={increment}
                className="w-14 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <Button 
            onClick={handleAddToCart} 
            disabled={currentStock === 0 || isTransferring}
            className="neo-button h-14 px-8 flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
            {isTransferring ? (
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
                    {isPhysical ? "PROCESSING_ORDER..." : "ENCRYPTING_ASSET..."}
                </span>
            ) : currentStock === 0 ? (
                "ALLOCATION_EXCEEDED"
            ) : (
                isPhysical ? "INITIATE_SHIPPING" : "INITIALIZE_DOWNLOAD"
            )}
        </Button>
      </div>
    </div>
  );
}
