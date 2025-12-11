import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  const wishlistResult = await db.query(`
    SELECT w.*, p.name as "productName", p.price as "productPrice", p.image as "productImage", p.description as "productDescription" 
    FROM wishlist w 
    JOIN product p ON w."productId" = p.id 
    WHERE w."userId" = $1
  `, [session.user.id]);
  
  const wishlistItems = wishlistResult.rows;

  const formattedItems = wishlistItems.map((item: any) => ({
    id: item.id,
    product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        description: item.productDescription
    }
  }));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-tighter">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {formattedItems.map((item) => (
            <ProductCard 
                key={item.id} 
                product={{...item.product, price: Number(item.product.price)}} 
                isInWishlist={true}
            />
          ))}
          {formattedItems.length === 0 && (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </main>
  );
}
