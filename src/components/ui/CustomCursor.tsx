"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  // Detect touch/pen input only when it actually occurs, so desktops with touch screens keep the cursor until touched.
  useEffect(() => {
    const markTouch = () => setIsTouch(true);
    const markPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        setIsTouch(true);
      }
    };

    const win = typeof globalThis === "undefined" ? undefined : globalThis.window;
    if (win) {
      win.addEventListener("touchstart", markTouch, { once: true });
      win.addEventListener("pointerdown", markPointer, { passive: true });
    }

    return () => {
      if (win) {
        win.removeEventListener("touchstart", markTouch);
        win.removeEventListener("pointerdown", markPointer as any);
      }
    };
  }, []);

  // Disable on small viewports (mobile widths)
  useEffect(() => {
    const win = typeof globalThis === "undefined" ? undefined : globalThis.window;
    if (!win) return;
    const mq = win.matchMedia("(max-width: 767px)");
    const sync = () => setIsSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Only attach mouse listeners when not in touch mode.
  useEffect(() => {
    if (isTouch || isSmall) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-hover")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const win = typeof globalThis === "undefined" ? undefined : globalThis.window;
    if (win) {
      win.addEventListener("mousemove", updateMousePosition);
      win.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      if (win) {
        win.removeEventListener("mousemove", updateMousePosition);
        win.removeEventListener("mouseover", handleMouseOver);
      }
    };
  }, [isTouch, isSmall]);

  if (isTouch || isSmall) return null;

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(204, 255, 0, 0.1)" : "transparent",
          borderColor: isHovering ? "transparent" : "#CCFF00",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        {/* Crosshair lines appearing on hover */}
        {isHovering && (
            <>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/50 -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-primary/50 -translate-x-1/2"></div>
            </>
        )}
      </motion.div>
    </>
  );
}
