"use client";

import { PERSONAL } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";
import { SocialPill, SocialTextLink } from "@/components/SocialLink";
import styles from "./About.module.css";

interface Props { dict: Dictionary; }

function interp(str: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
}

export default function About({ dict }: Props) {
  const ds = useDesignSystem();
  if (ds.layout.about === "prose") return <AboutProse dict={dict} />;
  return <AboutColumns dict={dict} />;
}

/* ─── Professional + Power layout ────────────────────────── */
function AboutColumns({ dict }: Props) {
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
      className={styles.section}
    >
      <div className="section-container">
        <div className={styles.twoColumnGrid}>

          {/* ── Left: prose ── */}
          <div>
            <p className={styles.sectionLabel}>
              {d.label}
            </p>
            <h2 className={styles.heading}>
              {d.heading}
            </h2>

            <div className={styles.bodyText}>
              <p>{interp(d.p1, { name: PERSONAL.name, location: PERSONAL.location, years: String(PERSONAL.yearsExperience) })}</p>
              <p>{d.p2}</p>
              <p>{d.p3}</p>
              <p className={styles.tagline}>
                &ldquo;{PERSONAL.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* ── Right: quick facts card ── */}
          <div className={styles.card}>
            <div className={styles.topAccent} />

            <p className={styles.quickFactsLabel}>
              {d.quickFacts}
            </p>

            {facts.map((item) => (
              <div key={item.label} className={styles.factRow}>
                <span className={styles.factLabel}>{item.label}</span>
                <span className={styles.factValue}>{item.value}</span>
              </div>
            ))}

            <div className={styles.socialLinks}>
              <SocialPill href={PERSONAL.github} label={d.github} platform="github" />
              <SocialPill href={PERSONAL.linkedin} label={d.linkedin} platform="linkedin" />
            </div>
          </div>
        </div>
      </div>
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
      className={styles.sectionProse}
    >
      <div className="section-container">
        <p className={styles.sectionLabelProse}>
          {d.label}
        </p>
        <h2 className={styles.headingProse}>
          {d.heading}
        </h2>

        <div className={styles.bodyTextProse}>
          <p>{interp(d.p1, { name: PERSONAL.name, location: PERSONAL.location, years: String(PERSONAL.yearsExperience) })}</p>
          <p>{d.p2}</p>
          <p>{d.p3}</p>
        </div>

        <blockquote className={styles.blockquote}>
          &ldquo;{PERSONAL.tagline}&rdquo;
        </blockquote>

        <div className={styles.socialLinksProse}>
          <SocialTextLink href={PERSONAL.github} label={d.github} platform="github" />
          <SocialTextLink href={PERSONAL.linkedin} label={d.linkedin} platform="linkedin" />
        </div>
      </div>
    </section>
  );
}
