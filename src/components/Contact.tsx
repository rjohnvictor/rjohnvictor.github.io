"use client";

import { PERSONAL } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";
import { SocialButton } from "@/components/SocialLink";

interface Props { dict: Dictionary; }

export default function Contact({ dict }: Props) {
  const d = dict.contact;
  const sectionRef = useSectionEnergy("contact");

  return (
    <section id="contact" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "8rem 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-container">
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
            {d.label}
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "1.25rem", color: "var(--text-primary)", lineHeight: 1.15 }}>
            {d.heading}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem" }}>
            {d.body}
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Primary: email CTA */}
            <a
              href={`mailto:${PERSONAL.email}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "var(--accent)",
                color: "#08090a",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600, fontSize: "0.9375rem",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 0 16px var(--accent-glow)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {d.sendEmail}
            </a>

            {/* Secondary: social links with brand icons */}
            <SocialButton href={PERSONAL.linkedin} label={d.linkedin} platform="linkedin" />
            <SocialButton href={PERSONAL.github} label={d.github} platform="github" />
          </div>
        </div>
      </div>
    </section>
  );
}
