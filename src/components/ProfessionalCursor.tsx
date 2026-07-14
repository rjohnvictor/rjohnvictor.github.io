"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ProfessionalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== "professional") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHover = false;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHover = !!(e.target as HTMLElement)?.closest?.("a, button, [role='button']");
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
        dotRef.current.style.opacity = isHover ? "0" : "1";
        dotRef.current.style.background = isHover ? "var(--accent)" : "var(--accent)";
      }

      // Ring: spring lag
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
        ringRef.current.style.width  = isHover ? "44px" : "30px";
        ringRef.current.style.height = isHover ? "44px" : "30px";
        ringRef.current.style.borderColor = isHover
          ? "var(--accent)"
          : "rgba(88,166,255,0.55)";
        ringRef.current.style.background = isHover
          ? "rgba(88,166,255,0.08)"
          : "transparent";
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, [theme]);

  if (theme !== "professional") return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "6px", height: "6px",
          background: "var(--accent)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "opacity 0.15s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "30px", height: "30px",
          border: "1.5px solid rgba(88,166,255,0.55)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transition: "width 0.2s, height 0.2s, border-color 0.2s, background 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
