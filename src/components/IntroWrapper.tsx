'use client';

import { useState, useSyncExternalStore } from 'react';
import PowerLevelIntro from './PowerLevelIntro';

export default function IntroWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [completed, setCompleted] = useState(false);
    const introSeen = useSyncExternalStore(
        () => () => {},
        () => Boolean(sessionStorage.getItem('portfolio-intro-seen')),
        () => false,
    );
    const showIntro = !completed && !introSeen;

    return (
        <>
            {showIntro && (
                <PowerLevelIntro onComplete={() => setCompleted(true)} />
            )}
            <div
                style={{
                    opacity: showIntro ? 0 : 1,
                    transition: showIntro ? 'none' : 'opacity 0.9s ease-in',
                    visibility: 'visible',
                }}
            >
                {children}
            </div>
        </>
    );
}
