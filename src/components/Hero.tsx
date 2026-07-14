'use client';

import { useRef } from 'react';
import { PERSONAL } from '@/data/portfolio';
import type { Dictionary } from '@/types/dictionary';
import { useTheme } from '@/context/ThemeContext';
import { useSectionEnergy } from '@/hooks/useSectionEnergy';
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
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                ref={dotRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    transition: 'background 0.1s',
                }}
                onMouseMove={(e) => {
                    if (!dotRef.current) return;
                    const x = (e.clientX / window.innerWidth) * 100;
                    const y = (e.clientY / window.innerHeight) * 100;
                    dotRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(88,166,255,0.06), transparent 60%)`;
                }}
            />

            <div
                className="section-container"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div style={{ maxWidth: '720px' }}>
                    <p
                        style={{
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-geist-mono)',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {dict.hero.greeting}
                    </p>

                    <h1
                        style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                        }}
                    >
                        {PERSONAL.name}
                    </h1>

                    <h2
                        style={{
                            fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
                            fontWeight: 400,
                            color: 'var(--text-secondary)',
                            marginBottom: '2rem',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.3,
                        }}
                    >
                        {PERSONAL.title}
                    </h2>

                    <p
                        style={{
                            fontSize: '1.0625rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '560px',
                            marginBottom: '3rem',
                            lineHeight: 1.7,
                        }}
                    >
                        {PERSONAL.summary}
                    </p>

                    <div
                        className="hero-ctas"
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <a
                            href="#projects"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.75rem',
                                background: 'var(--accent)',
                                color: '#08090a',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                textDecoration: 'none',
                                transition: 'opacity 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                                e.currentTarget.style.transform =
                                    'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.transform =
                                    'translateY(0)';
                            }}
                        >
                            {dict.hero.viewProjects}
                        </a>
                        <a
                            href="#contact"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.75rem',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                textDecoration: 'none',
                                transition: 'border-color 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--text-muted)';
                                e.currentTarget.style.transform =
                                    'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--border)';
                                e.currentTarget.style.transform =
                                    'translateY(0)';
                            }}
                        >
                            {dict.hero.getInTouch}
                        </a>
                    </div>

                    <div
                        className="hero-stats"
                        style={{
                            marginTop: '4rem',
                            display: 'flex',
                            gap: '2rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            {
                                value: `${PERSONAL.yearsExperience}+`,
                                label: dict.hero.yearsExperience,
                            },
                            {
                                value: 'React · Node · AWS',
                                label: dict.hero.coreStack,
                            },
                            {
                                value: PERSONAL.location,
                                label: dict.hero.basedIn,
                            },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        lineHeight: 1,
                                        marginBottom: '0.25rem',
                                    }}
                                >
                                    {stat.value}
                                </p>
                                <p
                                    style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-muted)',
                                        fontFamily: 'var(--font-geist-mono)',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
            <style>{`@keyframes hero-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
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
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Radial vignette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,5,0.7) 100%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                className="section-container hero-content"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-geist-mono)',
                        fontSize: '0.8125rem',
                        marginBottom: '2rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                    }}
                >
                    {dict.hero.greeting}
                </p>

                <h1
                    style={{
                        fontSize: 'clamp(3rem, 9vw, 7rem)',
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: '-0.04em',
                        marginBottom: '1.5rem',
                        background:
                            'linear-gradient(135deg, #ffffff 0%, #fde68a 25%, #bf5fff 65%, #5b21b6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {PERSONAL.name}
                </h1>

                <h2
                    style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontWeight: 400,
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}
                >
                    {PERSONAL.title}
                </h2>

                <p
                    style={{
                        fontSize: '1.0625rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        marginBottom: '3.5rem',
                        lineHeight: 1.7,
                    }}
                >
                    {PERSONAL.summary}
                </p>

                <div
                    className="hero-ctas"
                    style={{
                        display: 'flex',
                        gap: '1.25rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <a
                        href="#projects"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 2.25rem',
                            background: 'var(--accent)',
                            color: '#000',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            textDecoration: 'none',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            boxShadow:
                                '0 0 24px rgba(191,95,255,0.45), 0 0 48px rgba(191,95,255,0.2)',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                '0 0 40px rgba(191,95,255,0.75), 0 0 80px rgba(191,95,255,0.3)';
                            e.currentTarget.style.transform =
                                'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                                '0 0 24px rgba(191,95,255,0.45), 0 0 48px rgba(191,95,255,0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {dict.hero.viewProjects}
                    </a>
                    <a
                        href="#contact"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 2.25rem',
                            background: 'transparent',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-dim)',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            textDecoration: 'none',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition:
                                'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.boxShadow =
                                '0 0 16px rgba(191,95,255,0.25)';
                            e.currentTarget.style.transform =
                                'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                                'var(--accent-dim)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {dict.hero.getInTouch}
                    </a>
                </div>

                {/* Energy stats */}
                <div
                    className="hero-stats"
                    style={{
                        marginTop: '5rem',
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {[
                        {
                            value: `${PERSONAL.yearsExperience}+`,
                            label: dict.hero.yearsExperience,
                        },
                        {
                            value: 'React · Node · AWS',
                            label: dict.hero.coreStack,
                        },
                        { value: PERSONAL.location, label: dict.hero.basedIn },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            style={{
                                textAlign: 'center',
                                position: 'relative',
                            }}
                        >
                            {i > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '-1.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--accent-dim)',
                                        opacity: 0.4,
                                    }}
                                >
                                    |
                                </span>
                            )}
                            <p
                                style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 800,
                                    color: 'var(--accent)',
                                    lineHeight: 1,
                                    marginBottom: '0.375rem',
                                    textShadow: '0 0 20px rgba(191,95,255,0.6)',
                                }}
                            >
                                {stat.value}
                            </p>
                            <p
                                style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'var(--font-geist-mono)',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
            <style>{`@keyframes hero-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
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
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                className="section-container"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div style={{ maxWidth: '520px' }}>
                    <p
                        style={{
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-geist-mono)',
                            fontSize: '0.8125rem',
                            marginBottom: '2.5rem',
                            letterSpacing: '0.12em',
                            opacity: 0.7,
                        }}
                    >
                        {dict.hero.greeting}
                    </p>

                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 600,
                            lineHeight: 1.1,
                            letterSpacing: '-0.01em',
                            marginBottom: '1.25rem',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        {PERSONAL.name}
                    </h1>

                    <h2
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: 400,
                            color: 'var(--text-secondary)',
                            marginBottom: '2.5rem',
                            letterSpacing: '0.02em',
                            lineHeight: 1.5,
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        {PERSONAL.title}
                    </h2>

                    <p
                        style={{
                            fontSize: '1.0625rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '1.5rem',
                            lineHeight: 1.9,
                        }}
                    >
                        {PERSONAL.summary}
                    </p>

                    <p
                        style={{
                            fontSize: '0.9375rem',
                            color: 'var(--accent)',
                            fontStyle: 'italic',
                            marginBottom: '3rem',
                            paddingLeft: '1rem',
                            borderLeft: '2px solid var(--accent-dim)',
                            lineHeight: 1.7,
                        }}
                    >
                        &ldquo;{PERSONAL.tagline}&rdquo;
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a
                            href="#projects"
                            style={{
                                color: 'var(--text-primary)',
                                fontSize: '0.9375rem',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--border)',
                                paddingBottom: '2px',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--accent)';
                                e.currentTarget.style.color = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--border)';
                                e.currentTarget.style.color =
                                    'var(--text-primary)';
                            }}
                        >
                            {dict.hero.viewProjects} →
                        </a>
                        <a
                            href="#contact"
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.9375rem',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--border)',
                                paddingBottom: '2px',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--text-muted)';
                                e.currentTarget.style.color =
                                    'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                    'var(--border)';
                                e.currentTarget.style.color =
                                    'var(--text-secondary)';
                            }}
                        >
                            {dict.hero.getInTouch} →
                        </a>
                    </div>
                </div>
            </div>

            <ScrollIndicator label={dict.hero.scroll} />
            <style>{`@keyframes hero-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
        </section>
    );
}

/* ─── Shared scroll indicator ─────────────────────────────── */
function ScrollIndicator({ label }: { label: string }) {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
            }}
        >
            <span
                style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}
            >
                {label}
            </span>
            <div
                style={{
                    width: '1px',
                    height: '40px',
                    background:
                        'linear-gradient(to bottom, var(--text-muted), transparent)',
                    animation: 'hero-pulse 2s ease-in-out infinite',
                }}
            />
        </div>
    );
}
