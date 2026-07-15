'use client';

import { SKILLS } from '@/data/portfolio/skills';
import type { Dictionary } from '@/types/dictionary';
import styles from './TechStack.module.css';

const CATEGORY_COLORS: Record<string, string> = {
    frontend: '#58a6ff',
    backend: '#3fb950',
    cloudDevops: '#d2a8ff',
    databases: '#79c0ff',
    stateApis: '#ffa657',
    interests: '#8b949e',
};

interface Props {
    dict: Dictionary;
}

export default function TechStack({ dict }: Props) {
    return (
        <section id="techstack" className={styles.section}>
            <div className="section-container">
                <p className={styles.label}>{dict.techStack.label}</p>
                <h2 className={styles.heading}>{dict.techStack.heading}</h2>

                <div className={styles.grid}>
                    {SKILLS.map(({ categoryKey, items: techs }) => {
                        const color =
                            CATEGORY_COLORS[categoryKey] ?? 'var(--accent)';
                        return (
                            <div key={categoryKey} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div
                                        className={styles.dot}
                                        style={{ background: color }}
                                    />
                                    <span
                                        className={styles.categoryName}
                                        style={{ color }}
                                    >
                                        {
                                            dict.techStack.categoryLabels[
                                                categoryKey
                                            ]
                                        }
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
