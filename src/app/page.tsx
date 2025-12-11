import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/MotionWrapper";
import { GlitchText } from "@/components/ui/GlitchText";
import { Hero3D } from "@/components/ui/Hero3D";

export default async function Home() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let wishlistIds = new Set();

  try {
      const categoriesResult = await db.query('SELECT * FROM category');
      categories = categoriesResult.rows;

      const featuredResult = await db.query('SELECT * FROM product ORDER BY RANDOM() LIMIT 4');
      featuredProducts = featuredResult.rows;

      const newArrivalsResult = await db.query('SELECT * FROM product ORDER BY "createdAt" DESC LIMIT 4');
      newArrivals = newArrivalsResult.rows;
      
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        const wishlistResult = await db.query('SELECT "productId" FROM wishlist WHERE "userId" = $1', [session.user.id]);
        wishlistIds = new Set(wishlistResult.rows.map((w: any) => w.productId));
      }

  } catch (e) {
      console.error("Failed to fetch data", e);
  }

  return (
    <main className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
        
        {/* Marquee Background - Reduced Opacity */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-[0.02] pointer-events-none select-none overflow-hidden whitespace-nowrap">
            <div className="text-[20vw] font-black uppercase leading-none text-white animate-marquee">
                SYSTEM ONLINE // FUTURE COMMERCE // SYSTEM ONLINE // FUTURE COMMERCE
            </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-24 items-center">
          <FadeIn className="max-w-4xl">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-4 mb-12 text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              System Online // V.2.0.25
            </div>
            
            <div className="mb-12 relative">
                <GlitchText text="NEXUS" size="2xl" className="block leading-[0.85] tracking-tighter" />
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 tracking-tighter leading-[0.85]">
                  MARKET
                </div>
                
                {/* Decorative lines */}
                <div className="absolute -left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block"></div>
            </div>

            <p className="text-lg md:text-xl font-medium mb-16 max-w-lg text-gray-400 leading-relaxed">
              Premium Digital Assets & Physical Collectibles. <br/>
              <span className="text-white">Curated for the discerning netrunner.</span>
            </p>
            
            <div className="flex flex-wrap gap-8 items-center">
                <Link href="/category/digital" className="neo-button text-sm px-10 py-5 group relative overflow-hidden tracking-[0.2em]">
                    <span className="relative z-10 group-hover:text-black transition-colors">ENTER_MARKET</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </Link>
                <Link href="/about" className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors flex items-center gap-4 group">
                    <span>[ READ_PROTOCOLS ]</span>
                </Link>
            </div>
          </FadeIn>

          {/* Hero Visual - Refined */}
          <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
             <div className="absolute inset-0 border border-white/5 bg-white/[0.02] backdrop-blur-sm transform rotate-6 hover:rotate-0 transition-all duration-700 ease-out origin-bottom-right"></div>
             <div className="absolute inset-0 border border-white/10 bg-black/80 transform -rotate-3 hover:rotate-0 transition-all duration-700 ease-out flex items-center justify-center group overflow-hidden">
                <Hero3D />
                
                {/* Internal Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(204,255,0,0.5)] animate-scan opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
             </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2 font-mono text-[10px] text-gray-600 tracking-widest">
            <div>COORDS: 35.6895° N, 139.6917° E</div>
            <div>GRID: A-77</div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 border-b border-white/10 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
             <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                <span className="w-4 h-4 bg-primary block"></span>
                Sector Access
             </h2>
             <div className="hidden md:block font-mono text-xs text-gray-500">
                SELECT_CATEGORY_PROTOCOL
             </div>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <Link href={`/category/${category.slug}`} className="group block relative h-full">
                    <div className="bg-card border border-white/10 p-8 h-full transition-all group-hover:border-primary group-hover:bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-primary"></div>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2 text-white group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="font-mono text-sm text-gray-500 group-hover:text-gray-300">{category.description}</p>
                    <div className="mt-4 w-full h-1 bg-white/10 group-hover:bg-primary/50 transition-colors"></div>
                    </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div id="shop" className="container mx-auto py-20 px-4">
        {/* Featured Products */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div className="flex flex-col gap-2">
                <div className="font-mono text-xs text-primary tracking-widest uppercase">
                    System.Collections.Get("Featured")
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                    <span className="w-3 h-12 bg-primary block"></span>
                    Featured Drops
                </h2>
            </div>
            <Link href="/products" className="neo-button text-xs px-6 py-3 hidden md:block">View All Data</Link>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id}>
                  <ProductCard 
                      product={{...product, price: Number(product.price)}} 
                      isInWishlist={wishlistIds.has(product.id)}
                  />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* New Arrivals */}
        <div>
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div className="flex flex-col gap-2">
                <div className="font-mono text-xs text-primary tracking-widest uppercase">
                    System.Collections.Get("New_Arrivals")
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                    <span className="w-3 h-12 bg-white block"></span>
                    New Arrivals
                </h2>
            </div>
            <Link href="/products" className="neo-button text-xs px-6 py-3 hidden md:block">View All Data</Link>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <StaggerItem key={product.id}>
                  <ProductCard 
                      product={{...product, price: Number(product.price)}} 
                      isInWishlist={wishlistIds.has(product.id)}
                  />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </main>
  );
}
