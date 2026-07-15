export interface Dictionary {
    nav: {
        about: string;
        skills: string;
        experience: string;
        achievements: string;
        education: string;
        featuredWork: string;
        technicalContributions: string;
        projects: string;
        contact: string;
    };
    hero: {
        greeting: string;
        tagline: string;
        profileTitle: string;
        summary: string;
        viewProjects: string;
        getInTouch: string;
        yearsExperience: string;
        coreStack: string;
        basedIn: string;
        scroll: string;
        stats: Record<string, string>;
    };
    about: {
        label: string;
        heading: string;
        p1: string;
        p2: string;
        p3: string;
        quickFacts: string;
        factExperience: string;
        factLocation: string;
        factSpecialization: string;
        factCurrentFocus: string;
        factOpenTo: string;
        factExperienceValue: string;
        factSpecializationValue: string;
        factCurrentFocusValue: string;
        factOpenToValue: string;
        quickFactItems: Record<string, { label: string; value: string }>;
        openToRoles: Record<string, string>;
        githubContributions: string;
        profileCard: {
            labels: {
                experience: string;
                role: string;
                hobbies: string;
            };
            yearsSuffix: string;
            values: Record<string, string>;
        };
        github: string;
        linkedin: string;
    };
    skills: {
        label: string;
        heading: string;
        subtitle: string;
        workSpans: string;
        categoryLabels: Record<string, string>;
        spanItems: Record<string, string>;
    };
    experience: {
        label: string;
        heading: string;
        items: Record<
            string,
            {
                role: string;
                progression?: string;
                bullets: string[];
            }
        >;
    };
    achievements: {
        label: string;
        heading: string;
        subtitle: string;
        items: Record<string, string>;
    };
    education: {
        label: string;
        heading: string;
        items: Record<
            string,
            {
                degree: string;
                grade?: string;
                notes?: string[];
            }
        >;
    };
    featuredWork: {
        label: string;
        heading: string;
        subtitle: string;
        whyItMatters: string;
        technologiesLabel: string;
        responsibilitiesLabel: string;
        projects: Record<
            string,
            {
                title: string;
                category: string;
                impact: string[];
                responsibilities?: string[];
            }
        >;
    };
    technicalContributions: {
        label: string;
        heading: string;
        subtitle: string;
        groups: Record<
            string,
            {
                title: string;
                items: string[];
            }
        >;
    };
    projects: {
        label: string;
        heading: string;
        subtitle: string;
        highlights: string;
        items: Record<
            string,
            {
                title: string;
                description: string;
                highlights: string[];
                type: string;
            }
        >;
    };
    manifesto: {
        label: string;
        heading: string;
        resilience: string;
        resilienceBody: string;
        journey: string;
        journeyBody: string;
        vision: string;
        visionBody: string;
    };
    philosophy: {
        label: string;
        heading: string;
        subtitle: string;
        items: Record<
            string,
            {
                title: string;
                description: string;
            }
        >;
    };
    techStack: {
        label: string;
        heading: string;
        categoryLabels: Record<string, string>;
    };
    contact: {
        label: string;
        heading: string;
        body: string;
        sendEmail: string;
        linkedin: string;
        github: string;
    };
    footer: {
        builtWith: string;
    };
}
