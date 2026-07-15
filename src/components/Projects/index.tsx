'use client';

import { PROJECTS } from '@/data/portfolio/projects';
import type { Dictionary } from '@/types/dictionary';
import { useDesignSystem } from '@/design-system';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './Projects.module.css';

interface Props {
    dict: Dictionary;
}

export default function Projects({ dict }: Props) {
    const ds = useDesignSystem();
    if (ds.layout.projects === 'list') return <ProjectsZen dict={dict} />;
    if (ds.layout.projects === 'featured+grid')
        return <ProjectsPower dict={dict} />;
    return <ProjectsProfessional dict={dict} />;
}

/* ─── Professional layout ─────────────────────────────────── */
function ProjectsProfessional({ dict }: Props) {
    const sectionRef = useSectionEnergy('featured-work');
    return (
        <section
            id="projects"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <SectionHeader dict={dict} />

                <div className={styles.proGrid}>
                    {PROJECTS.map((project, index) =>
                        (() => {
                            const localized = dict.projects.items[project.id];
                            return (
                                <div
                                    key={project.id}
                                    className={`ki-card ${styles.proCard}`}
                                >
                                    <div className={styles.proCardTop}>
                                        <span
                                            className={`${styles.proCardType}${index === 0 ? ` ${styles.proCardTypeFeatured}` : ''}`}
                                        >
                                            {localized.type}
                                        </span>
                                        <span className={styles.proCardIndex}>
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <h3 className={styles.proCardTitle}>
                                        {localized.title}
                                    </h3>
                                    <p className={styles.proCardDesc}>
                                        {localized.description}
                                    </p>
                                    <div>
                                        <p className={styles.highlightsLabel}>
                                            {dict.projects.highlights}
                                        </p>
                                        <ul className={styles.highlightsList}>
                                            {localized.highlights
                                                .slice(0, 3)
                                                .map((h) => (
                                                    <li
                                                        key={h}
                                                        className={
                                                            styles.highlightsItem
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.highlightsDot
                                                            }
                                                        >
                                                            ◆
                                                        </span>
                                                        {h}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div className={styles.proTechList}>
                                        {project.tech.map((t) => (
                                            <span
                                                key={t}
                                                className={styles.proTechTag}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })(),
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Power layout ────────────────────────────────────────── */
function ProjectsPower({ dict }: Props) {
    const [featured, ...rest] = PROJECTS;
    const featuredLocalized = dict.projects.items[featured.id];
    const sectionRef = useSectionEnergy('featured-work');

    return (
        <section
            id="projects"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <SectionHeader dict={dict} />

                {/* Featured project — full width */}
                <div className={`ki-card ${styles.featuredCard}`}>
                    {/* Top accent line — always rendered, visible via CSS */}
                    <div className={styles.featuredAccentLine} />

                    <div className={styles.featuredCardLeft}>
                        <div className={styles.featuredMeta}>
                            <span className={styles.featuredBadge}>
                                Featured
                            </span>
                            <span className={styles.featuredType}>
                                {featuredLocalized.type}
                            </span>
                        </div>
                        <h3 className={styles.featuredTitle}>
                            {featuredLocalized.title}
                        </h3>
                        <p className={styles.featuredDesc}>
                            {featuredLocalized.description}
                        </p>
                    </div>

                    <div className={styles.featuredCardRight}>
                        <div>
                            <p className={styles.featuredHighlightsLabel}>
                                {dict.projects.highlights}
                            </p>
                            <ul className={styles.featuredHighlightsList}>
                                {featuredLocalized.highlights.map((h) => (
                                    <li
                                        key={h}
                                        className={
                                            styles.featuredHighlightsItem
                                        }
                                    >
                                        <span
                                            className={
                                                styles.featuredHighlightsDot
                                            }
                                        >
                                            ◆
                                        </span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.featuredTechList}>
                            {featured.tech.map((t) => (
                                <span
                                    key={t}
                                    className={styles.featuredTechTag}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Remaining projects — smaller grid */}
                <div className={styles.powerGrid}>
                    {rest.map((project, index) =>
                        (() => {
                            const localized = dict.projects.items[project.id];
                            return (
                                <div
                                    key={project.id}
                                    className={`ki-card ${styles.powerCard}`}
                                >
                                    <div className={styles.powerCardTop}>
                                        <span className={styles.powerCardType}>
                                            {localized.type}
                                        </span>
                                        <span className={styles.powerCardIndex}>
                                            0{index + 2}
                                        </span>
                                    </div>
                                    <h3 className={styles.powerCardTitle}>
                                        {localized.title}
                                    </h3>
                                    <p className={styles.powerCardDesc}>
                                        {localized.description}
                                    </p>
                                    <div className={styles.powerTechList}>
                                        {project.tech.slice(0, 4).map((t) => (
                                            <span
                                                key={t}
                                                className={styles.powerTechTag}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })(),
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function ProjectsZen({ dict }: Props) {
    const sectionRef = useSectionEnergy('featured-work');
    return (
        <section
            id="projects"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.zenSection}
        >
            <div className="section-container">
                <p className={styles.zenHeaderLabel}>{dict.projects.label}</p>
                <h2 className={styles.zenHeaderHeading}>
                    {dict.projects.heading}
                </h2>
                <p className={styles.zenHeaderSubtitle}>
                    {dict.projects.subtitle}
                </p>

                <div className={styles.zenList}>
                    {PROJECTS.map((project, index) =>
                        (() => {
                            const localized = dict.projects.items[project.id];
                            return (
                                <div
                                    key={project.id}
                                    className={styles.zenItem}
                                >
                                    <span className={styles.zenItemNumber}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <p className={styles.zenItemType}>
                                            {localized.type}
                                        </p>
                                        <h3 className={styles.zenItemTitle}>
                                            {localized.title}
                                        </h3>
                                        <p className={styles.zenItemDesc}>
                                            {localized.description}
                                        </p>
                                        <p className={styles.zenItemTech}>
                                            {project.tech.join(' · ')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })(),
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Shared section header ───────────────────────────────── */
function SectionHeader({ dict }: Props) {
    return (
        <>
            <p className={styles.headerLabel}>{dict.projects.label}</p>
            <h2 className={styles.headerHeading}>{dict.projects.heading}</h2>
            <p className={styles.headerSubtitle}>{dict.projects.subtitle}</p>
        </>
    );
}
