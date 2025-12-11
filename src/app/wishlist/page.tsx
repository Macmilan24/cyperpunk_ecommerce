import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWishlistItems } from "@/services/wishlist.service";

export default async function WishlistPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  const formattedItems = await getWishlistItems(session.user.id);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-tighter">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {formattedItems.map((item) => (
            <ProductCard 
                key={item.id} 
                product={item.product} 
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
