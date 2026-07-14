'use client';

import { useTheme } from '@/context/ThemeContext';

/**
 * Inline SVG lettermark logo — "RJV" monogram.
 * Adapts stroke/fill to the active theme accent color.
 */
export default function NavLogo() {
    const { theme } = useTheme();
    const isPower = theme === 'power';
    const isZen = theme === 'zen';

    return (
        <a
            href="#hero"
            aria-label="R John Victor — home"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
            }}
        >
            {/* <LogoMark isPower={isPower} isZen={isZen} /> */}
            <LogoType isPower={isPower} isZen={isZen} />
        </a>
    );
}

/* ─── Geometric SVG mark ─────────────────────────────────── */
function LogoMark({ isPower, isZen }: { isPower: boolean; isZen: boolean }) {
    // Theme-specific glow / accent treatment
    const glowFilter = isPower
        ? 'drop-shadow(0 0 6px var(--accent))'
        : isZen
          ? 'drop-shadow(0 0 4px var(--accent))'
          : 'none';

    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            style={{ filter: glowFilter, flexShrink: 0 }}
            aria-hidden="true"
        >
            {/* Outer hexagonal frame */}
            <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                stroke="var(--accent)"
                strokeWidth="1.5"
                fill="var(--accent)"
                fillOpacity={isPower ? 0.08 : isZen ? 0.06 : 0.05}
            />

            {/* "R" — vertical stem */}
            <line
                x1="10"
                y1="10"
                x2="10"
                y2="22"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            {/* "R" — top arch */}
            <path
                d="M10 10 Q18 10 18 14 Q18 18 10 18"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* "R" — diagonal leg */}
            <line
                x1="10"
                y1="18"
                x2="18.5"
                y2="22"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Small "V" chevron bottom-right — subtle, represents Victor */}
            <polyline
                points="20,13 23,20 26,13"
                stroke="var(--accent)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.55"
            />
        </svg>
    );
}

/* ─── Text wordmark ──────────────────────────────────────── */
function LogoType({ isPower, isZen }: { isPower: boolean; isZen: boolean }) {
    const fontFamily = isPower
        ? 'var(--font-exo2), sans-serif'
        : isZen
          ? 'var(--font-lora), serif'
          : 'var(--font-roboto), sans-serif';

    return (
        <span
            style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1.1,
                fontFamily,
            }}
        >
            <span
                style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                }}
            >
                R John Victor
            </span>
            <span
                style={{
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    opacity: 0.75,
                    fontFamily: 'var(--font-geist-mono), monospace',
                }}
            >
                Full Stack Engineer
            </span>
        </span>
    );
}
