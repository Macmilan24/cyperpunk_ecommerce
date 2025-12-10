import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Store</h3>
            <p className="text-gray-400">
              The best neo-brutalism store on the web. Bold styles for bold people.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 uppercase">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/category/electronics" className="hover:text-yellow-400 transition-colors">Electronics</Link></li>
              <li><Link href="/category/clothing" className="hover:text-yellow-400 transition-colors">Clothing</Link></li>
              <li><Link href="/category/accessories" className="hover:text-yellow-400 transition-colors">Accessories</Link></li>
              <li><Link href="/category/home-living" className="hover:text-yellow-400 transition-colors">Home & Living</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 uppercase">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Shipping</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Returns</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 uppercase">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for updates and exclusive offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white text-black px-4 py-2 w-full border-2 border-white focus:outline-none"
              />
              <button className="bg-yellow-400 text-black px-4 py-2 font-bold border-2 border-yellow-400 hover:bg-yellow-300 transition-colors">
                GO
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
