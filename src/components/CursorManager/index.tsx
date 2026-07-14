'use client';

import { useEffect, useState } from 'react';
import ProfessionalCursor from '../ProfessionalCursor';
import KiCursor from '../KiCursor';
import ZenCursor from '../ZenCursor';

export default function CursorManager() {
    const [isTouchInput, setIsTouchInput] = useState(() => {
        if (typeof window === 'undefined') return true;
        return (
            window.matchMedia('(pointer: coarse)').matches ||
            navigator.maxTouchPoints > 0
        );
    });
    const [hasFinePointer, setHasFinePointer] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(any-pointer: fine)').matches;
    });

    useEffect(() => {
        const finePointerQuery = window.matchMedia('(any-pointer: fine)');

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType === 'touch' || event.pointerType === 'pen') {
                setIsTouchInput(true);
                return;
            }
            if (event.pointerType === 'mouse') {
                setIsTouchInput(false);
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === 'mouse') {
                setIsTouchInput(false);
            }
        };

        const onFinePointerChange = (
            event: MediaQueryListEvent | MediaQueryList,
        ) => {
            setHasFinePointer(event.matches);
        };

        onFinePointerChange(finePointerQuery);
        window.addEventListener('pointerdown', onPointerDown, {
            passive: true,
        });
        window.addEventListener('pointermove', onPointerMove, {
            passive: true,
        });

        if (finePointerQuery.addEventListener) {
            finePointerQuery.addEventListener('change', onFinePointerChange);
        } else {
            finePointerQuery.addListener(onFinePointerChange);
        }

        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            if (finePointerQuery.removeEventListener) {
                finePointerQuery.removeEventListener(
                    'change',
                    onFinePointerChange,
                );
            } else {
                finePointerQuery.removeListener(onFinePointerChange);
            }
        };
    }, []);

    if (isTouchInput || !hasFinePointer) return null;

    return (
        <>
            <ProfessionalCursor />
            <KiCursor />
            <ZenCursor />
        </>
    );
}
