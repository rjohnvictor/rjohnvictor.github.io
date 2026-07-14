"use client";

import { EXPERIENCE } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import { useDesignSystem } from "@/design-system";
import { useSectionEnergy } from "@/hooks/useSectionEnergy";
import styles from "./Experience.module.css";

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
      className={styles.section}
    >
      <div className="section-container">
        <SectionHeader dict={dict} />

        <div className={styles.cardList}>
          {EXPERIENCE.map((job) => (
            <div
              key={`${job.company}-${job.role}`}
              className={`exp-card ${styles.card}`}
            >
              <div className={styles.cardAccentBar} />

              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardRole}>{job.role}</h3>
                  <p className={styles.cardCompany}>{job.company}</p>
                </div>
                <span className={styles.periodBadge}>
                  {job.period}
                </span>
              </div>

              <ul className={styles.bulletList}>
                {job.bullets.map((bullet, i) => (
                  <li key={i} className={styles.bulletItem}>
                    <span className={styles.bulletIcon}>▶</span>
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
      className={styles.section}
    >
      <div className="section-container">
        <SectionHeader dict={dict} />

        <div className={styles.timelineWrapper}>
          {EXPERIENCE.map((job, index) => {
            const isLast = index === EXPERIENCE.length - 1;
            return (
              <div
                key={`${job.company}-${job.role}`}
                className={`${styles.timelineRow}${isLast ? "" : ` ${styles.timelineRowSpaced}`}`}
              >
                {/* Timeline column */}
                <div className={styles.timelineColumn}>
                  <div className={styles.timelineNode} />
                  {!isLast && <div className={styles.timelineConnector} />}
                </div>

                {/* Card */}
                <div className={`ki-card exp-card ${styles.kiCard}`}>
                  <div className={styles.kiCardEnergyLine} />

                  <div className={styles.kiCardHeader}>
                    <div>
                      <h3 className={styles.kiCardRole}>{job.role}</h3>
                      <p className={styles.kiCardCompany}>{job.company}</p>
                    </div>
                    <span className={styles.periodBadge}>
                      {job.period}
                    </span>
                  </div>

                  <ul className={styles.kiBulletList}>
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className={styles.kiBulletItem}>
                        <span className={styles.kiBulletIcon}>◆</span>
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
      className={styles.sectionZen}
    >
      <div className="section-container">
        <p className={styles.zenLabel}>{dict.experience.label}</p>
        <h2 className={styles.zenHeading}>{dict.experience.heading}</h2>

        <div className={styles.zenList}>
          {EXPERIENCE.map((job, index) => (
            <div
              key={`${job.company}-${job.role}`}
              className={`${styles.zenEntry}${index < EXPERIENCE.length - 1 ? ` ${styles.zenEntryBordered}` : ""}`}
            >
              <div className={styles.zenEntryHeader}>
                <p className={styles.zenCompany}>{job.company}</p>
                <span className={styles.zenPeriod}>{job.period}</span>
              </div>

              <h3 className={styles.zenRole}>{job.role}</h3>

              <div className={styles.zenBullets}>
                {job.bullets.map((bullet, i) => (
                  <p key={i} className={styles.zenBulletText}>{bullet}</p>
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
      <p className={styles.sectionLabel}>{dict.experience.label}</p>
      <h2 className={styles.sectionHeading}>{dict.experience.heading}</h2>
    </>
  );
}
