"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ZenCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== "zen") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let isHover = false;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHover = !!(e.target as HTMLElement)?.closest?.("a, button");
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // Inner: slightly lagged (zen is slow, deliberate)
      outerX += (mouseX - outerX) * 0.06;
      outerY += (mouseY - outerY) * 0.06;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
        innerRef.current.style.opacity = isHover ? "0" : "0.7";
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%,-50%)`;
        outerRef.current.style.width  = isHover ? "48px" : "32px";
        outerRef.current.style.height = isHover ? "48px" : "32px";
        outerRef.current.style.opacity = isHover ? "0.4" : "0.25";
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, [theme]);

  if (theme !== "zen") return null;

  return (
    <>
      {/* Outer soft circle — slow follow */}
      <div
        ref={outerRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "32px", height: "32px",
          borderRadius: "50%",
          border: "1px solid var(--accent)",
          background: "radial-gradient(circle, rgba(122,158,122,0.12) 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 99998,
          transition: "width 0.35s ease, height 0.35s ease, opacity 0.3s",
          willChange: "transform",
        }}
      />
      {/* Inner dot — instant */}
      <div
        ref={innerRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "4px", height: "4px",
          borderRadius: "50%",
          background: "var(--accent)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
