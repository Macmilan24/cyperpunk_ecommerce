import Link from "next/link";
import { SystemLogs } from "./ui/SystemLogs";

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 mt-auto relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      {/* Top Border Scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-primary animate-scan-fast"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand & Status Column */}
          <div className="md:col-span-4 flex flex-col justify-between h-full border-r border-white/5 pr-8">
            <div>
                <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter flex items-center gap-2">
                    <span className="text-primary">/</span> STORE
                </h3>
                <p className="text-gray-500 font-mono text-sm mb-8 max-w-xs">
                SUPPLYING HIGH-PERFORMANCE GEAR FOR THE MODERN OPERATOR. 
                EST. 2025 // SECTOR 7
                </p>
            </div>
            
            <div className="border border-white/10 bg-white/5 p-4 font-mono text-xs">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500">SYSTEM STATUS</span>
                    <span className="text-primary flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        ONLINE
                    </span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500">PING</span>
                    <span className="text-white">12ms</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">ENCRYPTION</span>
                    <span className="text-white">AES-256</span>
                </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2">Inventory</h4>
            <ul className="space-y-3 font-mono text-sm">
              {['Armor', 'Mobility', 'Footgear', 'Loadout'].map((item) => (
                <li key={item}>
                    <Link href={`/category/${item.toLowerCase()}`} className="text-gray-400 hover:text-primary transition-colors group flex items-center gap-2">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">{">"}</span>
                        {item}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2">Protocol</h4>
            <ul className="space-y-3 font-mono text-sm">
              {['FAQ', 'Shipping', 'Returns', 'Contact'].map((item) => (
                <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-primary transition-colors group flex items-center gap-2">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">{">"}</span>
                        {item}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Logs & Newsletter */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div>
                <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2">System Logs</h4>
                <SystemLogs />
            </div>

            <div>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-gray-500">Newsletter_Sub_Routine</h4>
                <div className="flex relative group">
                <input 
                    type="email" 
                    placeholder="ENTER_EMAIL_ADDRESS" 
                    className="bg-black border border-white/20 text-white px-4 py-3 w-full focus:outline-none focus:border-primary font-mono text-sm placeholder-gray-700 transition-colors"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-white/10 text-primary font-bold border-l border-white/20 hover:bg-primary hover:text-black transition-all uppercase text-xs tracking-widest">
                    INIT
                </button>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-600">
          <p>&copy; {new Date().getFullYear()} FUTURE COMMERCE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span>COORDS: 35.6895° N, 139.6917° E</span>
            <span>VERSION: 2.0.25</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
