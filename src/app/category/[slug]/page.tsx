import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const categoryResult = await db.query('SELECT * FROM category WHERE slug = $1', [slug]);
  const category = categoryResult.rows[0];

  if (!category) {
    notFound();
  }

  const productsResult = await db.query('SELECT * FROM product WHERE "categoryId" = $1', [category.id]);
  const products = productsResult.rows;

  let wishlistIds = new Set();
  try {
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        const wishlistResult = await db.query('SELECT "productId" FROM wishlist WHERE "userId" = $1', [session.user.id]);
        wishlistIds = new Set(wishlistResult.rows.map((w: any) => w.productId));
      }
  } catch (e) {
      console.error("Failed to fetch wishlist", e);
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm font-bold uppercase tracking-widest font-mono text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link> 
            <span className="mx-2 text-primary">/</span>
            <span className="text-white">Sector: {category.name}</span>
        </div>

        {/* Header Section */}
        <div className="mb-12 border-b border-white/10 pb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[100px] font-black text-white/5 pointer-events-none select-none leading-none -translate-y-1/4">
                {category.name.substring(0, 3)}
            </div>
            
            <div className="flex flex-col gap-2 relative z-10">
                <div className="font-mono text-xs text-primary tracking-widest uppercase">
                    Directory.Find("{category.slug}")
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                    <span className="w-2 h-16 bg-primary block"></span>
                    {category.name}
                </h1>
                <p className="text-gray-400 font-mono text-sm max-w-2xl mt-4 border-l border-white/20 pl-4">
                    // {category.description}
                </p>
            </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={{...product, price: Number(product.price)}} 
                isInWishlist={wishlistIds.has(product.id)}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 opacity-20">⚠️</div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Sector Empty</h3>
                <p className="text-gray-500 font-mono text-sm">No artifacts found in this sector.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
