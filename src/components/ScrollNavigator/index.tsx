'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ScrollNavigator.module.css';

const SECTION_FLOW = [
    'hero',
    'about',
    'skills',
    'experience',
    'achievements',
    'education',
    'featured-work',
    'technical-contributions',
    'philosophy',
    'contact',
] as const;

type SectionFlowId = (typeof SECTION_FLOW)[number];

const SECTION_LABELS: Record<SectionFlowId, string> = {
    'hero': 'Hero',
    'about': 'About',
    'skills': 'Skills',
    'experience': 'Experience',
    'achievements': 'Achievements',
    'education': 'Education',
    'featured-work': 'Featured Work',
    'technical-contributions': 'Contributions',
    'philosophy': 'Philosophy',
    'contact': 'Contact',
};

function ArrowIcon({ direction }: { direction: 'up' | 'down' }) {
    return (
        <svg className={styles.arrowSvg} viewBox="0 0 24 24" aria-hidden="true">
            <path
                className={styles.arrowPath}
                d={direction === 'up' ? 'M6 14l6-6 6 6' : 'M6 10l6 6 6-6'}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function scrollToSection(id: SectionFlowId) {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarOffset = 88;
    const top = Math.max(
        0,
        element.getBoundingClientRect().top + window.scrollY - navbarOffset,
    );

    window.scrollTo({
        top,
        behavior: 'smooth',
    });
}

export default function ScrollNavigator() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let ticking = false;

        const updateCurrentSection = () => {
            const focusLine = window.scrollY + window.innerHeight * 0.38;
            let nextIndex = 0;

            for (let i = 0; i < SECTION_FLOW.length; i += 1) {
                const id = SECTION_FLOW[i];
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.offsetTop <= focusLine) {
                    nextIndex = i;
                }
            }

            setCurrentIndex((prev) => (prev === nextIndex ? prev : nextIndex));
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateCurrentSection);
        };

        updateCurrentSection();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        const sectionTargets = SECTION_FLOW.map((id) => {
            const section = document.getElementById(id);
            if (!section) return null;
            const container = section.querySelector(
                '.section-container',
            ) as HTMLElement | null;
            return {
                section,
                target: container ?? section,
            };
        }).filter(
            (
                value,
            ): value is {
                section: HTMLElement;
                target: HTMLElement;
            } => value !== null,
        );

        const updateParallax = () => {
            const viewportCenter = window.innerHeight * 0.5;
            const isCompact = window.innerWidth <= 980;
            const maxShift = isCompact ? 12 : 24;
            const intensity = isCompact ? 0.02 : 0.04;

            sectionTargets.forEach(({ section, target }) => {
                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = sectionCenter - viewportCenter;
                const shift = Math.max(
                    -maxShift,
                    Math.min(maxShift, -distance * intensity),
                );

                target.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
                target.style.willChange = 'transform';
            });

            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateParallax);
        };

        updateParallax();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            sectionTargets.forEach(({ target }) => {
                target.style.transform = '';
                target.style.willChange = '';
            });
        };
    }, []);

    const prevSection = useMemo(
        () => (currentIndex > 0 ? SECTION_FLOW[currentIndex - 1] : null),
        [currentIndex],
    );
    const nextSection = useMemo(
        () =>
            currentIndex < SECTION_FLOW.length - 1
                ? SECTION_FLOW[currentIndex + 1]
                : null,
        [currentIndex],
    );

    if (!prevSection && !nextSection) return null;

    return (
        <aside className={styles.navigator} aria-label="Section navigator">
            {prevSection ? (
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => scrollToSection(prevSection)}
                    aria-label={`Scroll up to ${SECTION_LABELS[prevSection]}`}
                >
                    <ArrowIcon direction="up" />
                </button>
            ) : null}

            {nextSection ? (
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => scrollToSection(nextSection)}
                    aria-label={`Scroll down to ${SECTION_LABELS[nextSection]}`}
                >
                    <ArrowIcon direction="down" />
                </button>
            ) : null}
        </aside>
    );
}
