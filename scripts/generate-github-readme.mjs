#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();

function readText(relPath) {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function extractLiteral(sourceText, exportName) {
    const marker = `export const ${exportName}`;
    const startIdx = sourceText.indexOf(marker);
    if (startIdx < 0) {
        throw new Error(`Could not find export ${exportName}`);
    }

    const assignIdx = sourceText.indexOf('=', startIdx);
    if (assignIdx < 0) {
        throw new Error(`Could not find assignment for ${exportName}`);
    }

    let i = assignIdx + 1;
    while (i < sourceText.length && /\s/.test(sourceText[i])) i += 1;

    const open = sourceText[i];
    if (open !== '{' && open !== '[') {
        throw new Error(`Export ${exportName} must start with { or [`);
    }

    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escaped = false;

    for (let j = i; j < sourceText.length; j += 1) {
        const ch = sourceText[j];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (ch === '\\') {
            escaped = true;
            continue;
        }

        if (!inDouble && !inTemplate && ch === "'") {
            inSingle = !inSingle;
            continue;
        }
        if (!inSingle && !inTemplate && ch === '"') {
            inDouble = !inDouble;
            continue;
        }
        if (!inSingle && !inDouble && ch === '`') {
            inTemplate = !inTemplate;
            continue;
        }

        if (inSingle || inDouble || inTemplate) {
            continue;
        }

        if (ch === open) depth += 1;
        if (ch === close) {
            depth -= 1;
            if (depth === 0) {
                return sourceText.slice(i, j + 1);
            }
        }
    }

    throw new Error(`Could not parse literal for ${exportName}`);
}

function evalLiteral(literal, context = {}) {
    return vm.runInNewContext(
        `(${literal})`,
        Object.assign(Object.create(null), context),
    );
}

function renderBulletList(items) {
    return items.map((item) => `- ${item}`).join('\n');
}

function get(dict, pathArr) {
    return pathArr.reduce(
        (acc, key) => (acc && key in acc ? acc[key] : undefined),
        dict,
    );
}

function template(text, values) {
    return text.replace(/\{(\w+)\}/g, (_, key) => {
        return key in values ? String(values[key]) : `{${key}}`;
    });
}

function renderTemplate(templateText, vars) {
    const rendered = templateText.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
        if (!(key in vars)) {
            throw new Error(`Missing template variable: ${key}`);
        }
        return String(vars[key]);
    });

    if (/\{\{[A-Z0-9_]+\}\}/.test(rendered)) {
        throw new Error('Template contains unresolved placeholders');
    }

    return rendered;
}

function main() {
    const dict = JSON.parse(readText('messages/en.json'));

    const hero = evalLiteral(
        extractLiteral(readText('src/data/portfolio/hero.ts'), 'HERO'),
    );
    const personal = evalLiteral(
        extractLiteral(readText('src/data/portfolio/personal.ts'), 'PERSONAL'),
        { HERO: hero },
    );
    const skills = evalLiteral(
        extractLiteral(readText('src/data/portfolio/skills.ts'), 'SKILLS'),
    );
    const experience = evalLiteral(
        extractLiteral(
            readText('src/data/portfolio/experience.ts'),
            'EXPERIENCE',
        ),
    );
    const achievementIds = evalLiteral(
        extractLiteral(
            readText('src/data/portfolio/achievements.ts'),
            'ACHIEVEMENT_IDS',
        ),
    );
    const education = evalLiteral(
        extractLiteral(
            readText('src/data/portfolio/education.ts'),
            'EDUCATION',
        ),
    );
    const featuredProjects = evalLiteral(
        extractLiteral(
            readText('src/data/portfolio/projects.ts'),
            'FEATURED_PROJECTS',
        ),
    );
    const platformContributions = evalLiteral(
        extractLiteral(
            readText('src/data/portfolio/contributions.ts'),
            'PLATFORM_CONTRIBUTIONS',
        ),
    );

    const displayName = String(personal.name || 'R John Victor').replace(
        /^R\s+/,
        'R. ',
    );

    const aboutP1 = template(dict.about.p1, {
        name: displayName,
        location: personal.location,
        years: personal.yearsExperience,
    });

    const skillLabel = dict.skills.categoryLabels;
    const skillLookup = Object.fromEntries(
        skills.map((s) => [s.categoryKey, s.items]),
    );

    const experienceBlock = experience
        .map((item) => {
            const details = get(dict, ['experience', 'items', item.id]);
            if (!details) return '';

            const lines = [
                `### ${item.company}`,
                `${details.role} (${item.period})`,
                '',
                'Career progression:',
                details.progression,
                '',
                'Key contributions:',
                renderBulletList(details.bullets),
            ];

            return lines.join('\n');
        })
        .filter(Boolean)
        .join('\n\n');

    const impactItems = achievementIds
        .map((id) => get(dict, ['achievements', 'items', id]))
        .filter(Boolean);

    const educationBlock = education
        .map((item) => {
            const details = get(dict, ['education', 'items', item.id]);
            if (!details) return null;
            const degree = details.degree || item.institution;
            const grade = details.grade ? ` (${details.grade})` : '';
            return `- ${degree} - ${item.institution}${grade}`;
        })
        .filter(Boolean)
        .join('\n');

    const featuredWorkBlock = featuredProjects
        .map((project, index) => {
            const content = get(dict, ['featuredWork', 'projects', project.id]);
            if (!content) return '';

            const titleSuffix = project.duration
                ? ` (${project.duration})`
                : '';
            const impact = Array.isArray(content.impact) ? content.impact : [];
            const intro = impact[0] || '';
            const highlights = impact.slice(1);

            const lines = [
                `### ${index + 1}) ${content.title}${titleSuffix}`,
                intro,
                '',
            ];

            if (highlights.length > 0) {
                lines.push('Highlights:');
                lines.push(renderBulletList(highlights));
                lines.push('');
            }

            if (
                Array.isArray(project.technologies) &&
                project.technologies.length > 0
            ) {
                lines.push('Tech:');
                lines.push(project.technologies.join(' • '));
                lines.push('');
            }

            if (
                Array.isArray(content.responsibilities) &&
                content.responsibilities.length > 0
            ) {
                lines.push('Role:');
                lines.push(content.responsibilities.join(' • '));
                lines.push('');
            }

            return lines.join('\n').trimEnd();
        })
        .filter(Boolean)
        .join('\n\n');

    const contributionsBlock = platformContributions
        .map((entry) => {
            const group = get(dict, [
                'technicalContributions',
                'groups',
                entry.id,
            ]);
            if (!group) return '';
            return `### ${group.title}\n${group.items.join(' • ')}`;
        })
        .filter(Boolean)
        .join('\n\n');

    const philosophyItems = Object.values(dict.philosophy.items || {}).map(
        (item) => `- ${item.title}: ${item.description}`,
    );

    const templatePath = 'templates/github-readme.template.md';
    const templateText = readText(templatePath);

    const output = renderTemplate(templateText, {
        AUTO_GENERATED_COMMENT:
            '<!-- AUTO-GENERATED FILE. Source: messages/en.json + src/data/portfolio/*.ts -->',
        HERO_GREETING_LINE: `${dict.hero.greeting} ${displayName}`,
        HERO_PROFILE_TITLE: dict.hero.profileTitle,
        HERO_TAGLINE: dict.hero.tagline,
        LINKEDIN_URL: personal.linkedin,
        GITHUB_URL: personal.github,
        EMAIL: personal.email,
        PORTFOLIO_URL: 'https://rjohnvictor.com',
        ABOUT_LABEL: dict.about.label,
        ABOUT_HEADING: dict.about.heading,
        ABOUT_P1: aboutP1,
        ABOUT_P2: dict.about.p2,
        ABOUT_P3: dict.about.p3,
        SKILLS_LABEL: dict.skills.label,
        SKILLS_HEADING: dict.skills.heading,
        SKILLS_FRONTEND_LABEL: skillLabel.frontend,
        SKILLS_FRONTEND_ITEMS: (skillLookup.frontend || []).join(' • '),
        SKILLS_BACKEND_LABEL: skillLabel.backend,
        SKILLS_BACKEND_ITEMS: (skillLookup.backend || []).join(' • '),
        SKILLS_CLOUD_LABEL: 'Cloud and DevOps',
        SKILLS_CLOUD_ITEMS: (skillLookup.cloudDevops || []).join(' • '),
        SKILLS_DATABASES_LABEL: skillLabel.databases,
        SKILLS_DATABASES_ITEMS: (skillLookup.databases || []).join(' • '),
        SKILLS_STATE_LABEL: 'State and APIs',
        SKILLS_STATE_ITEMS: (skillLookup.stateApis || []).join(' • '),
        SKILLS_INTERESTS_LABEL: skillLabel.interests,
        SKILLS_INTERESTS_ITEMS: (skillLookup.interests || []).join(' • '),
        EXPERIENCE_LABEL: dict.experience.label,
        EXPERIENCE_HEADING: dict.experience.heading,
        EXPERIENCE_BLOCK: experienceBlock,
        ACHIEVEMENTS_LABEL: dict.achievements.label,
        ACHIEVEMENTS_HEADING: dict.achievements.heading,
        ACHIEVEMENTS_ITEMS: renderBulletList(impactItems),
        EDUCATION_LABEL: dict.education.label,
        EDUCATION_HEADING: dict.education.heading,
        EDUCATION_BLOCK: educationBlock,
        FEATURED_WORK_LABEL: dict.featuredWork.label,
        FEATURED_WORK_HEADING: dict.featuredWork.heading,
        FEATURED_WORK_BLOCK: featuredWorkBlock,
        TECHNICAL_CONTRIBUTIONS_LABEL: dict.technicalContributions.label,
        TECHNICAL_CONTRIBUTIONS_HEADING: dict.technicalContributions.heading,
        TECHNICAL_CONTRIBUTIONS_BLOCK: contributionsBlock,
        MANIFESTO_LABEL: dict.manifesto.label,
        MANIFESTO_HEADING: dict.manifesto.heading,
        MANIFESTO_RESILIENCE_LABEL: dict.manifesto.resilience,
        MANIFESTO_RESILIENCE_BODY: dict.manifesto.resilienceBody,
        MANIFESTO_JOURNEY_LABEL: dict.manifesto.journey,
        MANIFESTO_JOURNEY_BODY: dict.manifesto.journeyBody,
        MANIFESTO_VISION_LABEL: dict.manifesto.vision,
        MANIFESTO_VISION_BODY: dict.manifesto.visionBody,
        PHILOSOPHY_LABEL: dict.philosophy.label,
        PHILOSOPHY_HEADING: dict.philosophy.heading,
        PHILOSOPHY_ITEMS: philosophyItems.join('\n'),
        BEYOND_CODE_LABEL: 'Beyond Code',
        BEYOND_CODE_HEADING: 'Beyond Code',
        BEYOND_CODE_TEXT:
            'Outside engineering, I enjoy mechanical watches, photography, fitness, and character-driven storytelling.',
        CONTACT_LABEL: dict.contact.label,
        CONTACT_HEADING: dict.contact.heading,
        CONTACT_LINKEDIN_URL: personal.linkedin,
        CONTACT_PORTFOLIO_URL: 'https://rjohnvictor.com',
        CONTACT_EMAIL: personal.email,
        CONTACT_GITHUB_URL: personal.github,
        FOOTER_TAGLINE: dict.hero.tagline,
    });

    const outFile = path.join(ROOT, 'GITHUB_README.md');
    const prev = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';

    if (process.argv.includes('--check')) {
        if (prev !== output) {
            console.error(
                'GITHUB_README.md is out of date. Run npm run generate:github-readme',
            );
            process.exit(1);
        }
        console.log('GITHUB_README.md is up to date.');
        return;
    }

    fs.writeFileSync(outFile, output, 'utf8');
    console.log('Generated GITHUB_README.md from en.json and portfolio data.');
}

main();
