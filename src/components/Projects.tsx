"use client";

import { PROJECTS } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";

interface Props { dict: Dictionary; }

export default function Projects({ dict }: Props) {
  const ds = useDesignSystem();
  if (ds.layout.projects === "list")           return <ProjectsZen dict={dict} />;
  if (ds.layout.projects === "featured+grid")  return <ProjectsPower dict={dict} />;
  return <ProjectsProfessional dict={dict} />;
}

/* ─── Professional layout ─────────────────────────────────── */
function ProjectsProfessional({ dict }: Props) {
  const sectionRef = useSectionEnergy("projects");
  return (
    <section id="projects" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <div className="section-container">
        <SectionHeader dict={dict} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {PROJECTS.map((project, index) => (
            <div
              key={project.title}
              className="ki-card"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", transition: "border-color 0.2s, transform 0.2s", cursor: "default" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: index === 0 ? "var(--accent)" : "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{project.type}</span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>0{index + 1}</span>
              </div>
              <h3 style={{ fontSize: "1.1875rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{project.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65, flex: 1 }}>{project.description}</p>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem", fontFamily: "var(--font-geist-mono)" }}>{dict.projects.highlights}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {project.highlights.slice(0, 3).map((h) => (
                    <li key={h} style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--green)", fontSize: "0.5rem", marginTop: "0.4em" }}>◆</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "auto" }}>
                {project.tech.map((t) => (
                  <span key={t} style={{ padding: "0.2rem 0.625rem", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "3px", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Power layout ────────────────────────────────────────── */
function ProjectsPower({ dict }: Props) {
  const [featured, ...rest] = PROJECTS;
  const sectionRef = useSectionEnergy("projects");

  return (
    <section id="projects" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <div className="section-container">
        <SectionHeader dict={dict} />

        {/* Featured project — full width */}
        <div
          className="ki-card"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "2.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
            position: "relative",
            overflow: "hidden",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(191,95,255,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--accent), var(--purple))", opacity: 0.7 }} />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.6875rem", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, background: "rgba(191,95,255,0.08)", border: "1px solid rgba(191,95,255,0.2)", padding: "0.25rem 0.75rem", borderRadius: "2px" }}>
                Featured
              </span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.6875rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {featured.type}
              </span>
            </div>
            <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              {featured.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
              {featured.description}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <p style={{ fontSize: "0.6875rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem", fontFamily: "var(--font-geist-mono)" }}>{dict.projects.highlights}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {featured.highlights.map((h) => (
                  <li key={h} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--accent)", fontSize: "0.5rem", marginTop: "0.45em", flexShrink: 0 }}>◆</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {featured.tech.map((t) => (
                <span key={t} style={{ padding: "0.25rem 0.625rem", background: "rgba(191,95,255,0.05)", border: "1px solid rgba(191,95,255,0.15)", borderRadius: "2px", fontSize: "0.75rem", color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Remaining projects — smaller grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }} className="projects-grid">
          {rest.map((project, index) => (
            <div
              key={project.title}
              className="ki-card"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(191,95,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.6875rem", color: "var(--purple)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{project.type}</span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.6875rem", color: "var(--text-muted)" }}>0{index + 2}</span>
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{project.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, flex: 1 }}>{project.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "auto" }}>
                {project.tech.slice(0, 4).map((t) => (
                  <span key={t} style={{ padding: "0.2rem 0.5rem", background: "rgba(191,95,255,0.04)", border: "1px solid rgba(191,95,255,0.1)", borderRadius: "2px", fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function ProjectsZen({ dict }: Props) {
  const sectionRef = useSectionEnergy("projects");
  return (
    <section id="projects" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0.7 }}>
          {dict.projects.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "1rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {dict.projects.heading}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "3.5rem", lineHeight: 1.75 }}>
          {dict.projects.subtitle}
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {PROJECTS.map((project, index) => (
            <div
              key={project.title}
              style={{
                padding: "2rem 0",
                borderBottom: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "3rem 1fr",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "1.25rem", color: "var(--text-muted)", fontWeight: 300, paddingTop: "0.2rem" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {project.type}
                </p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem", letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}>
                  {project.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.8, marginBottom: "1rem" }}>
                  {project.description}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.6 }}>
                  {project.tech.join(" · ")}
                </p>
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
        {dict.projects.label}
      </p>
      <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
        {dict.projects.heading}
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "4rem", maxWidth: "560px" }}>
        {dict.projects.subtitle}
      </p>
    </>
  );
}
