'use client';

import { useEffect, useMemo, useState } from 'react';
import { PERSONAL } from '@/data/portfolio/personal';
import { QUICK_FACT_KEYS } from '@/data/portfolio/quickFacts';
import type { Dictionary } from '@/types/dictionary';
import { useDesignSystem } from '@/design-system';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
import { SocialTextLink } from '@/components/SocialLink';
import styles from './About.module.css';

interface Props {
    dict: Dictionary;
}

function interp(str: string, vars: Record<string, string>) {
    return Object.entries(vars).reduce(
        (s, [k, v]) => s.replace(`{${k}}`, v),
        str,
    );
}

function extractGithubUser(url: string): string {
    try {
        const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
        return pathname.split('/')[0] || 'rjohnvictor';
    } catch {
        return 'rjohnvictor';
    }
}

function useGithubContributionHp(fallbackHp: number): number {
    const [hp, setHp] = useState(fallbackHp);
    const githubUser = useMemo(() => extractGithubUser(PERSONAL.github), []);
    const year = useMemo(() => new Date().getFullYear(), []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchHp = async () => {
            try {
                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${githubUser}`,
                    { signal: controller.signal },
                );
                if (!response.ok) return;

                const data = (await response.json()) as {
                    total?: Record<string, number>;
                };

                const yearlyContributions = data.total?.[String(year)];
                if (
                    typeof yearlyContributions === 'number' &&
                    yearlyContributions > 0
                ) {
                    setHp(yearlyContributions);
                }
            } catch {
                // Keep fallback HP when contribution lookup is unavailable.
            }
        };

        void fetchHp();

        return () => {
            controller.abort();
        };
    }, [githubUser, year]);

    return hp;
}

export default function About({ dict }: Props) {
    const ds = useDesignSystem();
    if (ds.layout.about === 'prose') return <AboutProse dict={dict} />;
    return <AboutColumns dict={dict} />;
}

function ProfileCard({ dict }: { dict: Dictionary }) {
    const fallbackHp = Math.max(99, PERSONAL.yearsExperience * 13);
    const hp = useGithubContributionHp(fallbackHp);
    const cardData = PERSONAL.profileCard;
    const [isFlipped, setIsFlipped] = useState(false);
    const locationMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        PERSONAL.locationMapQuery ?? PERSONAL.location,
    )}`;

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('a')) return;
        setIsFlipped((prev) => !prev);
    };

    const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsFlipped((prev) => !prev);
        }
    };

    return (
        <div
            className={styles.profileCard}
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={dict.about.profileCard.values[cardData.flipHintKey]}
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
        >
            <div
                className={`${styles.profileCardFlipper}${isFlipped ? ` ${styles.isFlipped}` : ''}`}
            >
                <div
                    className={`${styles.profileFace} ${styles.profileFaceFront}`}
                >
                    <div className={styles.profileCardTop}>
                        <p className={styles.profileName}>{PERSONAL.name}</p>
                        <p className={styles.profileHp}>HP {hp}</p>
                    </div>

                    <div className={styles.profileFrame}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={PERSONAL.profileImage}
                            alt={`${PERSONAL.name} profile`}
                            className={styles.profileImage}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className={styles.profileCardBottom}>
                        <p className={styles.profileTitle}>
                            {
                                dict.about.profileCard.values[
                                    cardData.frontTitleKey
                                ]
                            }
                        </p>
                        <a
                            href={locationMapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.profileLocationMap}
                            aria-label={`Open ${PERSONAL.location} on map`}
                        >
                            <span className={styles.profileMapIcon}>
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 22c3.6-4.2 7-7.9 7-12a7 7 0 10-14 0c0 4.1 3.4 7.8 7 12z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="2.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </span>
                            <span>{PERSONAL.location}</span>
                        </a>
                    </div>
                </div>

                <div
                    className={`${styles.profileFace} ${styles.profileFaceBack}`}
                >
                    <p className={styles.profileBackHeading}>
                        {dict.about.profileCard.values[cardData.backHeadingKey]}
                    </p>
                    <div className={styles.profileBackRows}>
                        <div className={styles.profileBackRow}>
                            <span className={styles.profileBackLabel}>
                                {dict.about.profileCard.labels.experience}
                            </span>
                            <span className={styles.profileBackValue}>
                                {PERSONAL.yearsExperience}
                                {dict.about.profileCard.yearsSuffix}
                            </span>
                        </div>
                        <div className={styles.profileBackRow}>
                            <span className={styles.profileBackLabel}>
                                {dict.about.profileCard.labels.role}
                            </span>
                            <span className={styles.profileBackValue}>
                                {
                                    dict.about.profileCard.values[
                                        cardData.roleKey
                                    ]
                                }
                            </span>
                        </div>
                        <div className={styles.profileBackRow}>
                            <span className={styles.profileBackLabel}>
                                {dict.about.profileCard.labels.hobbies}
                            </span>
                            <span
                                className={`${styles.profileBackValue} ${styles.profileBackValueList}`}
                            >
                                {cardData.hobbyKeys
                                    .map(
                                        (hobbyKey) =>
                                            dict.about.profileCard.values[
                                                hobbyKey
                                            ],
                                    )
                                    .join(', ')}
                            </span>
                        </div>
                    </div>

                    <p className={styles.profileBackHint}>
                        {dict.about.profileCard.values[cardData.flipHintKey]}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Professional + Power layout ────────────────────────── */
function AboutColumns({ dict }: Props) {
    const d = dict.about;
    const sectionRef = useSectionEnergy('about');
    const githubUser = extractGithubUser(PERSONAL.github);

    const facts = QUICK_FACT_KEYS.map((key) => d.quickFactItems[key]);

    return (
        <section
            id="about"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.section}
        >
            <div className="section-container">
                <div className={styles.twoColumnGrid}>
                    {/* ── Left: prose ── */}
                    <div>
                        <p className={styles.sectionLabel}>{d.label}</p>
                        <h2 className={styles.heading}>{d.heading}</h2>

                        <div className={styles.bodyText}>
                            <p>
                                {interp(d.p1, {
                                    name: PERSONAL.name,
                                    location: PERSONAL.location,
                                    years: String(PERSONAL.yearsExperience),
                                })}
                            </p>
                            <p>{d.p2}</p>
                            <p>{d.p3}</p>
                            <p className={styles.tagline}>
                                &ldquo;{dict.hero.tagline}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* ── Right: quick facts card ── */}
                    <div className={styles.card}>
                        <div className={styles.topAccent} />

                        <div className={styles.profileWrap}>
                            <ProfileCard dict={dict} />
                        </div>

                        <p className={styles.quickFactsLabel}>{d.quickFacts}</p>

                        {facts.map((item) => (
                            <div key={item.label} className={styles.factRow}>
                                <span className={styles.factLabel}>
                                    {item.label}
                                </span>
                                <span className={styles.factValue}>
                                    {item.value}
                                </span>
                            </div>
                        ))}

                        <div className={styles.socialProof}>
                            <div className={styles.socialProofBlock}>
                                <p className={styles.socialProofLabel}>
                                    {d.githubContributions}
                                </p>
                                <a
                                    href={PERSONAL.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.contributionLink}
                                    aria-label={`${githubUser} contributions on GitHub`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://ghchart.rshah.org/58a6ff/${githubUser}`}
                                        alt={`${githubUser} GitHub contribution graph`}
                                        className={styles.contributionImg}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Zen layout ──────────────────────────────────────────── */
function AboutProse({ dict }: Props) {
    const d = dict.about;
    const sectionRef = useSectionEnergy('about');

    return (
        <section
            id="about"
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={styles.sectionProse}
        >
            <div className="section-container">
                <div className={styles.profileWrapProse}>
                    <ProfileCard dict={dict} />
                </div>

                <p className={styles.sectionLabelProse}>{d.label}</p>
                <h2 className={styles.headingProse}>{d.heading}</h2>

                <div className={styles.bodyTextProse}>
                    <p>
                        {interp(d.p1, {
                            name: PERSONAL.name,
                            location: PERSONAL.location,
                            years: String(PERSONAL.yearsExperience),
                        })}
                    </p>
                    <p>{d.p2}</p>
                    <p>{d.p3}</p>
                </div>

                <blockquote className={styles.blockquote}>
                    &ldquo;{dict.hero.tagline}&rdquo;
                </blockquote>

                <div className={styles.socialLinksProse}>
                    <SocialTextLink
                        href={PERSONAL.github}
                        label={d.github}
                        platform="github"
                    />
                    <SocialTextLink
                        href={PERSONAL.linkedin}
                        label={d.linkedin}
                        platform="linkedin"
                    />
                </div>
            </div>
        </section>
    );
}
