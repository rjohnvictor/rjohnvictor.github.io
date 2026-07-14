"use client";

import ProfessionalCursor from "./ProfessionalCursor";
import KiCursor from "./KiCursor";
import ZenCursor from "./ZenCursor";

/**
 * Single mount point for all cursor variants.
 * Each cursor component reads useTheme() and renders only when its mode is active.
 */
export default function CursorManager() {
  return (
    <>
      <ProfessionalCursor />
      <KiCursor />
      <ZenCursor />
    </>
  );
}
