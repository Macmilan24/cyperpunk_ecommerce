"use client";

import { Button } from "./ui/button";
import { useCartStore } from "@/lib/store";

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <Button size="lg" onClick={() => addItem({ ...product, quantity: 1 })}>
      Add to Cart
    </Button>
  );
}
