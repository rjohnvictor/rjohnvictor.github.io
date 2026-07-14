"use client";

import { TECH_STACK } from "@/data/portfolio";
import type { Dictionary } from "@/types/dictionary";
import styles from "./TechStack.module.css";

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
    <section id="techstack" className={styles.section}>
      <div className="section-container">
        <p className={styles.label}>
          {dict.techStack.label}
        </p>
        <h2 className={styles.heading}>
          {dict.techStack.heading}
        </h2>

        <div className={styles.grid}>
          {Object.entries(TECH_STACK).map(([category, techs]) => {
            const color = CATEGORY_COLORS[category] ?? "var(--accent)";
            return (
              <div key={category} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.dot} style={{ background: color }} />
                  <span className={styles.categoryName} style={{ color }}>
                    {category}
                  </span>
                </div>
                <div className={styles.tagList}>
                  {techs.map((tech) => (
                    <span key={tech} className={styles.tag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
