"use client";

import { useTheme, type AppTheme } from "@/context/ThemeContext";
import type { ThemeTokens } from "./types";

export type { ThemeTokens };
export * from "./types";

// ─── Theme token definitions ──────────────────────────────────────────────────

const professional: ThemeTokens = {
  id: "professional",
  motion: {
    fast: 150,
    normal: 300,
    slow: 500,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    cardHoverY: "-3px",
  },
  card: {
    radius: "12px",
    padding: "2rem",
    paddingSm: "1.5rem",
    className: "",
    hoverBorderColor: "var(--accent-dim)",
    hoverBoxShadow: "none",
    topAccentLine: false,
  },
  tag: {
    bg: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    radius: "4px",
    fontFamily: "inherit",
  },
  effect: {
    accentTextShadow: "none",
    accentBorderColor: "var(--accent-dim)",
    factValueColor: "var(--text-primary)",
    linkHoverBorderColor: "var(--text-muted)",
    linkHoverBoxShadow: "none",
  },
  three: {
    heroCanvas: true,
    philosophyCanvas: true,
  },
  layout: {
    about: "twoColumn",
    skills: "cards",
    projects: "grid",
    experience: "cards",
  },
};

const power: ThemeTokens = {
  id: "power",
  motion: {
    fast: 100,
    normal: 200,
    slow: 400,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    cardHoverY: "-3px",
  },
  card: {
    radius: "6px",
    padding: "2rem",
    paddingSm: "1.5rem",
    className: "ki-card",
    hoverBorderColor: "var(--accent-dim)",
    hoverBoxShadow: "0 0 24px rgba(0,212,255,0.1)",
    topAccentLine: true,
  },
  tag: {
    bg: "rgba(0,212,255,0.05)",
    border: "1px solid rgba(0,212,255,0.15)",
    color: "var(--text-primary)",
    radius: "2px",
    fontFamily: "var(--font-geist-mono)",
  },
  effect: {
    accentTextShadow: "0 0 12px rgba(191,95,255,0.4)",
    accentBorderColor: "var(--accent)",
    factValueColor: "var(--accent)",
    linkHoverBorderColor: "var(--accent)",
    linkHoverBoxShadow: "0 0 12px rgba(191,95,255,0.25)",
  },
  three: {
    heroCanvas: true,
    philosophyCanvas: true,
  },
  layout: {
    about: "twoColumn",
    skills: "cards",
    projects: "featured+grid",
    experience: "energy-timeline",
  },
};

const zen: ThemeTokens = {
  id: "zen",
  motion: {
    fast: 150,
    normal: 250,
    slow: 350,
    easing: "ease",
    cardHoverY: "0",
  },
  card: {
    radius: "8px",
    padding: "1.75rem",
    paddingSm: "1.25rem",
    className: "",
    hoverBorderColor: "var(--text-muted)",
    hoverBoxShadow: "none",
    topAccentLine: false,
  },
  tag: {
    bg: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    radius: "0",
    fontFamily: "inherit",
  },
  effect: {
    accentTextShadow: "none",
    accentBorderColor: "var(--accent-dim)",
    factValueColor: "var(--text-secondary)",
    linkHoverBorderColor: "var(--text-muted)",
    linkHoverBoxShadow: "none",
  },
  three: {
    heroCanvas: false,
    philosophyCanvas: false,
  },
  layout: {
    about: "prose",
    skills: "prose",
    projects: "list",
    experience: "reading-list",
  },
};

const THEMES: Record<AppTheme, ThemeTokens> = { professional, power, zen };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDesignSystem(): ThemeTokens {
  const { theme } = useTheme();
  return THEMES[theme];
}
