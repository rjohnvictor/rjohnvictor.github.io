'use client';

import type { Dictionary } from '@/types/dictionary';
import { useTheme } from '@/context/ThemeContext';
import styles from './Manifesto.module.css';

interface Props {
    dict: Dictionary;
}

const PILLARS = (d: Dictionary['manifesto']) => [
    { key: 'resilience', title: d.resilience, body: d.resilienceBody },
    { key: 'journey', title: d.journey, body: d.journeyBody },
    { key: 'vision', title: d.vision, body: d.visionBody },
];

export default function Manifesto({ dict }: Props) {
    const { theme } = useTheme();
    const d = dict.manifesto;

    if (theme === 'power') return <ManifestoPower d={d} />;
    if (theme === 'zen') return <ManifestoZen d={d} />;
    return <ManifestoProfessional d={d} />;
}

/* ─── Professional: clean three-column ───────────────────── */
function ManifestoProfessional({ d }: { d: Dictionary['manifesto'] }) {
    const pillars = PILLARS(d);

    return (
        <section id="manifesto" className={styles.section}>
            <div className="section-container">
                <p className={styles.label}>{d.label}</p>
                <h2 className={styles.heading}>{d.heading}</h2>

                <div className={styles.grid}>
                    {pillars.map((p, i) => (
                        <div key={p.key}>
                            <span className={styles.index}>0{i + 1}</span>
                            <h3 className={styles.pillarTitle}>{p.title}</h3>
                            <p className={styles.pillarBody}>{p.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Power: dramatic full-bleed, glowing words ──────────── */
function ManifestoPower({ d }: { d: Dictionary['manifesto'] }) {
    const pillars = PILLARS(d);

    return (
        <section id="manifesto" className={styles.sectionPower}>
            {/* Background corona */}
            <div className={styles.corona} />

            <div className={`section-container ${styles.containerRelative}`}>
                <p className={styles.labelPower}>{d.label}</p>

                {/* Giant manifesto headline */}
                <h2 className={styles.gradientHeading}>{d.heading}</h2>

                {/* Pillar cards */}
                <div className={styles.powerGrid}>
                    {pillars.map((p, i) => (
                        <div
                            key={p.key}
                            className={`ki-card ${styles.pillarCard}`}
                        >
                            {/* Top accent line */}
                            <div className={styles.accentLine} />

                            <span className={styles.powerIndex}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className={styles.gradientTitle}>{p.title}</h3>
                            <p className={styles.pillarBody}>{p.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Zen: centered, large serif, meditative ─────────────── */
function ManifestoZen({ d }: { d: Dictionary['manifesto'] }) {
    const pillars = PILLARS(d);

    return (
        <section id="manifesto" className={styles.sectionZen}>
            <div className="section-container">
                <div className={styles.zenInner}>
                    <p className={styles.labelZen}>{d.label}</p>
                    <h2 className={styles.headingZen}>{d.heading}</h2>

                    <div className={styles.zenPillars}>
                        {pillars.map((p) => (
                            <div key={p.key} className={styles.zenPillar}>
                                <h3 className={styles.zenPillarTitle}>
                                    {p.title}
                                </h3>
                                <p className={styles.zenPillarBody}>{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
