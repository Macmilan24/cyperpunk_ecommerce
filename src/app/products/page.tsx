import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProductsWithCount, Product } from "@/services/product.service";
import { getWishlistProductIds } from "@/services/wishlist.service";

type SearchParams = Record<string, string | string[] | undefined>;
type SearchParamsInput = SearchParams | Promise<SearchParams>;

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as any)?.then === "function";
}

export default async function ProductsPage({ searchParams }: Readonly<{ searchParams?: SearchParamsInput }>) {
  const raw = searchParams ?? {};
  const sp: SearchParams = isPromise(raw) ? await raw : raw;
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

  let products: Product[] = [];
  let total = 0;
  let wishlistIds = new Set<string>();

  try {
      // Fetch products using the service with pagination and filters
      const res = await getProductsWithCount({
        page,
        limit: 12,
        sort,
        filters: { type, minPrice, maxPrice, collection, chain }
      });
      products = res.items;
      total = res.total;
      
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
      
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-b border-white/10 pb-6 gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white">
                    All <span className="text-primary">Inventory</span>
                </h1>
                <p className="font-mono text-gray-400 text-sm sm:text-base">FULL_CATALOG_ACCESS // {total} ITEMS</p>
            </div>
            
            <div className="w-full lg:w-auto">
                <form className="flex flex-wrap gap-3" action="/products" method="get">
                  <input type="hidden" name="page" value={String(page)} />
                  <select name="sort" defaultValue={sort} className="min-w-[150px] px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200">
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                    <option value="name_asc">Name A-Z</option>
                  </select>
                  <select name="type" defaultValue={type ?? ""} className="min-w-[150px] px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200">
                    <option value="">All Types</option>
                    <option value="digital">Digital</option>
                    <option value="physical">Physical</option>
                    <option value="artifact">Digital Artifact</option>
                  </select>
                  <div className="flex gap-2">
                    <input name="min" type="number" step="0.01" placeholder="Min" defaultValue={minPrice ?? undefined} className="w-24 px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200" />
                    <input name="max" type="number" step="0.01" placeholder="Max" defaultValue={maxPrice ?? undefined} className="w-24 px-3 py-2 border border-white/20 bg-transparent font-mono text-sm text-gray-200" />
                  </div>
                  <button type="submit" className="px-4 py-2 border border-white/20 font-mono text-sm text-gray-200 uppercase">Apply</button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    isInWishlist={wishlistIds.has(product.id)}
                />
            ))}
        </div>

        <PaginationControls page={page} total={total} sort={sort} type={type} minPrice={minPrice} maxPrice={maxPrice} collection={collection} chain={chain} />
      </div>
    </main>
  );
}

function PaginationControls({ page, total, sort, type, minPrice, maxPrice, collection, chain }: Readonly<{ page: number; total: number; sort: string; type?: string; minPrice?: number; maxPrice?: number; collection?: string; chain?: string }>) {
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
    <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-sm text-gray-300">
      <div>Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <a href={`/products?${prevParams.toString()}`} className={`px-4 py-2 border border-white/20 uppercase ${prevDisabled ? 'pointer-events-none opacity-40' : ''}`}>Prev</a>
        <a href={`/products?${nextParams.toString()}`} className={`px-4 py-2 border border-white/20 uppercase ${nextDisabled ? 'pointer-events-none opacity-40' : ''}`}>Next</a>
      </div>
    </div>
  );
}
