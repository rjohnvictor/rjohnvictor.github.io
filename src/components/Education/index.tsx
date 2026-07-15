'use client';

import { EDUCATION } from '@/data/portfolio/education';
import type { Dictionary } from '@/types/dictionary';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './Education.module.css';

interface Props {
    dict: Dictionary;
}

export default function Education({ dict }: Props) {
    const sectionRef = useSectionEnergy('education');

    return (
        <section
            id="education"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <p className={styles.label}>{dict.education.label}</p>
                <h2 className={styles.heading}>{dict.education.heading}</h2>

                <div className={styles.cardList}>
                    {EDUCATION.map((edu) =>
                        (() => {
                            const localized = dict.education.items[edu.id];
                            return (
                                <article
                                    key={`${edu.institution}-${edu.id}`}
                                    className={styles.card}
                                >
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <h3 className={styles.institution}>
                                                {edu.institution}
                                            </h3>
                                            <p className={styles.degree}>
                                                {localized.degree}
                                            </p>
                                        </div>
                                        <span className={styles.period}>
                                            {edu.period}
                                        </span>
                                    </div>

                                    {localized.grade && (
                                        <p className={styles.grade}>
                                            Grade: {localized.grade}
                                        </p>
                                    )}

                                    {localized.notes?.length ? (
                                        <div className={styles.notesWrap}>
                                            {localized.notes.map((note) => (
                                                <span
                                                    key={note}
                                                    className={styles.noteTag}
                                                >
                                                    {note}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })(),
                    )}
                </div>
            </div>
        </section>
    );
}
