"use client";

import { useState } from "react";
import { useTheme, type AppTheme } from "@/context/ThemeContext";
import styles from "./ThemeSwitcher.module.css";

const MODES: { id: AppTheme; label: string; icon: string; desc: string }[] = [
  { id: "professional", label: "Professional", icon: "work",             desc: "Clean & crafted" },
  { id: "power",        label: "Power",        icon: "bolt",             desc: "Energy & impact" },
  { id: "zen",          label: "Zen",          icon: "self_improvement", desc: "Focus & clarity" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = MODES.find((m) => m.id === theme)!;

  return (
    <div className={styles.root}>
      {/* Options panel */}
      {open && (
        <div className={styles.panel}>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setTheme(mode.id); setOpen(false); }}
              className={styles.modeBtn}
              data-active={theme === mode.id}
            >
              <span
                className={`material-symbols-outlined ${styles.modeIcon}`}
                data-active={theme === mode.id}
              >
                {mode.icon}
              </span>
              <div>
                <p className={styles.modeLabel}>{mode.label}</p>
                <p className={styles.modeDesc}>{mode.desc}</p>
              </div>
              {theme === mode.id && (
                <span className={styles.modeCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={styles.toggleBtn}
        aria-label="Switch theme mode"
      >
        <span className={`material-symbols-outlined ${styles.toggleIcon}`}>{current.icon}</span>
        <span>{current.label}</span>
        <span className={styles.toggleChevron}>{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}
