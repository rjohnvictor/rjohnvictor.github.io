"use client";

import { useState } from "react";
import { useTheme, type AppTheme } from "@/context/ThemeContext";

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
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      {/* Options panel */}
      {open && (
        <div
          style={{
            background: "var(--bg-card, #0d1117)",
            border: "1px solid var(--border, #21262d)",
            borderRadius: "12px",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            animation: "ts-slideUp 0.2s ease-out",
          }}
        >
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setTheme(mode.id); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 1rem",
                background: theme === mode.id ? "var(--bg-subtle, #161b22)" : "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: theme === mode.id ? "var(--text-primary, #e6edf3)" : "var(--text-secondary, #8b949e)",
                fontSize: "0.875rem",
                fontWeight: theme === mode.id ? 600 : 400,
                textAlign: "left",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (theme !== mode.id) {
                  e.currentTarget.style.background = "var(--bg-subtle, #161b22)";
                  e.currentTarget.style.color = "var(--text-primary, #e6edf3)";
                }
              }}
              onMouseLeave={(e) => {
                if (theme !== mode.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary, #8b949e)";
                }
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", lineHeight: 1, color: theme === mode.id ? "var(--accent)" : "inherit" }}>{mode.icon}</span>
              <div>
                <p style={{ margin: 0, lineHeight: 1.2 }}>{mode.label}</p>
                <p style={{ margin: 0, fontSize: "0.6875rem", opacity: 0.6, fontFamily: "var(--font-geist-mono, monospace)" }}>
                  {mode.desc}
                </p>
              </div>
              {theme === mode.id && (
                <span style={{ marginLeft: "auto", color: "var(--accent, #58a6ff)", fontSize: "0.75rem" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "var(--bg-card, #0d1117)",
          border: "1px solid var(--border, #21262d)",
          borderRadius: "24px",
          cursor: "pointer",
          color: "var(--text-secondary, #8b949e)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--text-muted, #484f58)";
          e.currentTarget.style.color = "var(--text-primary, #e6edf3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border, #21262d)";
          e.currentTarget.style.color = "var(--text-secondary, #8b949e)";
        }}
        aria-label="Switch theme mode"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "16px", lineHeight: 1, color: "var(--accent)" }}>{current.icon}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: "0.625rem", opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>

      <style>{`
        @keyframes ts-slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
