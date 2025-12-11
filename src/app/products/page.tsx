import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProducts, Product } from "@/services/product.service";
import { getWishlistProductIds } from "@/services/wishlist.service";

export default async function ProductsPage() {
  let products: Product[] = [];
  let wishlistIds = new Set<string>();

  try {
      // Fetch products using the service
      products = await getProducts();
      
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        // Fetch wishlist using the service
        wishlistIds = await getWishlistProductIds(session.user.id);
      }

  } catch (e) {
      console.error("Failed to fetch data", e);
  }

  return (
    <main className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      <div className="container mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter text-white mb-2">
                    All <span className="text-primary">Inventory</span>
                </h1>
                <p className="font-mono text-gray-400">FULL_CATALOG_ACCESS // {products.length} ITEMS</p>
            </div>
            
            <div className="flex gap-4">
                {/* Placeholder for filters */}
                <div className="px-4 py-2 border border-white/20 font-mono text-sm text-gray-400 uppercase">Filter: All</div>
                <div className="px-4 py-2 border border-white/20 font-mono text-sm text-gray-400 uppercase">Sort: Newest</div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    isInWishlist={wishlistIds.has(product.id)}
                />
            ))}
        </div>
      </div>
    </main>
  );
}
