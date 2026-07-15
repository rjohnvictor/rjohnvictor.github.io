'use client';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type MutableRefObject,
} from 'react';
import { createSemanticRetriever } from '@/lib/search/retriever';
import {
    embedQueryText,
    loadLocaleDocuments,
    warmSemanticSearch,
} from '@/lib/search/runtime';
import type {
    SemanticSearchErrorCode,
    SemanticRetriever,
    SemanticSearchResult,
} from '@/lib/search/types';

type UseSemanticSearchOptions = {
    locale: string;
    topK?: number;
    minScore?: number;
};

type UseSemanticSearchState = {
    query: string;
    isReady: boolean;
    isSearching: boolean;
    error: SemanticSearchErrorCode | null;
    results: SemanticSearchResult[];
    setQuery: (value: string) => void;
};

function getRetriever(ref: MutableRefObject<SemanticRetriever | null>) {
    if (!ref.current) {
        ref.current = createSemanticRetriever({
            embedQuery: embedQueryText,
            loadDocuments: loadLocaleDocuments,
        });
    }

    return ref.current;
}

export function useSemanticSearch({
    locale,
    topK = 8,
    minScore = 0.2,
}: UseSemanticSearchOptions): UseSemanticSearchState {
    const [query, setQuery] = useState('');
    const [rawResults, setRawResults] = useState<SemanticSearchResult[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [lastCompletedQuery, setLastCompletedQuery] = useState('');
    const [error, setError] = useState<SemanticSearchErrorCode | null>(null);

    const retrieverRef = useRef<SemanticRetriever | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        let mounted = true;
        const runtime = globalThis as typeof globalThis & {
            requestIdleCallback?: (
                cb: IdleRequestCallback,
                options?: IdleRequestOptions,
            ) => number;
            cancelIdleCallback?: (id: number) => void;
        };

        const runWarmup = () => {
            warmSemanticSearch(locale)
                .then(() => {
                    if (mounted) {
                        setIsReady(true);
                        setError(null);
                    }
                })
                .catch(() => {
                    if (mounted) {
                        setIsReady(false);
                        setError('load-failed');
                    }
                });
        };

        let timeoutId: number | null = null;
        let idleId: number | null = null;

        if (
            typeof runtime.requestIdleCallback === 'function' &&
            typeof runtime.cancelIdleCallback === 'function'
        ) {
            idleId = runtime.requestIdleCallback(() => runWarmup(), {
                timeout: 1400,
            });
        } else {
            timeoutId = window.setTimeout(runWarmup, 260);
        }

        return () => {
            mounted = false;

            if (
                idleId !== null &&
                typeof runtime.cancelIdleCallback === 'function'
            ) {
                runtime.cancelIdleCallback(idleId);
            }

            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [locale]);

    useEffect(() => {
        const trimmed = query.trim();
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        if (!trimmed) {
            return;
        }

        const retriever = getRetriever(retrieverRef);

        const timeoutId = window.setTimeout(() => {
            retriever
                .search({
                    query: trimmed,
                    locale,
                    topK,
                    minScore,
                })
                .then((nextResults) => {
                    if (requestIdRef.current === requestId) {
                        setRawResults(nextResults);
                        setLastCompletedQuery(trimmed);
                        setError(null);
                    }
                })
                .catch(() => {
                    if (requestIdRef.current === requestId) {
                        setLastCompletedQuery(trimmed);
                        setError('search-failed');
                    }
                });
        }, 70);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [query, locale, minScore, topK]);

    const visibleResults = useMemo(() => {
        if (!query.trim()) {
            return [];
        }

        return rawResults;
    }, [query, rawResults]);

    const isSearching = useMemo(
        () => query.trim().length > 0 && query.trim() !== lastCompletedQuery,
        [lastCompletedQuery, query],
    );

    const updateQuery = useMemo(
        () => (value: string) => {
            setQuery(value);

            if (!value.trim()) {
                setLastCompletedQuery('');
            }
        },
        [],
    );

    return useMemo(
        () => ({
            query,
            isReady,
            isSearching,
            error,
            results: visibleResults,
            setQuery: updateQuery,
        }),
        [error, isReady, isSearching, query, updateQuery, visibleResults],
    );
}
