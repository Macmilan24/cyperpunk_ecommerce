import { Navbar } from "@/components/Navbar";
import db from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = db.prepare('SELECT * FROM product WHERE id = ?').get(id) as any;

  if (!product) {
    notFound();
  }

  const category = db.prepare('SELECT * FROM category WHERE id = ?').get(product.categoryId) as any;
  
  // Fetch related products (same category, excluding current product)
  const relatedProducts = db.prepare('SELECT * FROM product WHERE categoryId = ? AND id != ? LIMIT 4').all(product.categoryId, id) as any[];

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm font-bold uppercase tracking-widest font-mono text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link> 
            <span className="mx-2 text-primary">/</span>
            {category ? (
                <>
                    <Link href={`/category/${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
                    <span className="mx-2 text-primary">/</span>
                </>
            ) : null}
            <span className="text-white">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="relative h-[600px] w-full border border-white/10 bg-card group overflow-hidden">
            {/* Schematic Grid Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-30" 
                 style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                 }}>
            </div>
            
            {/* Measurement Markers */}
            <div className="absolute top-4 left-0 w-full h-px bg-white/20 z-20 flex justify-between px-2 font-mono text-[10px] text-gray-500">
                <span>0</span><span>50</span><span>100</span>
            </div>
            <div className="absolute left-4 top-0 h-full w-px bg-white/20 z-20 flex flex-col justify-between py-2 font-mono text-[10px] text-gray-500">
                <span>0</span><span>50</span><span>100</span>
            </div>

            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
            
            {/* Tech corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary z-20"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary z-20"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20 z-20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20 z-20"></div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(204,255,0,0.5)] animate-scan z-30 opacity-50"></div>

            {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-xl text-gray-600">NO IMAGE</div>
            )}
            
            {/* Image Data Overlay */}
            <div className="absolute bottom-4 left-4 z-30 font-mono text-xs text-primary bg-black/80 px-2 py-1 border border-primary/30">
                IMG_SRC: {product.id.substring(0,8).toUpperCase()} // RES: 4K
            </div>
          </div>
          <ProductDetails product={{...product, price: Number(product.price)}} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="border-t border-white/10 pt-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-white">
                    System <span className="text-primary">Recommendations</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {relatedProducts.map((related) => (
                        <ProductCard 
                            key={related.id} 
                            product={{...related, price: Number(related.price)}} 
                            isInWishlist={false} // Simplified for now
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
