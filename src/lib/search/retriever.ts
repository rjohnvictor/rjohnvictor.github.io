import type {
    HighlightSegment,
    SemanticRetriever,
    SemanticRetrieverDeps,
    SemanticSearchParams,
    SemanticSearchResult,
    SearchVectorDocument,
} from './types';

const DEFAULT_TOP_K = 8;
const DEFAULT_MIN_SCORE = 0.2;
const PREVIEW_MAX_LENGTH = 180;
const MIN_KEYWORD_FLOOR = 0.45;

function toRoundedScore(score: number): number {
    return Math.round(score * 1000) / 1000;
}

function tokenizeQuery(query: string): string[] {
    const raw = query.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu);

    if (!raw) return [];
    return Array.from(new Set(raw));
}

function escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0 || a.length !== b.length) {
        return 0;
    }

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i += 1) {
        const av = a[i];
        const bv = b[i];
        dot += av * bv;
        magA += av * av;
        magB += bv * bv;
    }

    const denominator = Math.sqrt(magA) * Math.sqrt(magB);
    if (denominator === 0) return 0;

    return dot / denominator;
}

function keywordCoverageScore(
    document: SearchVectorDocument,
    tokens: string[],
): number {
    if (tokens.length === 0) return 0;

    const haystack = [
        document.title,
        document.category,
        document.section,
        document.url,
        ...document.tags,
        document.content,
    ]
        .join(' ')
        .toLowerCase();

    const matched = tokens.filter((token) => haystack.includes(token)).length;
    return matched / tokens.length;
}

function blendedScore(semanticScore: number, keywordScore: number): number {
    return semanticScore * 0.82 + keywordScore * 0.18;
}

function createPreview(content: string, tokens: string[]): string {
    const normalized = content.replace(/\s+/g, ' ').trim();
    if (normalized.length <= PREVIEW_MAX_LENGTH) {
        return normalized;
    }

    const lower = normalized.toLowerCase();
    const firstTokenIndex = tokens
        .map((token) => lower.indexOf(token))
        .filter((index) => index >= 0)
        .sort((a, b) => a - b)[0];

    if (firstTokenIndex === undefined) {
        return `${normalized.slice(0, PREVIEW_MAX_LENGTH - 3).trimEnd()}...`;
    }

    const start = Math.max(0, firstTokenIndex - 60);
    const end = Math.min(normalized.length, start + PREVIEW_MAX_LENGTH);
    const slice = normalized.slice(start, end).trim();
    const prefix = start > 0 ? '...' : '';
    const suffix = end < normalized.length ? '...' : '';
    return `${prefix}${slice}${suffix}`;
}

function buildHighlightSegments(
    preview: string,
    tokens: string[],
): HighlightSegment[] {
    if (tokens.length === 0) {
        return [{ text: preview, isMatch: false }];
    }

    const expression = new RegExp(
        `(${tokens.map((token) => escapeForRegex(token)).join('|')})`,
        'ig',
    );

    const parts = preview.split(expression).filter((part) => part.length > 0);
    return parts.map((part) => ({
        text: part,
        isMatch: tokens.some(
            (token) => token.toLowerCase() === part.toLowerCase(),
        ),
    }));
}

function mapResult(
    document: SearchVectorDocument,
    score: number,
    tokens: string[],
): SemanticSearchResult {
    const preview = createPreview(document.content, tokens);

    return {
        id: document.id,
        title: document.title,
        category: document.category,
        section: document.section,
        url: document.url,
        score: toRoundedScore(score),
        preview,
        highlights: buildHighlightSegments(preview, tokens),
        tags: document.tags,
    };
}

export function createSemanticRetriever(
    deps: SemanticRetrieverDeps,
): SemanticRetriever {
    return {
        async search({
            query,
            locale,
            topK = DEFAULT_TOP_K,
            minScore = DEFAULT_MIN_SCORE,
        }: SemanticSearchParams): Promise<SemanticSearchResult[]> {
            const trimmed = query.trim();
            if (!trimmed) return [];

            const [queryVector, documents] = await Promise.all([
                deps.embedQuery(trimmed),
                deps.loadDocuments(locale),
            ]);

            if (queryVector.length === 0 || documents.length === 0) {
                return [];
            }

            const tokens = tokenizeQuery(trimmed);

            return documents
                .map((document) => {
                    const semanticScore = cosineSimilarity(
                        queryVector,
                        document.embedding,
                    );
                    const keywordScore = keywordCoverageScore(document, tokens);

                    return {
                        document,
                        semanticScore,
                        keywordScore,
                        score: blendedScore(semanticScore, keywordScore),
                    };
                })
                .filter(
                    ({ score, keywordScore }) =>
                        Number.isFinite(score) &&
                        (score >= minScore ||
                            keywordScore >= MIN_KEYWORD_FLOOR),
                )
                .sort((a, b) => b.score - a.score)
                .slice(0, topK)
                .map(({ document, score }) =>
                    mapResult(document, score, tokens),
                );
        },
    };
}
