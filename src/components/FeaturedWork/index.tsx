'use client';

import { FEATURED_PROJECTS } from '@/data/portfolio/projects';
import type { Dictionary } from '@/types/dictionary';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './FeaturedWork.module.css';

interface Props {
    dict: Dictionary;
}

export default function FeaturedWork({ dict }: Props) {
    const sectionRef = useSectionEnergy('featured-work');

    return (
        <section
            id="featured-work"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <p className={styles.label}>{dict.featuredWork.label}</p>
                <h2 className={styles.heading}>{dict.featuredWork.heading}</h2>
                <p className={styles.subtitle}>{dict.featuredWork.subtitle}</p>

                <div className={styles.grid}>
                    {FEATURED_PROJECTS.map((item, index) =>
                        (() => {
                            const localized =
                                dict.featuredWork.projects[item.id];
                            return (
                                <article
                                    key={`${item.id}-${index}`}
                                    className={styles.card}
                                >
                                    <div className={styles.cardTop}>
                                        <span className={styles.index}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className={styles.meta}>
                                            {localized.category}
                                        </span>
                                    </div>
                                    <h3 className={styles.project}>
                                        {localized.title}
                                    </h3>
                                    {(item.status || item.duration) && (
                                        <div className={styles.badges}>
                                            {item.status ? (
                                                <span className={styles.status}>
                                                    {item.status}
                                                </span>
                                            ) : null}
                                            {item.duration ? (
                                                <span
                                                    className={styles.duration}
                                                >
                                                    {item.duration}
                                                </span>
                                            ) : null}
                                        </div>
                                    )}

                                    {Array.isArray(localized.impact) ? (
                                        <ul className={styles.impactList}>
                                            {localized.impact.map((point) => (
                                                <li
                                                    key={point}
                                                    className={
                                                        styles.impactItem
                                                    }
                                                >
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.why}>
                                            {localized.impact.join(' ')}
                                        </p>
                                    )}

                                    <p className={styles.listLabel}>
                                        {dict.featuredWork.technologiesLabel}
                                    </p>
                                    <div className={styles.techList}>
                                        {item.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className={styles.techTag}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {localized.responsibilities?.length ? (
                                        <div
                                            className={
                                                styles.responsibilitiesWrap
                                            }
                                        >
                                            <p className={styles.listLabel}>
                                                {
                                                    dict.featuredWork
                                                        .responsibilitiesLabel
                                                }
                                            </p>
                                            <p
                                                className={
                                                    styles.responsibilities
                                                }
                                            >
                                                {localized.responsibilities.join(
                                                    ' · ',
                                                )}
                                            </p>
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
