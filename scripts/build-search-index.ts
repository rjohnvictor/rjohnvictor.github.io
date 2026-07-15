import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import en from '../messages/en.json';
import hi from '../messages/hi.json';
import ta from '../messages/ta.json';
import {
    DESIGN,
    EDUCATION,
    EXPERIENCE,
    EXPERTISE,
    FEATURED_PROJECTS,
    IMPACT,
    INTERESTS,
    LEADERSHIP,
    PHILOSOPHY,
    PROJECTS,
    QUICK_FACT_KEYS,
    RESEARCH,
    SKILLS,
} from '../src/data/portfolio';
import type {
    SearchDocument,
    SearchIndexFile,
    SearchVectorDocument,
} from '../src/lib/search/types';
import type { Dictionary } from '../src/types/dictionary';

const EMBEDDING_MODEL = 'universal-sentence-encoder';
const CHUNK_WORD_LIMIT = 110;
const CHUNK_WORD_OVERLAP = 24;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'search');
const outputPath = path.join(outputDir, 'vectors.json');

type LocaleEntry = {
    locale: string;
    dictionary: Dictionary;
};

const LOCALES: LocaleEntry[] = [
    { locale: 'en', dictionary: en as Dictionary },
    { locale: 'hi', dictionary: hi as Dictionary },
    { locale: 'ta', dictionary: ta as Dictionary },
];

type MutableSearchDocument = {
    id: string;
    title: string;
    category: string;
    section: string;
    url: string;
    content: string;
    tags: string[];
};

function words(text: string): string[] {
    return text
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter((value) => value.length > 0);
}

function normalizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

function kebabCase(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function unique(values: string[]): string[] {
    return Array.from(new Set(values.filter((value) => value.trim().length)));
}

function normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
        vector.reduce((sum, value) => sum + value * value, 0),
    );

    if (magnitude === 0) {
        return vector;
    }

    return vector.map((value) => value / magnitude);
}

function createDocument(input: MutableSearchDocument): SearchDocument {
    return {
        id: input.id,
        title: input.title,
        category: input.category,
        section: input.section,
        url: input.url,
        content: normalizeText(input.content),
        tags: unique(input.tags),
    };
}

function chunkContent(content: string): string[] {
    const tokens = words(content);
    if (tokens.length <= CHUNK_WORD_LIMIT) return [content];

    const chunks: string[] = [];
    const step = Math.max(1, CHUNK_WORD_LIMIT - CHUNK_WORD_OVERLAP);

    for (let start = 0; start < tokens.length; start += step) {
        const end = Math.min(tokens.length, start + CHUNK_WORD_LIMIT);
        chunks.push(tokens.slice(start, end).join(' '));
        if (end >= tokens.length) break;
    }

    return chunks;
}

function collectStringLeaves(value: unknown): string[] {
    if (typeof value === 'string') {
        return [value];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => collectStringLeaves(item));
    }

    if (typeof value === 'object' && value !== null) {
        return Object.values(value).flatMap((item) =>
            collectStringLeaves(item),
        );
    }

    return [];
}

function buildDocumentsForLocale(dictionary: Dictionary): SearchDocument[] {
    const documents: SearchDocument[] = [];
    const handledSections = new Set<string>();

    const add = (doc: MutableSearchDocument) => {
        const normalized = createDocument(doc);
        if (!normalized.content) return;
        documents.push(normalized);
    };

    add({
        id: 'about-core',
        title: dictionary.about.heading,
        category: dictionary.about.label,
        section: 'about',
        url: '#about',
        content: [
            dictionary.about.p1,
            dictionary.about.p2,
            dictionary.about.p3,
        ].join(' '),
        tags: [
            dictionary.nav.about,
            dictionary.about.factSpecializationValue,
            dictionary.about.factCurrentFocusValue,
        ],
    });
    handledSections.add('about');

    add({
        id: 'about-quick-facts',
        title: dictionary.about.quickFacts,
        category: dictionary.about.label,
        section: 'about',
        url: '#about',
        content: QUICK_FACT_KEYS.map((key) => {
            const item = dictionary.about.quickFactItems[key];
            return `${item.label}: ${item.value}`;
        }).join(' '),
        tags: [dictionary.about.quickFacts, dictionary.nav.about],
    });

    add({
        id: 'skills-core',
        title: dictionary.skills.heading,
        category: dictionary.skills.label,
        section: 'skills',
        url: '#skills',
        content: [
            dictionary.skills.subtitle,
            ...SKILLS.flatMap((group) => group.items),
            ...Object.values(dictionary.skills.spanItems),
        ].join(' '),
        tags: [
            dictionary.nav.skills,
            ...SKILLS.map((group) => group.categoryKey),
        ],
    });
    handledSections.add('skills');

    for (const [id, experience] of Object.entries(
        dictionary.experience.items,
    )) {
        const period = EXPERIENCE.find((item) => item.id === id)?.period ?? '';
        add({
            id: `experience-${id}`,
            title: experience.role,
            category: dictionary.experience.label,
            section: 'experience',
            url: '#experience',
            content: [
                experience.progression ?? '',
                period,
                ...experience.bullets,
            ].join(' '),
            tags: [dictionary.nav.experience, period],
        });
    }
    handledSections.add('experience');

    for (const [id, text] of Object.entries(dictionary.achievements.items)) {
        add({
            id: `achievement-${id}`,
            title: text,
            category: dictionary.achievements.label,
            section: 'achievements',
            url: '#achievements',
            content: text,
            tags: [dictionary.nav.achievements],
        });
    }
    handledSections.add('achievements');

    for (const [id, item] of Object.entries(dictionary.education.items)) {
        const details = EDUCATION.find((entry) => entry.id === id);
        add({
            id: `education-${id}`,
            title: item.degree,
            category: dictionary.education.label,
            section: 'education',
            url: '#education',
            content: [
                item.degree,
                item.grade ?? '',
                details?.institution ?? '',
                details?.period ?? '',
                ...(item.notes ?? []),
            ].join(' '),
            tags: [dictionary.nav.education, details?.institution ?? ''],
        });
    }
    handledSections.add('education');

    for (const [id, project] of Object.entries(
        dictionary.featuredWork.projects,
    )) {
        const projectData = FEATURED_PROJECTS.find((entry) => entry.id === id);
        add({
            id: `featured-work-${id}`,
            title: project.title,
            category: project.category,
            section: 'featured-work',
            url: '#featured-work',
            content: [
                project.status ?? '',
                ...(project.impact ?? []),
                ...(project.responsibilities ?? []),
                ...(projectData?.technologies ?? []),
            ].join(' '),
            tags: [
                dictionary.nav.featuredWork,
                project.category,
                ...(projectData?.technologies ?? []),
            ],
        });
    }
    handledSections.add('featuredWork');

    for (const [id, group] of Object.entries(
        dictionary.technicalContributions.groups,
    )) {
        add({
            id: `contribution-${id}`,
            title: group.title,
            category: dictionary.technicalContributions.label,
            section: 'technical-contributions',
            url: '#technical-contributions',
            content: group.items.join(' '),
            tags: [dictionary.nav.technicalContributions, group.title],
        });
    }
    handledSections.add('technicalContributions');

    for (const [id, project] of Object.entries(dictionary.projects.items)) {
        const projectData = PROJECTS.find((entry) => entry.id === id);
        add({
            id: `projects-${id}`,
            title: project.title,
            category: project.type,
            section: 'featured-work',
            url: '#featured-work',
            content: [
                project.description,
                ...project.highlights,
                ...(projectData?.tech ?? []),
            ].join(' '),
            tags: [
                dictionary.projects.label,
                project.type,
                ...(projectData?.tech ?? []),
            ],
        });
    }
    handledSections.add('projects');

    add({
        id: 'manifesto-core',
        title: dictionary.manifesto.heading,
        category: dictionary.manifesto.label,
        section: 'manifesto',
        url: '#manifesto',
        content: [
            dictionary.manifesto.resilience,
            dictionary.manifesto.resilienceBody,
            dictionary.manifesto.journey,
            dictionary.manifesto.journeyBody,
            dictionary.manifesto.vision,
            dictionary.manifesto.visionBody,
        ].join(' '),
        tags: [
            dictionary.manifesto.label,
            dictionary.manifesto.resilience,
            dictionary.manifesto.vision,
        ],
    });
    handledSections.add('manifesto');

    for (const item of PHILOSOPHY) {
        const localized = dictionary.philosophy.items[item.id];
        add({
            id: `philosophy-${item.id}`,
            title: localized.title,
            category: dictionary.philosophy.label,
            section: 'philosophy',
            url: '#philosophy',
            content: localized.description,
            tags: [dictionary.philosophy.label, localized.title],
        });
    }
    handledSections.add('philosophy');

    add({
        id: 'techstack-core',
        title: dictionary.techStack.heading,
        category: dictionary.techStack.label,
        section: 'skills',
        url: '#skills',
        content: SKILLS.map((group) => {
            const label =
                dictionary.techStack.categoryLabels[group.categoryKey];
            return `${label}: ${group.items.join(', ')}`;
        }).join(' '),
        tags: [
            dictionary.techStack.label,
            ...SKILLS.flatMap((group) => group.items),
        ],
    });
    handledSections.add('techStack');

    add({
        id: 'contact-core',
        title: dictionary.contact.heading,
        category: dictionary.contact.label,
        section: 'contact',
        url: '#contact',
        content: dictionary.contact.body,
        tags: [dictionary.nav.contact],
    });
    handledSections.add('contact');

    add({
        id: 'timeline-summary',
        title: 'Timeline',
        category: 'Timeline',
        section: 'experience',
        url: '#experience',
        content: [
            ...EXPERIENCE.map((item) => `${item.company} ${item.period}`),
            ...EDUCATION.map((item) => `${item.institution} ${item.period}`),
        ].join(' '),
        tags: ['timeline', dictionary.nav.experience, dictionary.nav.education],
    });

    add({
        id: 'impact-summary',
        title: 'Impact',
        category: 'Impact',
        section: 'achievements',
        url: '#achievements',
        content: IMPACT.map(
            (item) => `${item.title} ${item.value} ${item.description}`,
        ).join(' '),
        tags: ['impact', dictionary.nav.achievements],
    });

    add({
        id: 'expertise-summary',
        title: 'Expertise',
        category: dictionary.skills.label,
        section: 'skills',
        url: '#skills',
        content: EXPERTISE.map(
            (item) => `${item.title} ${item.description}`,
        ).join(' '),
        tags: ['expertise', dictionary.nav.skills],
    });

    add({
        id: 'leadership-summary',
        title: 'Leadership',
        category: dictionary.technicalContributions.label,
        section: 'technical-contributions',
        url: '#technical-contributions',
        content: [
            ...LEADERSHIP.mentoring,
            ...LEADERSHIP.workshops,
            ...LEADERSHIP.hiring,
            ...LEADERSHIP.community,
        ].join(' '),
        tags: [
            'leadership',
            'mentoring',
            dictionary.nav.technicalContributions,
        ],
    });

    add({
        id: 'design-summary',
        title: DESIGN.title,
        category: dictionary.skills.label,
        section: 'skills',
        url: '#skills',
        content: [DESIGN.description, ...DESIGN.expertise].join(' '),
        tags: ['design', 'ui', 'ux', ...DESIGN.expertise],
    });

    add({
        id: 'research-summary',
        title: 'Research',
        category: 'Research',
        section: 'about',
        url: '#about',
        content: RESEARCH.map(
            (entry) =>
                `${entry.title} ${entry.publisher} ${entry.type} ${entry.year ?? ''}`,
        ).join(' '),
        tags: ['research', 'ieee', 'scholar'],
    });

    add({
        id: 'interests-summary',
        title: 'Interests',
        category: dictionary.techStack.label,
        section: 'skills',
        url: '#skills',
        content: INTERESTS.join(' '),
        tags: INTERESTS,
    });

    for (const [sectionKey, sectionValue] of Object.entries(dictionary)) {
        if (handledSections.has(sectionKey)) {
            continue;
        }

        if (
            sectionKey === 'nav' ||
            sectionKey === 'footer' ||
            sectionKey === 'commandPalette'
        ) {
            continue;
        }

        const leaves = collectStringLeaves(sectionValue)
            .map((value) => normalizeText(value))
            .filter((value) => value.length > 0);

        if (leaves.length === 0) continue;

        add({
            id: `dynamic-${kebabCase(sectionKey)}`,
            title: sectionKey,
            category: sectionKey,
            section: kebabCase(sectionKey),
            url: `#${kebabCase(sectionKey)}`,
            content: leaves.join(' '),
            tags: [sectionKey],
        });
    }

    return documents;
}

function chunkDocuments(
    locale: string,
    documents: SearchDocument[],
): Array<Omit<SearchVectorDocument, 'embedding'>> {
    return documents.flatMap((document) => {
        const chunks = chunkContent(document.content);
        return chunks.map((chunkText, chunk) => ({
            ...document,
            id:
                chunks.length > 1
                    ? `${document.id}::chunk-${chunk}`
                    : document.id,
            locale,
            chunk,
            content: chunkText,
        }));
    });
}

async function main() {
    console.log(`[search] loading embedding model ${EMBEDDING_MODEL}`);
    await tf.ready();
    const model = await use.load();

    const locales: SearchIndexFile['locales'] = {};
    let dimensions = 0;

    for (const { locale, dictionary } of LOCALES) {
        console.log(`[search] indexing locale ${locale}`);

        const baseDocuments = buildDocumentsForLocale(dictionary);
        const chunked = chunkDocuments(locale, baseDocuments);
        const texts = chunked.map((document) => document.content);

        const tensor = await model.embed(texts);
        const embeddingMatrixRaw = await tensor.array();
        tensor.dispose();

        if (!Array.isArray(embeddingMatrixRaw)) {
            throw new Error('Embedding model returned an invalid matrix.');
        }

        const embeddingMatrix = embeddingMatrixRaw as number[][];

        const items: SearchVectorDocument[] = chunked.map((document, index) => {
            const rawVector = embeddingMatrix[index] ?? [];
            const embedding = normalizeVector(rawVector);
            dimensions = Math.max(dimensions, embedding.length);

            return {
                ...document,
                embedding,
            };
        });

        locales[locale] = { items };
        console.log(
            `[search] locale ${locale} -> ${baseDocuments.length} docs, ${items.length} vector chunks`,
        );
    }

    const payload: SearchIndexFile = {
        version: 1,
        model: EMBEDDING_MODEL,
        dimensions,
        generatedAt: new Date().toISOString(),
        locales,
    };

    await mkdir(outputDir, { recursive: true });
    await writeFile(outputPath, JSON.stringify(payload), 'utf8');

    console.log(`[search] wrote ${outputPath}`);
}

main().catch((error: unknown) => {
    console.error('[search] failed to build search index');
    if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
    }
    process.exitCode = 1;
});
