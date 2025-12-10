"use client";

import { useEffect, useState } from "react";

export function SystemClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <span className="opacity-0">00:00:00</span>;

  return (
    <div className="font-mono text-xs tracking-widest text-primary flex items-center gap-2 border border-primary/30 px-2 py-1 bg-black/40">
      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
      UTC {time}
    </div>
  );
}
