"use client";

import type { Dictionary } from "@/types/dictionary";
import { useTheme } from "@/context/ThemeContext";

interface Props { dict: Dictionary; }

const PILLARS = (d: Dictionary["manifesto"]) => [
  { key: "resilience", title: d.resilience, body: d.resilienceBody },
  { key: "journey",    title: d.journey,    body: d.journeyBody },
  { key: "vision",     title: d.vision,     body: d.visionBody },
];

export default function Manifesto({ dict }: Props) {
  const { theme } = useTheme();
  const d = dict.manifesto;

  if (theme === "power") return <ManifestoPower d={d} />;
  if (theme === "zen")   return <ManifestoZen d={d} />;
  return <ManifestoProfessional d={d} />;
}

/* ─── Professional: clean three-column ───────────────────── */
function ManifestoProfessional({ d }: { d: Dictionary["manifesto"] }) {
  const pillars = PILLARS(d);

  return (
    <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-container">
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          {d.label}
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "3.5rem", lineHeight: 1.15 }}>
          {d.heading}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }} className="manifesto-grid">
          {pillars.map((p, i) => (
            <div key={p.key}>
              <span style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem", opacity: 0.7 }}>
                0{i + 1}
              </span>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem", letterSpacing: "-0.02em" }}>
                {p.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .manifesto-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── Power: dramatic full-bleed, glowing words ──────────── */
function ManifestoPower({ d }: { d: Dictionary["manifesto"] }) {
  const pillars = PILLARS(d);

  return (
    <section
      style={{
        padding: "8rem 0",
        borderTop: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background corona */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(191,95,255,0.06) 0%, transparent 70%)",
      }} />

      <div className="section-container" style={{ position: "relative" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", textAlign: "center" }}>
          {d.label}
        </p>

        {/* Giant manifesto headline */}
        <h2
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            textAlign: "center",
            marginBottom: "5rem",
            background: "linear-gradient(135deg, #fde68a 0%, #bf5fff 50%, #e879f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(191,95,255,0.3))",
          }}
        >
          {d.heading}
        </h2>

        {/* Pillar cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="manifesto-power-grid">
          {pillars.map((p, i) => (
            <div
              key={p.key}
              className="ki-card"
              style={{
                padding: "2rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(191,95,255,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: 0.5 }} />

              <span style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: "0.6875rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.6 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #f2eeff 0%, #bf5fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .manifesto-power-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── Zen: centered, large serif, meditative ─────────────── */
function ManifestoZen({ d }: { d: Dictionary["manifesto"] }) {
  const pillars = PILLARS(d);

  return (
    <section style={{ padding: "7rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-container">
        <div style={{ maxWidth: "52ch", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0.6 }}>
            {d.label}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              lineHeight: 1.2,
              marginBottom: "4rem",
            }}
          >
            {d.heading}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
            {pillars.map((p) => (
              <div key={p.key} style={{ textAlign: "left" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.9, fontFamily: "var(--font-body)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
