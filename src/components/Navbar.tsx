'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/types/dictionary';
import NavLogo from '@/components/NavLogo';

interface Props {
    dict: Dictionary;
    locale: string;
}

export default function Navbar({ dict, locale }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const languageRef = useRef<HTMLDivElement>(null);

    const localeOptions = [{ id: 'es', label: 'ES' }] as const;

    const currentLocaleLabel = locale === 'es' ? 'ES' : 'EN';

    const NAV_LINKS = [
        { label: dict.nav.about, href: '#about' },
        { label: dict.nav.skills, href: '#skills' },
        { label: dict.nav.experience, href: '#experience' },
        { label: dict.nav.projects, href: '#projects' },
        { label: dict.nav.contact, href: '#contact' },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const linkStyle = {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500 as const,
        transition: 'color 0.2s',
    };

    return (
        <header
            className={scrolled ? 'navbar-scrolled' : ''}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition:
                    'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                background: scrolled ? 'rgba(8,12,16,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled
                    ? '1px solid var(--border)'
                    : '1px solid transparent',
            }}
        >
            <div
                className="section-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.5rem',
                }}
            >
                <NavLogo />

                {/* Desktop nav */}
                <nav
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                    className="hidden md:flex"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            style={linkStyle}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    'var(--text-primary)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    'var(--text-secondary)')
                            }
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* Language dropdown */}
                    <div ref={languageRef} style={{ position: 'relative' }}>
                        <button
                            type="button"
                            onClick={() => setLanguageOpen((open) => !open)}
                            style={{
                                ...linkStyle,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.35rem 0.7rem',
                                border: '1px solid var(--border)',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.02)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                            }}
                            aria-haspopup="menu"
                            aria-expanded={languageOpen}
                            aria-label="Switch language"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '16px', lineHeight: 1 }}
                            >
                                translate
                            </span>
                            <span>{currentLocaleLabel}</span>
                            <span
                                style={{ fontSize: '0.625rem', opacity: 0.75 }}
                            >
                                {languageOpen ? '▲' : '▼'}
                            </span>
                        </button>

                        {languageOpen && (
                            <div
                                role="menu"
                                aria-label="Language switcher"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    right: 0,
                                    minWidth: '8rem',
                                    padding: '0.35rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                    zIndex: 20,
                                }}
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
                                            style={{
                                                ...linkStyle,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.55rem 0.7rem',
                                                borderRadius: '8px',
                                                background: active
                                                    ? 'var(--bg-subtle)'
                                                    : 'transparent',
                                                color: active
                                                    ? 'var(--text-primary)'
                                                    : 'var(--text-secondary)',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            {active && (
                                                <span
                                                    style={{
                                                        color: 'var(--accent)',
                                                        fontSize: '0.7rem',
                                                    }}
                                                >
                                                    ✓
                                                </span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                    }}
                    aria-label="Toggle menu"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        {menuOpen ? (
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <nav
                    className="md:hidden"
                    style={{
                        background: 'var(--bg-card)',
                        borderTop: '1px solid var(--border)',
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={linkStyle}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div style={{ position: 'relative' }}>
                        <button
                            type="button"
                            onClick={() => setLanguageOpen((open) => !open)}
                            style={{
                                ...linkStyle,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.35rem 0.7rem',
                                border: '1px solid var(--border)',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.02)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                            }}
                            aria-haspopup="menu"
                            aria-expanded={languageOpen}
                            aria-label="Switch language"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '16px', lineHeight: 1 }}
                            >
                                translate
                            </span>
                            <span>{currentLocaleLabel}</span>
                            <span
                                style={{ fontSize: '0.625rem', opacity: 0.75 }}
                            >
                                {languageOpen ? '▲' : '▼'}
                            </span>
                        </button>

                        {languageOpen && (
                            <div
                                role="menu"
                                aria-label="Language switcher"
                                style={{
                                    marginTop: '0.5rem',
                                    minWidth: '8rem',
                                    padding: '0.35rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                }}
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
                                            style={{
                                                ...linkStyle,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.55rem 0.7rem',
                                                borderRadius: '8px',
                                                background: active
                                                    ? 'var(--bg-subtle)'
                                                    : 'transparent',
                                                color: active
                                                    ? 'var(--text-primary)'
                                                    : 'var(--text-secondary)',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            {active && (
                                                <span
                                                    style={{
                                                        color: 'var(--accent)',
                                                        fontSize: '0.7rem',
                                                    }}
                                                >
                                                    ✓
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
        </header>
    );
}
