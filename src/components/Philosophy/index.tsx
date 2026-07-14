'use client';

import { PHILOSOPHY } from '@/data/portfolio';
import type { Dictionary } from '@/types/dictionary';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import styles from './Philosophy.module.css';

const SkyWeatherBg = dynamic(() => import('../SkyWeatherBg'), { ssr: false });

const ICONS = ['⬡', '◈', '⬖', '◇', '⬟', '◉'];

interface Props {
    dict: Dictionary;
}

export default function Philosophy({ dict }: Props) {
    const { theme } = useTheme();
    const isZen = theme === 'zen';

    return (
        <section id="philosophy" className={styles.section}>
            {/* Sky weather ambient background */}
            {!isZen && <SkyWeatherBg widgetPlacement="title-right" />}

            {/* Gradient overlay so text stays readable */}
            {!isZen && <div className={styles.gradientOverlay} />}

            <div className={`section-container ${styles.container}`}>
                <div className={styles.header}>
                    <p className={styles.label}>{dict.philosophy.label}</p>
                    <h2 className={styles.heading}>{dict.philosophy.heading}</h2>
                    <p className={styles.subtitle}>{dict.philosophy.subtitle}</p>
                </div>

                <div className={styles.grid}>
                    {PHILOSOPHY.map((item, i) => (
                        <div key={item.title} className={`ki-card ${styles.card}`}>
                            <div className={styles.icon}>
                                {ICONS[i % ICONS.length]}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardBody}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
