'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
    Autocomplete,
    Box,
    Modal,
    TextField,
    createFilterOptions,
} from '@mui/material';
import type { Dictionary } from '@/types/dictionary';
import NavLogo from '@/components/NavLogo';
import styles from './Navbar.module.css';

interface Props {
    dict: Dictionary;
    locale: string;
}

type CommandOption = {
    id: string;
    label: string;
    href: string;
    icon: string;
    category: string;
    keywords: string[];
};

const OPTION_FILTER = createFilterOptions<CommandOption>({
    stringify: (option) =>
        `${option.label} ${option.href} ${option.keywords.join(' ')}`,
});

export default function Navbar({ dict, locale }: Props) {
    const MOBILE_NAV_BREAKPOINT = 1024;
    const [scrolled, setScrolled] = useState(false);
    const [isCompactView, setIsCompactView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightedOption, setHighlightedOption] =
        useState<CommandOption | null>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    const localeOptions = [
        { id: 'en', label: 'EN' },
        { id: 'hi', label: 'HI' },
        { id: 'ta', label: 'TA' },
    ] as const;

    const currentLocaleLabel =
        localeOptions.find((option) => option.id === locale)?.label ?? 'EN';

    const NAV_LINKS = useMemo(
        () => [
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
        ],
        [dict.nav],
    );

    const getSectionIcon = (href: string): string => {
        if (href === '#hero') return 'home';
        if (href === '#about') return 'person';
        if (href === '#skills') return 'code';
        if (href === '#experience') return 'work';
        if (href === '#achievements') return 'workspace_premium';
        if (href === '#education') return 'school';
        if (href === '#featured-work') return 'star';
        if (href === '#technical-contributions') return 'build';
        if (href === '#manifesto') return 'flag';
        if (href === '#philosophy') return 'psychology';
        return 'mail';
    };

    const navigationCommandOptions: CommandOption[] = useMemo(
        () => [
            {
                id: 'nav-hero',
                label: dict.commandPalette.sections.hero,
                href: '#hero',
                icon: 'home',
                category: 'Navigation',
                keywords: ['home', 'intro', 'top'],
            },
            ...NAV_LINKS.map((link) => ({
                id: `nav-${link.href.replace('#', '')}`,
                label: link.label,
                href: link.href,
                icon: getSectionIcon(link.href),
                category: 'Navigation',
                keywords: [link.href.replace('#', ''), 'section'],
            })),
            {
                id: 'nav-manifesto',
                label: dict.commandPalette.sections.manifesto,
                href: '#manifesto',
                icon: 'flag',
                category: 'Navigation',
                keywords: ['manifesto', 'vision', 'journey', 'resilience'],
            },
            {
                id: 'nav-philosophy',
                label: dict.commandPalette.sections.philosophy,
                href: '#philosophy',
                icon: 'psychology',
                category: 'Navigation',
                keywords: ['philosophy', 'principles', 'thinking'],
            },
        ],
        [NAV_LINKS, dict],
    );

    const filteredNavigationOptions = useMemo(
        () =>
            OPTION_FILTER(navigationCommandOptions, {
                inputValue: query,
                getOptionLabel: (option) => option.label,
            }),
        [navigationCommandOptions, query],
    );

    const activeHighlightedOption = useMemo(() => {
        if (filteredNavigationOptions.length === 0) {
            return null;
        }

        if (!highlightedOption) {
            return filteredNavigationOptions[0];
        }

        return (
            filteredNavigationOptions.find(
                (option) => option.id === highlightedOption.id,
            ) ?? filteredNavigationOptions[0]
        );
    }, [filteredNavigationOptions, highlightedOption]);

    const commandShortcut =
        typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
            ? '⌘K'
            : 'Ctrl+K';

    const openCommandPalette = useCallback(() => {
        setMenuOpen(false);
        setLanguageOpen(false);
        setQuery('');
        setHighlightedOption(null);
        setCommandOpen(true);
    }, [setQuery]);

    const closeCommandPalette = useCallback(() => {
        setCommandOpen(false);
        setQuery('');
        setHighlightedOption(null);
    }, [setQuery]);

    const goToCommandOption = useCallback(
        (option: CommandOption | null) => {
            if (!option) return;

            const targetId = option.href.replace('#', '');
            const target = document.getElementById(targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.replaceState(null, '', option.href);
            } else {
                window.location.hash = option.href;
            }

            closeCommandPalette();
        },
        [closeCommandPalette],
    );

    const onCommandInputKeyDown = useCallback(
        (event: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (filteredNavigationOptions.length === 0) {
                    return;
                }

                event.preventDefault();

                const currentIndex = activeHighlightedOption
                    ? filteredNavigationOptions.findIndex(
                          (option) => option.id === activeHighlightedOption.id,
                      )
                    : -1;

                const nextIndex =
                    event.key === 'ArrowDown'
                        ? (currentIndex + 1) % filteredNavigationOptions.length
                        : currentIndex <= 0
                          ? filteredNavigationOptions.length - 1
                          : currentIndex - 1;

                setHighlightedOption(filteredNavigationOptions[nextIndex]);
                return;
            }

            if (event.key !== 'Enter') {
                return;
            }

            if (filteredNavigationOptions.length === 0) {
                return;
            }

            event.preventDefault();
            goToCommandOption(activeHighlightedOption);
        },
        [activeHighlightedOption, filteredNavigationOptions, goToCommandOption],
    );

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

    useEffect(() => {
        const isEditable = (element: EventTarget | null): boolean => {
            if (!(element instanceof HTMLElement)) return false;

            const tag = element.tagName;
            return (
                element.isContentEditable ||
                tag === 'INPUT' ||
                tag === 'TEXTAREA' ||
                tag === 'SELECT'
            );
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === 'k' &&
                (event.metaKey || event.ctrlKey)
            ) {
                if (isEditable(event.target)) {
                    return;
                }

                event.preventDefault();
                openCommandPalette();
            }

            if (event.key === 'Escape' && commandOpen) {
                closeCommandPalette();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [closeCommandPalette, commandOpen, openCommandPalette]);

    return (
        <>
            <header
                className={`${styles.header} ${scrolled ? 'navbar-scrolled' : ''}`}
                data-scrolled={scrolled}
            >
                <div className={styles.inner}>
                    <NavLogo />

                    {/* Desktop nav */}
                    {!isCompactView && (
                        <>
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
                            </nav>

                            <div className={styles.desktopActions}>
                                <button
                                    type="button"
                                    onClick={openCommandPalette}
                                    className={styles.commandTrigger}
                                    aria-label={
                                        dict.commandPalette.triggerLabel
                                    }
                                >
                                    <span
                                        className={`material-symbols-outlined ${styles.commandTriggerIcon}`}
                                    >
                                        search
                                    </span>
                                    <span>
                                        {dict.commandPalette.searchLabel}
                                    </span>
                                    <span className={styles.commandShortcut}>
                                        {commandShortcut}
                                    </span>
                                </button>

                                {/* Language dropdown */}
                                <div
                                    ref={languageRef}
                                    className={`${styles.langWrapper} ${styles.desktopLangWrapper}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLanguageOpen((open) => !open)
                                        }
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
                                                const active =
                                                    option.id === locale;
                                                return (
                                                    <a
                                                        key={option.id}
                                                        role="menuitem"
                                                        href={`/${option.id}`}
                                                        onClick={() =>
                                                            setLanguageOpen(
                                                                false,
                                                            )
                                                        }
                                                        className={
                                                            styles.langOption
                                                        }
                                                        data-active={active}
                                                    >
                                                        <span>
                                                            {option.label}
                                                        </span>
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
                            </div>
                        </>
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
                        <button
                            type="button"
                            onClick={openCommandPalette}
                            className={styles.mobileCommandTrigger}
                            aria-label={dict.commandPalette.triggerLabel}
                        >
                            <span
                                className={`material-symbols-outlined ${styles.mobileNavIcon}`}
                            >
                                search
                            </span>
                            <span>{dict.commandPalette.searchLabel}</span>
                            <span className={styles.commandShortcut}>
                                {commandShortcut}
                            </span>
                        </button>

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
                            <div
                                ref={languageRef}
                                className={styles.langWrapper}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguageOpen((open) => !open)
                                    }
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

            <Modal
                open={commandOpen}
                onClose={closeCommandPalette}
                aria-labelledby="command-palette-title"
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    pt: { xs: '14vh', md: '18vh' },
                    px: 2,
                    backdropFilter: 'blur(6px)',
                }}
            >
                <Box
                    sx={{
                        width: 'min(720px, 100%)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        bgcolor: 'rgba(8, 12, 16, 0.92)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        id="command-palette-title"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            pt: 1.4,
                            pb: 0.8,
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                        }}
                    >
                        <span>{dict.commandPalette.title}</span>
                        <span>{commandShortcut}</span>
                    </Box>

                    <Autocomplete
                        openOnFocus
                        autoHighlight
                        clearOnEscape
                        options={navigationCommandOptions}
                        value={null}
                        inputValue={query}
                        filterOptions={(options, state) =>
                            OPTION_FILTER(options, state)
                        }
                        onInputChange={(_, value, reason) => {
                            if (reason === 'input' || reason === 'clear') {
                                setQuery(value);
                            }
                        }}
                        onChange={(_, value) => goToCommandOption(value)}
                        onHighlightChange={(_, option) => {
                            setHighlightedOption(option);
                        }}
                        getOptionLabel={(option) => option.label}
                        noOptionsText={dict.commandPalette.noResultsLabel}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                {...props}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1,
                                    py: 1,
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '18px', opacity: 0.8 }}
                                    aria-hidden
                                >
                                    {option.icon}
                                </span>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        gap: 0.45,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            gap: 1,
                                        }}
                                    >
                                        <span>{option.label}</span>
                                        <span
                                            style={{
                                                opacity: 0.72,
                                                fontSize: '0.74rem',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {option.href}
                                        </span>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            gap: 1,
                                        }}
                                    >
                                        <span
                                            style={{
                                                opacity: 0.7,
                                                fontSize: '0.74rem',
                                            }}
                                        >
                                            {option.category}
                                        </span>
                                        <span
                                            style={{
                                                opacity: 0.62,
                                                fontSize: '0.73rem',
                                            }}
                                        >
                                            {option.href}
                                        </span>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={dict.commandPalette.placeholder}
                                autoFocus
                                onKeyDown={onCommandInputKeyDown}
                            />
                        )}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 0.5,
                                    borderRadius: 2,
                                    border: '1px solid var(--border)',
                                    bgcolor: 'rgba(8, 12, 16, 0.96)',
                                    color: 'var(--text-primary)',
                                    boxShadow:
                                        '0 14px 36px rgba(0, 0, 0, 0.45)',
                                },
                            },
                            listbox: {
                                sx: {
                                    'maxHeight': 340,
                                    'px': 1,
                                    'py': 0.75,
                                    '& .MuiAutocomplete-option': {
                                        borderRadius: '10px',
                                        border: '1px solid transparent',
                                    },
                                    '& .MuiAutocomplete-option.Mui-focused': {
                                        bgcolor:
                                            'color-mix(in srgb, var(--accent) 18%, transparent)',
                                        borderColor:
                                            'color-mix(in srgb, var(--accent) 55%, transparent)',
                                    },
                                    '& .MuiAutocomplete-option[aria-selected="true"]':
                                        {
                                            bgcolor:
                                                'color-mix(in srgb, var(--accent) 24%, transparent)',
                                            borderColor:
                                                'color-mix(in srgb, var(--accent) 70%, transparent)',
                                        },
                                },
                            },
                            popper: {
                                disablePortal: true,
                                sx: {
                                    zIndex: 4,
                                },
                            },
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                px: 2,
                                py: 1.2,
                                color: 'var(--text-primary)',
                                fontSize: '1.02rem',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiAutocomplete-endAdornment': {
                                display: 'none',
                            },
                        }}
                    />

                    <Box
                        sx={{
                            px: 2,
                            py: 1.1,
                            borderTop: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                        }}
                    >
                        <span>{dict.commandPalette.hint}</span>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
