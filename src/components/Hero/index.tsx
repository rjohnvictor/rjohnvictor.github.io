'use client';

import { useRef } from 'react';
import { PERSONAL } from '@/data/portfolio/personal';
import { STATS } from '@/data/portfolio/impact';
import type { Dictionary } from '@/types/dictionary';
import { useTheme } from '@/context/ThemeContext';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import styles from './Hero.module.css';

interface Props {
    dict: Dictionary;
}

export default function Hero({ dict }: Props) {
    const dotRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    if (theme === 'zen') return <HeroZen dict={dict} />;
    if (theme === 'power') return <HeroPower dict={dict} />;
    return <HeroProfessional dict={dict} dotRef={dotRef} />;
}

/* ─── Professional layout ─────────────────────────────────── */
function HeroProfessional({
    dict,
    dotRef,
}: Props & { dotRef: React.RefObject<HTMLDivElement | null> }) {
    const sectionRef = useSectionEnergy('hero');
    return (
        <section
            id="hero"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.professionalSection}
        >
            <div
                ref={dotRef}
                className={styles.professionalGlowOverlay}
                onMouseMove={(e) => {
                    if (!dotRef.current) return;
                    const x = (e.clientX / window.innerWidth) * 100;
                    const y = (e.clientY / window.innerHeight) * 100;
                    dotRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(88,166,255,0.06), transparent 60%)`;
                }}
            />

            <div className={`section-container ${styles.professionalContent}`}>
                <div className={styles.professionalInner}>
                    <p className={styles.professionalGreeting}>
                        {dict.hero.greeting}
                    </p>

                    <h1 className={styles.professionalName}>{PERSONAL.name}</h1>

                    <h2 className={styles.professionalTitle}>
                        {dict.hero.profileTitle}
                    </h2>

                    <p className={styles.professionalSummary}>
                        {dict.hero.summary}
                    </p>

                    <div className={`hero-ctas ${styles.professionalCtas}`}>
                        <a
                            href="#featured-work"
                            className={styles.professionalCtaPrimary}
                        >
                            {dict.hero.viewProjects}
                        </a>
                        <a
                            href="#contact"
                            className={styles.professionalCtaSecondary}
                        >
                            {dict.hero.getInTouch}
                        </a>
                    </div>

                    <div className={`hero-stats ${styles.professionalStats}`}>
                        {STATS.map((stat) => (
                            <div key={stat.labelKey}>
                                <p className={styles.professionalStatValue}>
                                    {stat.value}
                                </p>
                                <p className={styles.professionalStatLabel}>
                                    {dict.hero.stats[stat.labelKey]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
        </section>
    );
}

/* ─── Power layout ────────────────────────────────────────── */
function HeroPower({ dict }: Props) {
    const sectionRef = useSectionEnergy('hero');
    return (
        <section
            id="hero"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.powerSection}
        >
            {/* Radial vignette */}
            <div className={styles.powerVignette} />

            <div
                className={`section-container hero-content ${styles.powerContent}`}
            >
                <p className={styles.powerGreeting}>{dict.hero.greeting}</p>

                <h1 className={styles.powerName}>{PERSONAL.name}</h1>

                <h2 className={styles.powerTitle}>{dict.hero.profileTitle}</h2>

                <p className={styles.powerSummary}>{dict.hero.summary}</p>

                <div className={`hero-ctas ${styles.powerCtas}`}>
                    <a href="#featured-work" className={styles.powerCtaPrimary}>
                        {dict.hero.viewProjects}
                    </a>
                    <a href="#contact" className={styles.powerCtaSecondary}>
                        {dict.hero.getInTouch}
                    </a>
                </div>

                {/* Energy stats */}
                <div className={`hero-stats ${styles.powerStats}`}>
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.labelKey}
                            className={styles.powerStatItem}
                        >
                            {i > 0 && (
                                <span className={styles.powerStatDivider}>
                                    |
                                </span>
                            )}
                            <p className={styles.powerStatValue}>
                                {stat.value}
                            </p>
                            <p className={styles.powerStatLabel}>
                                {dict.hero.stats[stat.labelKey]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
        </section>
    );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function HeroZen({ dict }: Props) {
    const sectionRef = useSectionEnergy('hero');
    return (
        <section
            id="hero"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.zenSection}
        >
            <div className={`section-container ${styles.zenContent}`}>
                <div className={styles.zenInner}>
                    <p className={styles.zenGreeting}>{dict.hero.greeting}</p>

                    <h1 className={styles.zenName}>{PERSONAL.name}</h1>

                    <h2 className={styles.zenTitle}>
                        {dict.hero.profileTitle}
                    </h2>

                    <p className={styles.zenSummary}>{dict.hero.summary}</p>

                    <p className={styles.zenTagline}>
                        &ldquo;{dict.hero.tagline}&rdquo;
                    </p>

                    <div className={styles.zenLinks}>
                        <a
                            href="#featured-work"
                            className={styles.zenLinkPrimary}
                        >
                            {dict.hero.viewProjects} →
                        </a>
                        <a href="#contact" className={styles.zenLinkSecondary}>
                            {dict.hero.getInTouch} →
                        </a>
                    </div>
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
        </section>
    );
}

/* ─── Shared scroll indicator ─────────────────────────────── */
function ScrollIndicator({ label }: { label: string }) {
    return (
        <div className={styles.scrollIndicator}>
            <span className={styles.scrollIndicatorLabel}>{label}</span>
            <div className={styles.scrollIndicatorLine} />
        </div>
    );
}
