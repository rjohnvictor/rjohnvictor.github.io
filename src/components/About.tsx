"use client";

import { PERSONAL } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem, type ThemeTokens } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";
import { SocialPill, SocialTextLink } from "@/components/SocialLink";

interface Props { dict: Dictionary; }

function interp(str: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
}

export default function About({ dict }: Props) {
  const ds = useDesignSystem();
  if (ds.layout.about === "prose") return <AboutProse dict={dict} />;
  return <AboutColumns dict={dict} ds={ds} />;
}

/* ─── Professional + Power layout ────────────────────────── */
function AboutColumns({ dict, ds }: Props & { ds: ThemeTokens }) {
  const d = dict.about;
  const sectionRef = useSectionEnergy("about");

  const facts = [
    { label: d.factExperience,     value: interp(d.factExperienceValue, { years: String(PERSONAL.yearsExperience) }) },
    { label: d.factLocation,       value: PERSONAL.location },
    { label: d.factSpecialization, value: d.factSpecializationValue },
    { label: d.factCurrentFocus,   value: d.factCurrentFocusValue },
    { label: d.factOpenTo,         value: d.factOpenToValue },
  ];

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "8rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="about-grid">

          {/* ── Left: prose ── */}
          <div>
            <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
              {d.label}
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "2rem", lineHeight: 1.15, color: "var(--text-primary)" }}>
              {d.heading}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.75 }}>
              <p>{interp(d.p1, { name: PERSONAL.name, location: PERSONAL.location, years: String(PERSONAL.yearsExperience) })}</p>
              <p>{d.p2}</p>
              <p>{d.p3}</p>
              <p style={{
                color: "var(--accent)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.9375rem",
                borderLeft: `2px solid ${ds.effect.accentBorderColor}`,
                paddingLeft: "1rem",
                marginTop: "0.5rem",
                textShadow: ds.effect.accentTextShadow,
              }}>
                &ldquo;{PERSONAL.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* ── Right: quick facts card ── */}
          <div
            className={ds.card.className}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: ds.card.radius,
              padding: ds.card.padding,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {ds.card.topAccentLine && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--accent-dim), transparent)", opacity: 0.6 }} />
            )}

            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {d.quickFacts}
            </p>

            {facts.map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 0", borderBottom: "1px solid var(--bg-subtle)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "var(--font-geist-mono)" }}>{item.label}</span>
                <span style={{ color: ds.effect.factValueColor, fontSize: "0.9375rem", fontWeight: 500, textShadow: ds.effect.accentTextShadow }}>{item.value}</span>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              <SocialPill href={PERSONAL.github} label={d.github} platform="github" motionFast={ds.motion.fast} hoverBorderColor={ds.effect.linkHoverBorderColor} hoverBoxShadow={ds.effect.linkHoverBoxShadow} />
              <SocialPill href={PERSONAL.linkedin} label={d.linkedin} platform="linkedin" motionFast={ds.motion.fast} hoverBorderColor={ds.effect.linkHoverBorderColor} hoverBoxShadow={ds.effect.linkHoverBoxShadow} />
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function AboutProse({ dict }: Props) {
  const d = dict.about;
  const sectionRef = useSectionEnergy("about");

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0.7 }}>
          {d.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "3rem", lineHeight: 1.2, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {d.heading}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.9, maxWidth: "62ch" }}>
          <p>{interp(d.p1, { name: PERSONAL.name, location: PERSONAL.location, years: String(PERSONAL.yearsExperience) })}</p>
          <p>{d.p2}</p>
          <p>{d.p3}</p>
        </div>

        <blockquote style={{ margin: "3rem 0 0", padding: "1.5rem 2rem", borderLeft: "2px solid var(--accent-dim)", color: "var(--text-secondary)", fontStyle: "italic", fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: "52ch" }}>
          &ldquo;{PERSONAL.tagline}&rdquo;
        </blockquote>

        <div style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}>
          <SocialTextLink href={PERSONAL.github} label={d.github} platform="github" />
          <SocialTextLink href={PERSONAL.linkedin} label={d.linkedin} platform="linkedin" />
        </div>
      </div>
    </section>
  );
}
