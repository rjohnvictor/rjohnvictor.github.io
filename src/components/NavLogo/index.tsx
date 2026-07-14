'use client';

import styles from './NavLogo.module.css';

/**
 * Inline SVG lettermark logo — "RJV" monogram.
 * Adapts stroke/fill to the active theme accent color.
 */
export default function NavLogo() {
    return (
        <a
            href="#hero"
            aria-label="R John Victor — home"
            className={styles.link}
        >
            {/* <LogoMark /> */}
            <LogoType />
        </a>
    );
}

/* ─── Geometric SVG mark ─────────────────────────────────── */
function LogoMark() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className={styles.mark}
            aria-hidden="true"
        >
            {/* Outer hexagonal frame */}
            <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                stroke="var(--accent)"
                strokeWidth="1.5"
                fill="var(--accent)"
                fillOpacity={0.05}
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
function LogoType() {
    return (
        <span className={styles.logoType}>
            <span className={styles.name}>R John Victor</span>
            <span className={styles.subtitle}>Full Stack Engineer</span>
        </span>
    );
}
