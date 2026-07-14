"use client";

import { SKILLS } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem, type ThemeTokens } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";

interface Props { dict: Dictionary; }

export default function Skills({ dict }: Props) {
  const ds = useDesignSystem();
  if (ds.layout.skills === "prose") return <SkillsProse dict={dict} />;
  return <SkillsCards dict={dict} ds={ds} />;
}

/* ─── Professional + Power layout ────────────────────────── */
function SkillsCards({ dict, ds }: Props & { ds: ThemeTokens }) {
  const sectionRef = useSectionEnergy("skills");

  return (
    <section
      id="skills"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
          {dict.skills.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
          {dict.skills.heading}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "4rem", maxWidth: "560px" }}>
          {dict.skills.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {SKILLS.map((group) => (
            <div
              key={group.category}
              className={ds.card.className}
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: ds.card.radius,
                padding: ds.card.padding,
                transition: `border-color ${ds.motion.normal}ms ${ds.motion.easing}, box-shadow ${ds.motion.normal}ms ${ds.motion.easing}`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ds.card.hoverBorderColor;
                if (ds.card.hoverBoxShadow !== "none") e.currentTarget.style.boxShadow = ds.card.hoverBoxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {ds.card.topAccentLine && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)", opacity: 0.5 }} />
              )}

              <p style={{
                color: "var(--accent)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.75rem",
                letterSpacing: ds.id === "power" ? "0.2em" : "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
                fontWeight: 600,
                textShadow: ds.effect.accentTextShadow,
              }}>
                {group.category}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "0.3rem 0.75rem",
                      background: ds.tag.bg,
                      border: ds.tag.border,
                      borderRadius: ds.tag.radius,
                      fontSize: "0.8125rem",
                      color: ds.tag.color,
                      fontWeight: 500,
                      fontFamily: ds.tag.fontFamily,
                    }}
                  >
                    {item}
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

/* ─── Zen layout ──────────────────────────────────────────── */
function SkillsProse({ dict }: Props) {
  const sectionRef = useSectionEnergy("skills");

  return (
    <section
      id="skills"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0.7 }}>
          {dict.skills.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "1rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {dict.skills.heading}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "3.5rem", lineHeight: 1.75 }}>
          {dict.skills.subtitle}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {SKILLS.map((group) => (
            <div key={group.category}>
              <h3 style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {group.category}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.8 }}>
                {group.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
