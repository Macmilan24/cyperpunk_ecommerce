"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isSignUp) {
      await authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: () => {
            router.push("/");
        },
        onError: (ctx) => {
            setError(ctx.error.message || "Registration failed. User may already exist.");
        }
      });
    } else {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
            router.push("/");
        },
        onError: (ctx) => {
            setError(ctx.error.message || "Authentication failed.");
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-block border border-primary/30 bg-primary/5 px-4 py-1 rounded-full text-primary text-xs font-mono tracking-widest mb-4 animate-pulse">
                SECURE_CONNECTION_ESTABLISHED
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                {isSignUp ? "New User Protocol" : "Identity Verification"}
            </h1>
            <p className="text-gray-500 font-mono text-xs">
                ENTER CREDENTIALS TO ACCESS SYSTEM
            </p>
        </div>

        <div className="bg-black border border-white/10 p-8 relative group">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
                <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-mono text-gray-400 uppercase tracking-widest">User_ID</Label>
                <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 text-white font-mono focus:border-primary rounded-none h-12"
                    placeholder="ENTER_NAME"
                />
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-mono text-gray-400 uppercase tracking-widest">Email_Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 text-white font-mono focus:border-primary rounded-none h-12"
                    placeholder="USER@DOMAIN.COM"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-mono text-gray-400 uppercase tracking-widest">Access_Key</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 text-white font-mono focus:border-primary rounded-none h-12"
                    placeholder="••••••••"
                />
            </div>
            <Button type="submit" className="w-full neo-button h-12 text-sm mt-4">
                {isSignUp ? "Initialize Registration" : "Authenticate"}
            </Button>
            
            {error && (
                <div className="mt-4 p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    ERROR: {error}
                </div>
            )}
            </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-mono text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
          >
            {isSignUp ? "[ Switch to Login Protocol ]" : "[ Request New Access ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
