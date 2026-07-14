"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

// Ordered section graph — edges connect adjacent nodes + a few cross-links
export const SECTION_IDS = ["hero", "about", "experience", "skills", "projects", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

// Directed edges defining the graph structure
const EDGES: [SectionId, SectionId][] = [
  ["hero",       "about"],
  ["about",      "experience"],
  ["experience", "skills"],
  ["skills",     "projects"],
  ["projects",   "contact"],
  // Cross-connections make the graph feel like a real network
  ["hero",       "skills"],
  ["about",      "projects"],
  ["experience", "contact"],
];

export interface EnergyState {
  visited: Set<SectionId>;
  energyLevel: number;     // 0 – 1
  edges: [SectionId, SectionId][];
  activateSection: (id: SectionId) => void;
  deactivateSection: (id: SectionId) => void;
  isVisited: (id: SectionId) => boolean;
  isEdgeLit: (a: SectionId, b: SectionId) => boolean;
}

const EnergyCtx = createContext<EnergyState | null>(null);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [visited, setVisited] = useState<Set<SectionId>>(new Set(["hero"]));

  const activateSection = useCallback((id: SectionId) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const deactivateSection = useCallback((id: SectionId) => {
    setVisited((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const energyLevel = visited.size / SECTION_IDS.length;
  const isVisited = useCallback((id: SectionId) => visited.has(id), [visited]);

  const isEdgeLit = useCallback(
    (a: SectionId, b: SectionId) =>
      visited.has(a) && visited.has(b) &&
      EDGES.some(([ea, eb]) => (ea === a && eb === b) || (ea === b && eb === a)),
    [visited],
  );

  const value = useMemo(
    () => ({ visited, energyLevel, edges: EDGES, activateSection, deactivateSection, isVisited, isEdgeLit }),
    [visited, energyLevel, activateSection, deactivateSection, isVisited, isEdgeLit],
  );

  return <EnergyCtx.Provider value={value}>{children}</EnergyCtx.Provider>;
}

export function useEnergy(): EnergyState {
  const ctx = useContext(EnergyCtx);
  if (!ctx) throw new Error("useEnergy must be used inside <EnergyProvider>");
  return ctx;
}
