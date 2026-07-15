'use client';

import { PLATFORM_CONTRIBUTIONS } from '@/data/portfolio/contributions';
import type { Dictionary } from '@/types/dictionary';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './TechnicalContributions.module.css';

interface Props {
    dict: Dictionary;
}

export default function TechnicalContributions({ dict }: Props) {
    const sectionRef = useSectionEnergy('technical-contributions');

    return (
        <section
            id="technical-contributions"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <p className={styles.label}>
                    {dict.technicalContributions.label}
                </p>
                <h2 className={styles.heading}>
                    {dict.technicalContributions.heading}
                </h2>
                <p className={styles.subtitle}>
                    {dict.technicalContributions.subtitle}
                </p>

                <div className={styles.grid}>
                    {PLATFORM_CONTRIBUTIONS.map((group) => (
                        <article key={group.id} className={styles.groupCard}>
                            <h3 className={styles.groupTitle}>
                                {
                                    dict.technicalContributions.groups[group.id]
                                        .title
                                }
                            </h3>
                            <ul className={styles.list}>
                                {dict.technicalContributions.groups[
                                    group.id
                                ].items.map((item) => (
                                    <li key={item} className={styles.item}>
                                        <span className={styles.dot}>◆</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
