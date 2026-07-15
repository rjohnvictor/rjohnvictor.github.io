'use client';

import { SKILLS, WORK_SPAN_KEYS } from '@/data/portfolio/skills';
import type { Dictionary } from '@/types/dictionary';
import { useDesignSystem } from '@/design-system';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './Skills.module.css';

interface Props {
    dict: Dictionary;
}

export default function Skills({ dict }: Props) {
    const ds = useDesignSystem();
    if (ds.layout.skills === 'prose') return <SkillsProse dict={dict} />;
    return <SkillsCards dict={dict} kiCardClass={ds.card.className} />;
}

/* ─── Professional + Power layout ────────────────────────── */
function SkillsCards({ dict, kiCardClass }: Props & { kiCardClass: string }) {
    const sectionRef = useSectionEnergy('skills');

    return (
        <section
            id="skills"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <p className={styles.label}>{dict.skills.label}</p>
                <h2 className={styles.heading}>{dict.skills.heading}</h2>
                <p className={styles.subtitle}>{dict.skills.subtitle}</p>

                <div className={styles.scopeBlock}>
                    <p className={styles.scopeLabel}>{dict.skills.workSpans}</p>
                    <div className={styles.scopeTags}>
                        {WORK_SPAN_KEYS.map((itemKey) => (
                            <span key={itemKey} className={styles.scopeTag}>
                                {dict.skills.spanItems[itemKey]}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles.grid}>
                    {SKILLS.map((group) => (
                        <div
                            key={group.categoryKey}
                            className={`${styles.card}${kiCardClass ? ` ${kiCardClass}` : ''}`}
                        >
                            <div className={styles.topAccent} />

                            <p className={styles.categoryLabel}>
                                {dict.skills.categoryLabels[group.categoryKey]}
                            </p>

                            <div className={styles.tagList}>
                                {group.items.map((item) => (
                                    <span key={item} className={styles.tag}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function SkillsProse({ dict }: Props) {
    const sectionRef = useSectionEnergy('skills');

    return (
        <section
            id="skills"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.sectionProse}
        >
            <div className="section-container">
                <p className={styles.labelProse}>{dict.skills.label}</p>
                <h2 className={styles.headingProse}>{dict.skills.heading}</h2>
                <p className={styles.subtitleProse}>{dict.skills.subtitle}</p>

                <div className={styles.scopeBlockProse}>
                    <p className={styles.scopeLabelProse}>
                        {dict.skills.workSpans}
                    </p>
                    <p className={styles.scopeSentenceProse}>
                        {WORK_SPAN_KEYS.map(
                            (itemKey) => dict.skills.spanItems[itemKey],
                        ).join(' · ')}
                    </p>
                </div>

                <div className={styles.proseList}>
                    {SKILLS.map((group) => (
                        <div key={group.categoryKey}>
                            <h3 className={styles.proseGroupHeading}>
                                {dict.skills.categoryLabels[group.categoryKey]}
                            </h3>
                            <p className={styles.proseGroupItems}>
                                {group.items.join(' · ')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
