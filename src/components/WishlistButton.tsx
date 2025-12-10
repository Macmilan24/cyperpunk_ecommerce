"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface WishlistButtonProps {
  productId: string;
  isInWishlist?: boolean;
}

export function WishlistButton({ productId, isInWishlist = false }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const toggleWishlist = async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setInWishlist(data.status === "added");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleWishlist}
      disabled={loading}
      className={`border-2 border-black ${inWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-white hover:bg-gray-100"}`}
    >
      <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
    </Button>
  );
}
