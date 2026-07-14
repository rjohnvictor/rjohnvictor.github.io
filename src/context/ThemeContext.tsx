'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
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
    const [theme, setThemeState] = useState<AppTheme>(() => {
        if (typeof window === 'undefined') return 'professional';

        const attr = document.documentElement.getAttribute(
            'data-theme',
        ) as AppTheme | null;
        if (attr && VALID_THEMES.includes(attr)) {
            return attr;
        }

        const stored = localStorage.getItem(
            'portfolio-theme',
        ) as AppTheme | null;
        return stored && VALID_THEMES.includes(stored)
            ? stored
            : 'professional';
    });

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
