'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import PowerLevelIntro from '../PowerLevelIntro';

/**
 * Mounts power-mode effects:
 * - PowerLevelIntro overlay (once per session, when Power mode first activated)
 */
export default function ThemeEffects() {
    const { theme } = useTheme();
    const [introSeen, setIntroSeen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return Boolean(sessionStorage.getItem('portfolio-intro-seen'));
    });
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
