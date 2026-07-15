'use client';

import { ACHIEVEMENT_IDS } from '@/data/portfolio/achievements';
import type { Dictionary } from '@/types/dictionary';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './Achievements.module.css';

interface Props {
    dict: Dictionary;
}

export default function Achievements({ dict }: Props) {
    const sectionRef = useSectionEnergy('achievements');

    return (
        <section
            id="achievements"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <p className={styles.label}>{dict.achievements.label}</p>
                <h2 className={styles.heading}>{dict.achievements.heading}</h2>
                <p className={styles.subtitle}>{dict.achievements.subtitle}</p>

                <div className={styles.grid}>
                    {ACHIEVEMENT_IDS.map((id) => (
                        <article key={id} className={styles.card}>
                            <span className={styles.badge}>Impact</span>
                            <p className={styles.text}>
                                {dict.achievements.items[id]}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
