"use client";

import { useEffect, useState } from "react";

const LOGS = [
  "SYSTEM: Connection established...",
  "NETWORK: Encrypted channel active",
  "DATA: Inventory synced with warehouse_01",
  "USER: Session ID verified",
  "SECURITY: Firewall active",
  "ORDER: #9923 Processed successfully",
  "SYSTEM: Optimization protocols running...",
  "NETWORK: Latency 12ms",
];

export function SystemLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs(LOGS);
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev];
        const first = newLogs.shift();
        if (first) newLogs.push(first);
        return newLogs;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] text-gray-600 h-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-10"></div>
      <div className="flex flex-col gap-1">
        {logs.map((log, i) => (
          <div key={i} className="opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <span className="text-primary mr-2">{">"}</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
