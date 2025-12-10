"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function GlitchText({ text, className, size = "lg" }: GlitchTextProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl md:text-8xl",
    xl: "text-7xl md:text-9xl",
    "2xl": "text-8xl md:text-[10rem]",
  };

  return (
    <div className={cn("relative inline-block font-black uppercase tracking-tighter", sizeClasses[size], className)}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-70 animate-pulse" 
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)", transform: "translate(-2px, 2px)" }}
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 -z-10 w-full h-full text-accent opacity-70 animate-pulse" 
        style={{ clipPath: "polygon(0 80%, 100% 20%, 100% 100%, 0 100%)", transform: "translate(2px, -2px)", animationDelay: "0.1s" }}
      >
        {text}
      </span>
    </div>
  );
}
