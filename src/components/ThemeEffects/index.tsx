'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import PowerLevelIntro from '../PowerLevelIntro';

/**
 * Mounts power-mode effects:
 * - PowerLevelIntro overlay (once per session, when Power mode first activated)
 */
export default function ThemeEffects() {
    const { theme } = useTheme();
    const [introSeen, setIntroSeen] = useState(true);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (theme !== 'power') {
                setIntroSeen(true);
                return;
            }

            setIntroSeen(
                Boolean(sessionStorage.getItem('portfolio-intro-seen')),
            );
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [theme]);

    const showIntro = theme === 'power' && !introSeen;

    if (!showIntro) return null;

    return (
        <PowerLevelIntro
            onComplete={() => {
                sessionStorage.setItem('portfolio-intro-seen', '1');
                setIntroSeen(true);
            }}
        />
    );
}
