"use client";

import { EXPERIENCE } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";

interface Props { dict: Dictionary; }

export default function Experience({ dict }: Props) {
  const ds = useDesignSystem();
  if (ds.layout.experience === "energy-timeline") return <ExperienceEnergyTimeline dict={dict} />;
  if (ds.layout.experience === "reading-list")    return <ExperienceReadingList dict={dict} />;
  return <ExperienceCards dict={dict} />;
}

/* ─── Professional layout (card stack) ───────────────────── */
function ExperienceCards({ dict }: Props) {
  const sectionRef = useSectionEnergy("experience");

  return (
    <section
      id="experience"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "8rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <SectionHeader dict={dict} />

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {EXPERIENCE.map((job) => (
            <div
              key={`${job.company}-${job.role}`}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "2.5rem", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: "linear-gradient(to bottom, var(--accent), var(--accent-dim))", borderRadius: "3px 0 0 3px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>{job.role}</h3>
                  <p style={{ color: "var(--accent)", fontSize: "0.9375rem", fontWeight: 600 }}>{job.company}</p>
                </div>
                <span style={{ padding: "0.3rem 0.875rem", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "20px", fontSize: "0.8125rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", whiteSpace: "nowrap" }}>
                  {job.period}
                </span>
              </div>

              <ul style={{ display: "flex", flexDirection: "column", gap: "0.875rem", listStyle: "none", padding: 0, margin: 0 }}>
                {job.bullets.map((bullet, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.875rem", color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                    <span style={{ color: "var(--green)", flexShrink: 0, marginTop: "0.35em", fontSize: "0.625rem" }}>▶</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Power layout (energy timeline) ─────────────────────── */
function ExperienceEnergyTimeline({ dict }: Props) {
  const sectionRef = useSectionEnergy("experience");

  return (
    <section
      id="experience"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "8rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <SectionHeader dict={dict} />

        <div style={{ position: "relative" }}>
          {EXPERIENCE.map((job, index) => {
            const isLast = index === EXPERIENCE.length - 1;
            return (
              <div
                key={`${job.company}-${job.role}`}
                style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: "1.75rem", marginBottom: isLast ? 0 : "2.5rem" }}
              >
                {/* Timeline column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Node */}
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      boxShadow: "0 0 16px rgba(191,95,255,0.9), 0 0 32px rgba(191,95,255,0.3)",
                      marginTop: "0.4rem",
                      flexShrink: 0,
                      zIndex: 1,
                      position: "relative",
                    }}
                  />
                  {/* Vertical connector to next node */}
                  {!isLast && (
                    <div
                      style={{
                        flex: 1,
                        width: "2px",
                        background: "linear-gradient(to bottom, rgba(191,95,255,0.5) 0%, rgba(191,95,255,0.05) 100%)",
                        marginTop: "0.375rem",
                      }}
                    />
                  )}
                </div>

                {/* Card */}
                <div
                  className="ki-card"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(191,95,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Top energy line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, var(--accent), var(--purple), transparent)", opacity: 0.5 }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.1875rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>{job.role}</h3>
                      <p style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textShadow: "0 0 8px rgba(191,95,255,0.3)" }}>{job.company}</p>
                    </div>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      background: "rgba(191,95,255,0.06)",
                      border: "1px solid rgba(191,95,255,0.15)",
                      borderRadius: "2px",
                      fontSize: "0.75rem",
                      color: "var(--accent)",
                      fontFamily: "var(--font-geist-mono)",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}>
                      {job.period}
                    </span>
                  </div>

                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", listStyle: "none", padding: 0, margin: 0 }}>
                    {job.bullets.map((bullet, i) => (
                      <li key={i} style={{ display: "flex", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.4em", fontSize: "0.5rem" }}>◆</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Zen layout (reading list) ──────────────────────────── */
function ExperienceReadingList({ dict }: Props) {
  const sectionRef = useSectionEnergy("experience");

  return (
    <section
      id="experience"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0.7 }}>
          {dict.experience.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "4rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {dict.experience.heading}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {EXPERIENCE.map((job, index) => (
            <div
              key={`${job.company}-${job.role}`}
              style={{ padding: "2.5rem 0", borderBottom: index < EXPERIENCE.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <p style={{ color: "var(--accent)", fontSize: "0.8125rem", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {job.company}
                </p>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem", fontFamily: "var(--font-geist-mono)" }}>
                  {job.period}
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
                {job.role}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {job.bullets.map((bullet, i) => (
                  <p key={i} style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.8, paddingLeft: "0" }}>
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Shared section header ───────────────────────────────── */
function SectionHeader({ dict }: Props) {
  return (
    <>
      <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
        {dict.experience.label}
      </p>
      <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4rem", color: "var(--text-primary)" }}>
        {dict.experience.heading}
      </h2>
    </>
  );
}
