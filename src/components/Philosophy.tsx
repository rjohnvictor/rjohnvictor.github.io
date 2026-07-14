'use client';

import { PHILOSOPHY } from '@/data/portfolio';
import type { Dictionary } from '@/types/dictionary';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

const SkyWeatherBg = dynamic(() => import('./SkyWeatherBg'), { ssr: false });

const ICONS = ['⬡', '◈', '⬖', '◇', '⬟', '◉'];

interface Props {
    dict: Dictionary;
}

export default function Philosophy({ dict }: Props) {
    const { theme } = useTheme();
    const isZen = theme === 'zen';

    return (
        <section
            id="philosophy"
            style={{
                padding: '8rem 0',
                borderTop: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Sky weather ambient background */}
            {!isZen && <SkyWeatherBg widgetPlacement="title-right" />}

            {/* Gradient overlay so text stays readable */}
            {!isZen && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.60) 100%)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            <div
                className="section-container"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div style={{ marginBottom: '4rem' }}>
                    <p
                        style={{
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-geist-mono)',
                            fontSize: '0.8125rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}
                    >
                        {dict.philosophy.label}
                    </p>
                    <h2
                        style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            marginBottom: '0.75rem',
                            color: 'var(--text-primary)',
                        }}
                    >
                        {dict.philosophy.heading}
                    </h2>
                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1rem',
                            maxWidth: '560px',
                        }}
                    >
                        {dict.philosophy.subtitle}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {PHILOSOPHY.map((item, i) => (
                        <div
                            key={item.title}
                            className="ki-card"
                            style={{
                                padding: '1.75rem',
                                background: isZen
                                    ? 'var(--bg-card)'
                                    : 'rgba(0,0,0,0.35)',
                                backdropFilter: isZen ? 'none' : 'blur(12px)',
                                border: isZen
                                    ? '1px solid var(--border)'
                                    : '1px solid rgba(255,255,255,0.10)',
                                borderRadius: '10px',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = isZen
                                    ? 'var(--text-muted)'
                                    : 'rgba(255,255,255,0.25)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = isZen
                                    ? 'var(--border)'
                                    : 'rgba(255,255,255,0.10)')
                            }
                        >
                            <div
                                style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--accent)',
                                    marginBottom: '1rem',
                                    lineHeight: 1,
                                }}
                            >
                                {ICONS[i % ICONS.length]}
                            </div>
                            <h3
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.625rem',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.65,
                                }}
                            >
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
