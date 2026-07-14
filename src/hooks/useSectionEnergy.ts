"use client";

import { useEffect, useRef } from "react";
import { useEnergy, type SectionId } from "@/context/EnergyContext";
import { useTheme } from "@/context/ThemeContext";

/**
 * Attach the returned ref to a section's root element.
 *
 * Activation/deactivation rules (Power mode only):
 *   - Section enters viewport              → activate
 *   - Section exits viewport from TOP      → keep active  (scrolled down past it)
 *   - Section exits viewport from BOTTOM   → deactivate   (scrolled back up past it)
 */
export function useSectionEnergy(id: SectionId) {
  const { activateSection, deactivateSection } = useEnergy();
  const { theme } = useTheme();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (theme !== "power") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Any part of section entered viewport → activate
          activateSection(id);
        } else {
          // threshold: 0 guarantees this fires only when section has
          // FULLY left the viewport (intersectionRatio === 0).
          // At that point we can reliably test direction:
          //   top > viewportBottom → section fell below viewport → scrolled UP → deactivate
          //   top <= 0            → section left from top → scrolled DOWN past it → keep active
          const viewportBottom = entry.rootBounds?.bottom ?? window.innerHeight;
          if (entry.boundingClientRect.top > viewportBottom) {
            deactivateSection(id);
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, activateSection, deactivateSection, theme]);

  return ref;
}
