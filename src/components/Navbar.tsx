"use client";

import { useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { SystemClock } from "./ui/SystemClock";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const { data: session } = authClient.useSession();

  return (
    <nav className="border-b border-white/5 p-0 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
      {/* HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50"></div>

      {/* Top Status Bar */}
      <div className="bg-primary/5 border-b border-white/5 py-1 px-4 hidden lg:block relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-10"></div>
        <div className="container mx-auto flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest relative z-10">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
              <span>System Status: Online</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" aria-hidden="true"></span>
              <span>Secure Connection: Encrypted</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" aria-hidden="true"></span>
              <span>Region: Global</span>
            </span>
        </div>
      </div>

      <div className="container mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 relative">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-white hover:text-primary transition-colors flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-black flex items-center justify-center font-mono text-xl font-bold group-hover:rotate-180 transition-transform duration-500">
            N
          </div>
          <span className="tracking-[0.2em]">NEXUS</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1 font-bold uppercase text-[11px] tracking-[0.18em]">
          {[
            { name: "NFTs", href: "/category/digital-artifacts" },
            { name: "Digital", href: "/category/digital" },
            { name: "Physical", href: "/category/physical" },
            { name: "Art Prints", href: "/category/art-prints" },
            { name: "Collectibles", href: "/category/collectibles" }
          ].map((link) => (
            <Link key={link.name} href={link.href} className="group relative px-4 py-2 text-gray-400 hover:text-white transition-colors overflow-hidden">
                <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1">[</span>
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">]</span>
                </span>
                <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:block">
            <SystemClock />
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <SearchOverlay />
            <Link href="/wishlist">
                <Button variant="ghost" className="relative hover:bg-transparent text-gray-400 hover:text-accent transition-colors p-2 h-auto">
                <Heart className="w-5 h-5" />
                </Button>
            </Link>
            <Link href="/cart">
                <Button variant="ghost" className="relative hover:bg-transparent text-gray-400 hover:text-primary transition-colors p-2 h-auto">
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-black w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-none">
                    {items.length}
                    </span>
                )}
                </Button>
            </Link>
          </div>

          <Button variant="ghost" className="md:hidden text-gray-200" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <span className="text-xs font-bold uppercase hidden sm:inline-block text-primary tracking-widest font-mono">USER: {session.user.name}</span>
                <Button variant="outline" className="border border-white/20 bg-transparent text-white text-xs font-bold uppercase hover:bg-white hover:text-black transition-all rounded-none h-8 px-4" onClick={() => authClient.signOut()}>Exit</Button>
              </div>
            ) : (
              <Link href="/sign-in" className="pl-3 border-l border-white/10">
                <Button className="neo-button text-xs py-2 px-6 h-8">Login</Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-fast opacity-50"></div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl transition-[max-height] duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 py-3 space-y-3">
          <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-[0.14em]">
            {[{ name: "NFTs", href: "/category/digital-artifacts" },{ name: "Digital", href: "/category/digital" },{ name: "Physical", href: "/category/physical" },{ name: "Art Prints", href: "/category/art-prints" },{ name: "Collectibles", href: "/category/collectibles" }].map((link) => (
              <Link key={link.name} href={link.href} className="px-3 py-2 border border-white/10 text-gray-200 rounded-sm hover:border-primary hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SearchOverlay />
            <Link href="/wishlist" className="flex items-center gap-2 text-sm text-gray-200" onClick={() => setOpen(false)}>
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
            <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-200" onClick={() => setOpen(false)}>
              <ShoppingCart className="w-4 h-4" /> Cart
              {items.length > 0 && <span className="ml-1 bg-primary text-black px-1.5 text-[11px] font-bold">{items.length}</span>}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Button variant="outline" className="w-full border border-white/20 bg-transparent text-white text-xs font-bold uppercase hover:bg-white hover:text-black transition-all rounded-none h-9" onClick={() => { setOpen(false); authClient.signOut(); }}>Exit</Button>
            ) : (
              <Link href="/sign-in" className="w-full" onClick={() => setOpen(false)}>
                <Button className="neo-button w-full text-xs py-2 h-9">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
