import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = db.prepare('SELECT * FROM category WHERE slug = ?').get(slug) as any;

  if (!category) {
    notFound();
  }

  const products = db.prepare('SELECT * FROM product WHERE categoryId = ?').all(category.id) as any[];

  let wishlistIds = new Set();
  try {
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        const wishlist = db.prepare('SELECT productId FROM wishlist WHERE userId = ?').all(session.user.id) as { productId: string }[];
        wishlistIds = new Set(wishlist.map(w => w.productId));
      }
  } catch (e) {
      console.error("Failed to fetch wishlist", e);
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 text-sm font-bold uppercase">
            <Link href="/" className="hover:underline">Home</Link> 
            <span className="mx-2">/</span>
            <span className="text-gray-500">{category.name}</span>
        </div>

        <div className="mb-12 border-b-4 border-black pb-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={{...product, price: Number(product.price)}} 
                isInWishlist={wishlistIds.has(product.id)}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12">
                <p className="text-xl font-bold text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
