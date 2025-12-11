import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import db from "@/lib/db";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  
  // Basic search implementation
  const productsResult = await db.query(
    `SELECT * FROM product WHERE name ILIKE $1 OR description ILIKE $2`,
    [`%${q}%`, `%${q}%`]
  );
  const products = productsResult.rows;

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 border-b border-white/10 pb-6">
            <div className="font-mono text-xs text-primary tracking-widest uppercase mb-2">
                Query.Results("{q}")
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                Search Results
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-2">
                {products.length} artifacts found matching parameters.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={{...product, price: Number(product.price)}} 
                isInWishlist={false}
            />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 opacity-20">🔍</div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">No Matches</h3>
                <p className="text-gray-500 font-mono text-sm">Adjust search parameters and re-initialize.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
