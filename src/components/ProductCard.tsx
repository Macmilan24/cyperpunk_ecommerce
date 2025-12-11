"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
}

export function ProductCard({ product, isInWishlist }: { product: Product; isInWishlist?: boolean }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="w-full relative group neo-card rounded-none border border-white/10 bg-card hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 mb-4 border-b border-white/10 overflow-hidden group-hover:border-primary/50 transition-colors">
            <Link href={`/product/${product.id}`} className="block w-full h-full relative z-0">
                {product.image ? (
                     <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600 font-bold">NO IMAGE</div>
                )}
                
                {/* Holographic Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay holographic-bg z-10"></div>
            </Link>
            
            {/* Scanning Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_#00ff9d] animate-scan"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
            </div>

            <div className="absolute top-2 right-2 z-20">
                <WishlistButton productId={product.id} isInWishlist={isInWishlist} />
            </div>
            
            {/* Cyberpunk corner decoration */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            {/* Tech Overlay */}
             <div className="absolute bottom-2 left-2 font-mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 px-1 z-10">
                ID: {product.id.slice(0, 4).toUpperCase()}
            </div>
        </div>
        <CardTitle className="truncate px-4 mt-2 text-lg">
            <Link href={`/product/${product.id}`} className="text-white group-hover:text-primary transition-colors uppercase tracking-tight font-black group-hover:chromatic-aberration">
                {product.name}
            </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-gray-400 line-clamp-2 mb-3 h-10 font-mono">{product.description}</p>
        <p className="text-xl font-bold text-primary font-mono">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full neo-button" onClick={() => addItem({ ...product, quantity: 1 })}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
