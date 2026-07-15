'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/types/dictionary';
import NavLogo from '@/components/NavLogo';
import styles from './Navbar.module.css';

interface Props {
    dict: Dictionary;
    locale: string;
}

export default function Navbar({ dict, locale }: Props) {
    const MOBILE_NAV_BREAKPOINT = 1024;
    const [scrolled, setScrolled] = useState(false);
    const [isCompactView, setIsCompactView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const languageRef = useRef<HTMLDivElement>(null);

    const localeOptions = [{ id: 'en', label: 'EN' }] as const;

    const currentLocaleLabel = 'EN';

    const NAV_LINKS = [
        { label: dict.nav.about, href: '#about' },
        { label: dict.nav.skills, href: '#skills' },
        { label: dict.nav.experience, href: '#experience' },
        { label: dict.nav.achievements, href: '#achievements' },
        { label: dict.nav.education, href: '#education' },
        { label: dict.nav.featuredWork, href: '#featured-work' },
        {
            label: dict.nav.technicalContributions,
            href: '#technical-contributions',
        },
        { label: dict.nav.contact, href: '#contact' },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => {
            const compact = window.innerWidth < MOBILE_NAV_BREAKPOINT;
            setIsCompactView(compact);
            if (!compact) {
                setMenuOpen(false);
            }
        };

        onResize();
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, [MOBILE_NAV_BREAKPOINT]);

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (
                languageRef.current &&
                !languageRef.current.contains(event.target as Node)
            ) {
                setLanguageOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <header
            className={`${styles.header} ${scrolled ? 'navbar-scrolled' : ''}`}
            data-scrolled={scrolled}
        >
            <div className={`section-container ${styles.inner}`}>
                <NavLogo />

                {/* Desktop nav */}
                {!isCompactView && (
                    <nav className={styles.desktopNav}>
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={styles.navLink}
                            >
                                {link.label}
                            </a>
                        ))}

                        {/* Language dropdown */}
                        <div ref={languageRef} className={styles.langWrapper}>
                            <button
                                type="button"
                                onClick={() => setLanguageOpen((open) => !open)}
                                className={styles.langButton}
                                aria-haspopup="menu"
                                aria-expanded={languageOpen}
                                aria-label="Switch language"
                            >
                                <span
                                    className={`material-symbols-outlined ${styles.langButtonIcon}`}
                                >
                                    translate
                                </span>
                                <span>{currentLocaleLabel}</span>
                                <span
                                    className={`material-symbols-outlined ${styles.langButtonChevron}`}
                                >
                                    {languageOpen
                                        ? 'expand_less'
                                        : 'expand_more'}
                                </span>
                            </button>

                            {languageOpen && (
                                <div
                                    role="menu"
                                    aria-label="Language switcher"
                                    className={styles.langDropdown}
                                >
                                    {localeOptions.map((option) => {
                                        const active = option.id === locale;
                                        return (
                                            <a
                                                key={option.id}
                                                role="menuitem"
                                                href={`/${option.id}`}
                                                onClick={() =>
                                                    setLanguageOpen(false)
                                                }
                                                className={styles.langOption}
                                                data-active={active}
                                            >
                                                <span>{option.label}</span>
                                                {active && (
                                                    <span
                                                        className={`material-symbols-outlined ${styles.langOptionCheck}`}
                                                    >
                                                        check
                                                    </span>
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </nav>
                )}

                {/* Mobile toggle */}
                {isCompactView && (
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={styles.mobileToggle}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`material-symbols-outlined ${styles.mobileToggleIcon}`}
                        >
                            {menuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                )}
            </div>

            {menuOpen && isCompactView && (
                <nav className={styles.mobileNav}>
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={styles.mobileNavLink}
                        >
                            <span
                                className={`material-symbols-outlined ${styles.mobileNavIcon}`}
                            >
                                {link.href === '#about'
                                    ? 'person'
                                    : link.href === '#skills'
                                      ? 'code'
                                      : link.href === '#experience'
                                        ? 'work'
                                        : link.href === '#achievements'
                                          ? 'workspace_premium'
                                          : link.href === '#education'
                                            ? 'school'
                                            : link.href === '#featured-work'
                                              ? 'star'
                                              : link.href ===
                                                  '#technical-contributions'
                                                ? 'build'
                                                : 'mail'}
                            </span>
                            {link.label}
                        </a>
                    ))}

                    {/* Language row */}
                    <div className={styles.mobileLangRow}>
                        <div ref={languageRef} className={styles.langWrapper}>
                            <button
                                type="button"
                                onClick={() => setLanguageOpen((open) => !open)}
                                className={styles.mobileLangButton}
                                aria-haspopup="menu"
                                aria-expanded={languageOpen}
                                aria-label="Switch language"
                            >
                                <span
                                    className={`material-symbols-outlined ${styles.mobileLangIcon}`}
                                >
                                    translate
                                </span>
                                <span className={styles.mobileLangLabel}>
                                    {currentLocaleLabel}
                                </span>
                                <span
                                    className={`material-symbols-outlined ${styles.mobileLangChevron}`}
                                >
                                    {languageOpen
                                        ? 'expand_less'
                                        : 'expand_more'}
                                </span>
                            </button>

                            {languageOpen && (
                                <div
                                    role="menu"
                                    aria-label="Language switcher"
                                    className={styles.mobileLangDropdown}
                                >
                                    {localeOptions.map((option) => {
                                        const active = option.id === locale;
                                        return (
                                            <a
                                                key={option.id}
                                                role="menuitem"
                                                href={`/${option.id}`}
                                                onClick={() =>
                                                    setLanguageOpen(false)
                                                }
                                                className={
                                                    styles.mobileLangOption
                                                }
                                                data-active={active}
                                            >
                                                <span>{option.label}</span>
                                                {active && (
                                                    <span
                                                        className={`material-symbols-outlined ${styles.mobileLangOptionCheck}`}
                                                    >
                                                        check
                                                    </span>
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
