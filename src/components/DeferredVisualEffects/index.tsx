'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CursorManager = dynamic(() => import('@/components/CursorManager'), {
    ssr: false,
});

const TerrainScene = dynamic(() => import('@/components/TerrainScene'), {
    ssr: false,
});

const DESKTOP_QUERY = '(min-width: 1024px)';
const FINE_POINTER_QUERY = '(any-pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function scheduleIdle(callback: () => void, timeoutMs: number) {
    if (typeof window === 'undefined') return () => undefined;

    const runtime = globalThis as typeof globalThis & {
        requestIdleCallback?: (
            cb: IdleRequestCallback,
            options?: IdleRequestOptions,
        ) => number;
        cancelIdleCallback?: (id: number) => void;
    };

    if (
        typeof runtime.requestIdleCallback === 'function' &&
        typeof runtime.cancelIdleCallback === 'function'
    ) {
        const id = runtime.requestIdleCallback(callback, {
            timeout: timeoutMs,
        });
        return () => runtime.cancelIdleCallback?.(id);
    }

    const id = globalThis.setTimeout(callback, Math.min(timeoutMs, 1200));
    return () => globalThis.clearTimeout(id);
}

export default function DeferredVisualEffects() {
    const [showCursor, setShowCursor] = useState(false);
    const [showTerrain, setShowTerrain] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
        const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
        const hasFinePointer = window.matchMedia(FINE_POINTER_QUERY).matches;

        if (reducedMotion) {
            setShowCursor(false);
            setShowTerrain(false);
            return;
        }

        const cancelCursor = hasFinePointer
            ? scheduleIdle(() => setShowCursor(true), 900)
            : () => undefined;

        // Terrain is the heaviest script path; mount only on desktop after idle.
        const cancelTerrain = isDesktop
            ? scheduleIdle(() => setShowTerrain(true), 1800)
            : () => undefined;

        return () => {
            cancelCursor();
            cancelTerrain();
        };
    }, []);

    return (
        <>
            {showCursor ? <CursorManager /> : null}
            {showTerrain ? <TerrainScene /> : null}
        </>
    );
}
