'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export type AppTheme = 'professional' | 'power' | 'zen';

interface ThemeContextValue {
    theme: AppTheme;
    setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'professional',
    setTheme: () => {},
});

const VALID_THEMES: AppTheme[] = ['professional', 'power', 'zen'];

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<AppTheme>('professional');

    useEffect(() => {
        const schedule = globalThis.setTimeout.bind(globalThis);
        const cancel = schedule(() => {
            const attr = document.documentElement.getAttribute(
                'data-theme',
            ) as AppTheme | null;
            const stored = localStorage.getItem(
                'portfolio-theme',
            ) as AppTheme | null;
            const resolvedTheme =
                (stored && VALID_THEMES.includes(stored) && stored) ||
                (attr && VALID_THEMES.includes(attr) && attr) ||
                'professional';

            setThemeState(resolvedTheme);
            document.documentElement.setAttribute('data-theme', resolvedTheme);
        }, 0);

        return () => globalThis.clearTimeout(cancel);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const setTheme = (t: AppTheme) => {
        setThemeState(t);
        localStorage.setItem('portfolio-theme', t);
        document.documentElement.setAttribute('data-theme', t);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
