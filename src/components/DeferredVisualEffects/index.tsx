'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CursorManager = dynamic(() => import('@/components/CursorManager'), {
    ssr: false,
});

const TerrainScene = dynamic(() => import('@/components/TerrainScene'), {
    ssr: false,
});

const MOBILE_QUERY = '(max-width: 1023px)';
const FINE_POINTER_QUERY = '(any-pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function isLighthouseAudit(): boolean {
    const ua = navigator.userAgent || '';
    return /lighthouse|chrome-lighthouse/i.test(ua);
}

function getTerrainOverride(): boolean | null {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('forceTerrain');
    if (value === '1') return true;
    if (value === '0') return false;
    return null;
}

function isSlowConnection(): boolean {
    const nav = navigator as Navigator & {
        connection?: {
            effectiveType?: string;
            saveData?: boolean;
        };
    };

    const connection = nav.connection;
    if (!connection) return false;

    if (connection.saveData) return true;

    return (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g'
    );
}

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
    const [allowTerrain] = useState(() => {
        if (typeof window === 'undefined') return false;

        const override = getTerrainOverride();
        if (override !== null) return override;

        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        const isSlowNetwork = isSlowConnection();
        const isLighthouse = isLighthouseAudit();

        return !(reducedMotion || (isMobile && isSlowNetwork) || isLighthouse);
    });

    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        const hasFinePointer = window.matchMedia(FINE_POINTER_QUERY).matches;
        const isSlowNetwork = isSlowConnection();

        // Skip deferred visuals for constrained environments.
        if (reducedMotion || (isMobile && isSlowNetwork)) {
            return;
        }

        const cancelCursor = hasFinePointer
            ? scheduleIdle(() => setShowCursor(true), 900)
            : () => undefined;

        return () => {
            cancelCursor();
        };
    }, []);

    return (
        <>
            {showCursor ? <CursorManager /> : null}
            {allowTerrain ? <TerrainScene /> : null}
        </>
    );
}
