'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:inline text-xs font-mono group-hover:text-primary">[CTRL+K]</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-4 relative">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-12 right-4 text-gray-500 hover:text-white"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="border border-primary/30 bg-black p-1 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH_DATABASE..."
                            className="w-full bg-white/5 text-white text-2xl font-black uppercase tracking-tighter p-6 focus:outline-none placeholder-gray-700 font-mono"
                            autoFocus
                        />
                        <button 
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-black px-4 py-2 transition-colors"
                        >
                            Execute
                        </button>
                    </form>
                </div>
                
                <div className="mt-4 flex justify-between text-xs font-mono text-gray-600 uppercase tracking-widest">
                    <span>System.Search.Module</span>
                    <span>Ready</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
