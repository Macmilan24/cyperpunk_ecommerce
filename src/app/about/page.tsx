import { Navbar } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 border-l-4 border-primary pl-8">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
                    The <br/><span className="text-primary">Manifesto</span>
                </h1>
                <p className="font-mono text-primary/80 tracking-widest">EST. 2025 // NEO-BRUTALISM DIVISION</p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-2xl font-bold leading-relaxed mb-8 text-gray-200">
                    We reject the soft, the rounded, and the safe. We build for the bold. 
                    Our mission is to provide high-performance gear that stands out in a world of noise.
                </p>

                <div className="grid md:grid-cols-2 gap-12 my-16">
                    <div className="bg-card border border-white/10 p-8 relative overflow-hidden group hover:border-primary transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <div className="w-4 h-4 bg-primary"></div>
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-4 text-white">01. Design</h3>
                        <p className="font-mono text-gray-400 text-sm">
                            Function over form? No. Function IS form. We strip away the unnecessary to reveal the raw core of utility.
                        </p>
                    </div>
                    <div className="bg-card border border-white/10 p-8 relative overflow-hidden group hover:border-primary transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <div className="w-4 h-4 bg-primary"></div>
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-4 text-white">02. Quality</h3>
                        <p className="font-mono text-gray-400 text-sm">
                            Built to last. Engineered to perform. If it breaks, it wasn't ours.
                        </p>
                    </div>
                </div>

                <p className="text-xl text-gray-400 font-mono border-t border-white/10 pt-8">
                    // END OF TRANSMISSION
                </p>
            </div>
        </div>
      </div>
    </main>
  );
}
