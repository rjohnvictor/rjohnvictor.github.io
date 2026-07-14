"use client";

import { PERSONAL } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";
import { SocialButton } from "@/components/SocialLink";
import styles from "./Contact.module.css";

interface Props { dict: Dictionary; }

export default function Contact({ dict }: Props) {
  const d = dict.contact;
  const sectionRef = useSectionEnergy("contact");

  return (
    <section id="contact" ref={sectionRef as React.RefObject<HTMLElement>} className={styles.section}>
      <div className="section-container">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>
            {d.label}
          </p>
          <h2 className={styles.heading}>
            {d.heading}
          </h2>
          <p className={styles.body}>
            {d.body}
          </p>

          <div className={styles.buttonRow}>
            {/* Primary: email CTA */}
            <a
              href={`mailto:${PERSONAL.email}`}
              className={styles.emailBtn}
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
