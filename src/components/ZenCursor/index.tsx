"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./ZenCursor.module.css";

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
      <div ref={outerRef} className={styles.outer} />
      {/* Inner dot — instant */}
      <div ref={innerRef} className={styles.inner} />
    </>
  );
}
