export const PERSONAL = {
    name: 'R John Victor',
    title: 'Full Stack Software Engineer',
    tagline: 'Building things that stand the test of time.',
    location: 'India',
    yearsExperience: 8,
    email: 'johnvictor2406@gmail.com',
    github: 'https://github.com/rjohnvictor',
    linkedin: 'https://www.linkedin.com/in/r-john-victor-295a6382',
    summary:
        'Full Stack Engineer with ~8 years building scalable web applications, cloud-native systems, and developer platforms. I care about clean architecture, performance, and software that lasts.',
};

export const SKILLS = [
    {
        category: 'Frontend',
        items: [
            'React',
            'Next.js',
            'Angular',
            'TypeScript',
            'JavaScript',
            'HTML5',
            'CSS3',
            'MUI',
        ],
    },
    {
        category: 'Backend',
        items: ['Node.js', 'NestJS', 'Express', 'Golang', 'Python'],
    },
    {
        category: 'Cloud & DevOps',
        items: [
            'AWS',
            'Docker',
            'Kubernetes',
            'Terraform',
            'GitHub Actions',
            'CI/CD',
            'OIDC',
            'Linux',
        ],
    },
    {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MongoDB'],
    },
    {
        category: 'State & APIs',
        items: [
            'Zustand',
            'TanStack Query',
            'REST APIs',
            'Auth & Authorization',
        ],
    },
    {
        category: 'Interests',
        items: [
            'AI / LLMs',
            'RAG',
            'LangChain',
            'Platform Engineering',
            'Distributed Systems',
        ],
    },
];

export const EXPERIENCE = [
    {
        role: 'Full Stack Engineer',
        company: 'Meltwater',
        period: 'Present',
        bullets: [
            'Build enterprise React/Next.js applications used by large-scale media analytics customers.',
            'Design and deliver backend APIs with NestJS and Node.js deployed on AWS and Kubernetes.',
            'Architected a Network Graph Widget with D3 force-directed layout, Leiden community detection, and sentiment overlays over enterprise-scale datasets.',
            'Drive CI/CD pipeline improvements, reducing deployment cycle time and increasing reliability.',
            'Mentor interns and contribute to architecture decisions across the team.',
        ],
    },
];

export const PROJECTS = [
    {
        title: 'Network Graph Widget',
        description:
            'Interactive D3 force-directed graph integrated into a Unified Search platform. Visualizes entity relationships at enterprise scale with community detection, sentiment overlays, and theme-based clustering.',
        tech: ['React', 'D3.js', 'TypeScript', 'Node.js', 'NestJS'],
        highlights: [
            'Leiden community detection algorithm',
            'Pattern-based and theme-based clustering',
            'Sentiment overlay visualization',
            'Optimized for enterprise-scale datasets',
            'Smooth React integration with performance tuning',
        ],
        type: 'Data Visualization',
    },
    {
        title: 'Enterprise Full-Stack Platform',
        description:
            'Large-scale web application serving media analytics workflows. Built with Next.js App Router on the frontend and NestJS microservices on the backend, deployed across AWS infrastructure.',
        tech: [
            'Next.js',
            'NestJS',
            'AWS',
            'PostgreSQL',
            'Docker',
            'Kubernetes',
        ],
        highlights: [
            'Next.js App Router with server components',
            'NestJS microservices backend',
            'AWS EKS Kubernetes deployment',
            'Terraform infrastructure-as-code',
            'GitHub Actions CI/CD pipelines',
        ],
        type: 'Enterprise Application',
    },
    {
        title: 'Cloud Infrastructure Automation',
        description:
            'Terraform modules and GitHub Actions workflows enabling zero-downtime deployments to AWS EKS. Includes OIDC-based authentication, automated rollback, and environment promotion gates.',
        tech: [
            'Terraform',
            'AWS EKS',
            'GitHub Actions',
            'OIDC',
            'Kubernetes',
            'Helm',
        ],
        highlights: [
            'OIDC-based keyless AWS authentication',
            'Automated rollback on health check failure',
            'Multi-environment promotion gates',
            'Reusable Terraform module library',
            'Reduced deployment time significantly',
        ],
        type: 'DevOps / Platform',
    },
];

export const PHILOSOPHY = [
    {
        title: 'Clean Architecture',
        description:
            'Separation of concerns at every layer. Business logic should never bleed into transport or persistence layers.',
    },
    {
        title: 'Type Safety',
        description:
            'TypeScript end-to-end. Types are documentation that the compiler enforces.',
    },
    {
        title: 'Performance by Design',
        description:
            'Optimize at the right level — algorithm before cache, cache before hardware. Profile first, optimize second.',
    },
    {
        title: 'Developer Experience',
        description:
            'Good DX multiplies team output. CI pipelines, tooling, and documentation matter as much as features.',
    },
    {
        title: 'Maintainability Over Cleverness',
        description:
            'Code is read far more than it is written. Clear, boring code outlasts clever code.',
    },
    {
        title: 'Test What Matters',
        description:
            'Test behavior, not implementation. Integration tests over mocks for critical paths.',
    },
];

export const TECH_STACK = {
    Frontend: [
        'React',
        'Next.js',
        'Angular',
        'TypeScript',
        'Tailwind CSS',
        'MUI',
    ],
    Backend: ['Node.js', 'NestJS', 'Golang', 'Python', 'Express'],
    Cloud: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    DevOps: ['GitHub Actions', 'CI/CD', 'OIDC', 'Linux', 'systemd'],
    Data: ['PostgreSQL', 'MySQL', 'MongoDB'],
    Tooling: ['Git', 'Zustand', 'TanStack Query', 'ESLint', 'Vitest'],
};
