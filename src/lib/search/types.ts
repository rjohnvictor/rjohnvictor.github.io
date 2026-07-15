export type SearchLocale = string;

export interface SearchDocument {
    id: string;
    title: string;
    category: string;
    section: string;
    url: string;
    content: string;
    tags: string[];
}

export interface SearchVectorDocument extends SearchDocument {
    locale: SearchLocale;
    chunk: number;
    embedding: number[];
}

export interface SearchLocaleIndex {
    items: SearchVectorDocument[];
}

export interface SearchIndexFile {
    version: number;
    model: string;
    dimensions: number;
    generatedAt: string;
    locales: Record<SearchLocale, SearchLocaleIndex>;
}

export interface HighlightSegment {
    text: string;
    isMatch: boolean;
}

export interface SemanticSearchResult {
    id: string;
    title: string;
    category: string;
    section: string;
    url: string;
    score: number;
    preview: string;
    highlights: HighlightSegment[];
    tags: string[];
}

export type SemanticSearchErrorCode = 'load-failed' | 'search-failed';

export interface SemanticSearchParams {
    query: string;
    locale: SearchLocale;
    topK?: number;
    minScore?: number;
}

export interface SemanticRetriever {
    search(params: SemanticSearchParams): Promise<SemanticSearchResult[]>;
}

export interface SemanticRetrieverDeps {
    embedQuery: (query: string) => Promise<number[]>;
    loadDocuments: (locale: SearchLocale) => Promise<SearchVectorDocument[]>;
}
