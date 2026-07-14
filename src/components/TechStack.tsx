"use client";

import { TECH_STACK } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#58a6ff",
  Backend:  "#3fb950",
  Cloud:    "#d2a8ff",
  DevOps:   "#ffa657",
  Data:     "#79c0ff",
  Tooling:  "#8b949e",
};

interface Props { dict: Dictionary; }

export default function TechStack({ dict }: Props) {
  return (
    <section id="techstack" style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
          {dict.techStack.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4rem", color: "var(--text-primary)" }}>
          {dict.techStack.heading}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {Object.entries(TECH_STACK).map(([category, techs]) => (
            <div key={category} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLORS[category] ?? "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: CATEGORY_COLORS[category] ?? "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {category}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {techs.map((tech) => (
                  <span key={tech} style={{ padding: "0.3rem 0.75rem", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
