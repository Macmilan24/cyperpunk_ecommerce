import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/services/category.service";
import { getProductsByCategoryWithCount, Product } from "@/services/product.service";
import { getWishlistProductIds } from "@/services/wishlist.service";


type SearchParams = Record<string, string | string[] | undefined>;
type SearchParamsInput = Readonly<SearchParams> | Promise<Readonly<SearchParams>>;
type ParamsInput = Readonly<{ slug: string }> | Promise<Readonly<{ slug: string }>>;

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as any)?.then === "function";
}

export default async function CategoryPage({ params, searchParams }: Readonly<{ params: ParamsInput; searchParams?: SearchParamsInput }>) {
  const resolvedParams = isPromise(params) ? await params : params;
  const rawSearch = searchParams ?? {};
  const resolvedSearch: SearchParams = isPromise(rawSearch) ? await rawSearch : rawSearch;
  const { slug } = resolvedParams;
  const sp = resolvedSearch ?? {};
  const get = (k: string): string | undefined => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return typeof v === 'string' ? v : undefined;
  };
  const pageStr = get('page');
  const sortStr = get('sort');
  const typeStr = get('type');
  const minStr = get('min');
  const maxStr = get('max');
  const collectionStr = get('collection');
  const chainStr = get('chain');

  const page = pageStr ? Number.parseInt(pageStr) || 1 : 1;
  const sort = (sortStr as any) || "newest";
  const type = typeStr;
  const minPrice = minStr ? Number.parseFloat(minStr) : undefined;
  const maxPrice = maxStr ? Number.parseFloat(maxStr) : undefined;
  const collection = collectionStr ?? undefined;
  const chain = chainStr ?? undefined;
  
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const res = await getProductsByCategoryWithCount(category.id, {
    page,
    limit: 12,
    sort,
    filters: { type, minPrice, maxPrice, collection, chain }
  });
  const products: Product[] = res.items;
  const total = res.total;

  let wishlistIds = new Set<string>();
  try {
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        wishlistIds = await getWishlistProductIds(session.user.id);
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
                  {category.description}
                </p>
                <div className="mt-6">
                  <form className="flex flex-wrap gap-2 items-end" action={`/category/${category.slug}`} method="get">
                    <input type="hidden" name="page" value={String(page)} />
                    <label htmlFor="sort" className="font-mono text-xs text-gray-400">Sort</label>
                    <select id="sort" name="sort" defaultValue={sort} className="px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200">
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price ↑</option>
                      <option value="price_desc">Price ↓</option>
                      <option value="name_asc">Name A-Z</option>
                    </select>
                    <label htmlFor="type" className="font-mono text-xs text-gray-400 ml-2">Type</label>
                    <select id="type" name="type" defaultValue={type ?? ""} className="px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200">
                      <option value="">All Types</option>
                      <option value="digital">Digital</option>
                      <option value="physical">Physical</option>
                      <option value="artifact">Digital Artifact</option>
                    </select>
                    <label htmlFor="min" className="font-mono text-xs text-gray-400 ml-2">Price</label>
                    <input id="min" name="min" type="number" step="0.01" placeholder="Min" defaultValue={minPrice ?? undefined} className="w-24 px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200" />
                    <input id="max" name="max" type="number" step="0.01" placeholder="Max" defaultValue={maxPrice ?? undefined} className="w-24 px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200" />
                    <button type="submit" className="px-4 py-2 border border-white/20 font-mono text-sm text-gray-200 uppercase ml-2">Apply</button>
                  </form>
                </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
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

        <CategoryPaginationControls
          basePath={`/category/${category.slug}`}
          page={page}
          total={total}
          sort={sort}
          type={type}
          minPrice={minPrice}
          maxPrice={maxPrice}
          collection={collection}
          chain={chain}
        />
      </div>
    </main>
  );
}

function CategoryPaginationControls({ basePath, page, total, sort, type, minPrice, maxPrice, collection, chain }: Readonly<{ basePath: string; page: number; total: number; sort: string; type?: string; minPrice?: number; maxPrice?: number; collection?: string; chain?: string }>) {
  const totalPages = Math.max(1, Math.ceil(total / 12));
  const baseParams = new URLSearchParams({
    sort: sort || "newest",
    type: type ?? "",
  });
  if (typeof minPrice === 'number') baseParams.set('min', String(minPrice));
  if (typeof maxPrice === 'number') baseParams.set('max', String(maxPrice));
  if (collection) baseParams.set('collection', collection);
  if (chain) baseParams.set('chain', chain);

  const prevParams = new URLSearchParams(baseParams);
  prevParams.set('page', String(Math.max(1, page - 1)));
  const nextParams = new URLSearchParams(baseParams);
  nextParams.set('page', String(Math.min(totalPages, page + 1)));

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-10 flex items-center justify-between font-mono text-sm text-gray-300">
      <div>Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <a href={`${basePath}?${prevParams.toString()}`} className={`px-4 py-2 border border-white/20 uppercase ${prevDisabled ? 'pointer-events-none opacity-40' : ''}`}>Prev</a>
        <a href={`${basePath}?${nextParams.toString()}`} className={`px-4 py-2 border border-white/20 uppercase ${nextDisabled ? 'pointer-events-none opacity-40' : ''}`}>Next</a>
      </div>
    </div>
  );
}
