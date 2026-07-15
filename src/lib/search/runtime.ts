'use client';

import type { SearchIndexFile, SearchVectorDocument } from './types';

export const SEARCH_EMBEDDING_MODEL = 'universal-sentence-encoder';

type EmbeddingModel = {
    embed: (inputs: string[] | string) => Promise<{
        array: () => Promise<unknown>;
        dispose: () => void;
    }>;
};

let modelPromise: Promise<EmbeddingModel> | null = null;
let indexPromise: Promise<SearchIndexFile> | null = null;
const localeDocumentCache = new Map<string, SearchVectorDocument[]>();

function normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
        vector.reduce((sum, value) => sum + value * value, 0),
    );
    if (magnitude === 0) return vector;
    return vector.map((value) => value / magnitude);
}

function isSearchIndexFile(value: unknown): value is SearchIndexFile {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<SearchIndexFile>;
    return (
        typeof candidate.version === 'number' &&
        typeof candidate.model === 'string' &&
        typeof candidate.dimensions === 'number' &&
        typeof candidate.generatedAt === 'string' &&
        typeof candidate.locales === 'object' &&
        candidate.locales !== null
    );
}

function isEmbeddingArray(value: unknown): value is number[][] {
    return (
        Array.isArray(value) &&
        value.every(
            (row) =>
                Array.isArray(row) &&
                row.every((entry) => typeof entry === 'number'),
        )
    );
}

async function getEmbeddingModel(): Promise<EmbeddingModel> {
    if (!modelPromise) {
        modelPromise = (async () => {
            const [tf, use] = await Promise.all([
                import('@tensorflow/tfjs'),
                import('@tensorflow-models/universal-sentence-encoder'),
            ]);

            await tf.ready();
            return use.load();
        })();
    }

    return modelPromise;
}

export async function loadSearchIndex(): Promise<SearchIndexFile> {
    if (!indexPromise) {
        indexPromise = (async () => {
            const response = await fetch('/search/vectors.json', {
                cache: 'force-cache',
            });

            if (!response.ok) {
                throw new Error(
                    `Search index load failed with status ${response.status}.`,
                );
            }

            const json = (await response.json()) as unknown;
            if (!isSearchIndexFile(json)) {
                throw new Error('Search index format is invalid.');
            }

            return json;
        })();
    }

    return indexPromise;
}

export async function loadLocaleDocuments(
    locale: string,
): Promise<SearchVectorDocument[]> {
    const cached = localeDocumentCache.get(locale);
    if (cached) return cached;

    const index = await loadSearchIndex();
    const localeBlock = index.locales[locale] ?? index.locales.en;
    const documents = localeBlock?.items ?? [];

    localeDocumentCache.set(locale, documents);
    return documents;
}

export async function embedQueryText(query: string): Promise<number[]> {
    const model = await getEmbeddingModel();
    const tensor = await model.embed([query]);

    try {
        const raw = await tensor.array();
        if (!isEmbeddingArray(raw) || raw.length === 0) {
            return [];
        }

        return normalizeVector(raw[0]);
    } finally {
        tensor.dispose();
    }
}

export async function warmSemanticSearch(locale: string): Promise<void> {
    await Promise.all([loadLocaleDocuments(locale), getEmbeddingModel()]);
}
