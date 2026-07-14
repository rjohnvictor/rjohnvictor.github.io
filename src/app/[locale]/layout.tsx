import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto, Exo_2, Lora } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { EnergyProvider } from '@/context/EnergyContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CursorManager from '@/components/CursorManager';
import ThemeEffects from '@/components/ThemeEffects';
import TerrainScene from '@/components/TerrainScene';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});
const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
});
const exo2 = Exo_2({ variable: '--font-exo2', subsets: ['latin'] });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'] });

const BASE_URL = 'https://rjohnvictor.com';

const TITLE = 'R John Victor — Full Stack Engineer';
const DESCRIPTION =
    'Full Stack Software Engineer with ~8 years of experience building scalable web applications, cloud-native systems, and developer platforms using React, Next.js, Node.js, AWS, and Kubernetes.';

export async function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'es' }];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: TITLE,
            template: '%s | R John Victor',
        },
        description: DESCRIPTION,
        keywords: [
            'Full Stack Engineer',
            'React',
            'Next.js',
            'Node.js',
            'TypeScript',
            'AWS',
            'Kubernetes',
            'NestJS',
            'Go',
            'Golang',
            'Software Engineer',
            'India',
            'Bangalore',
            'Web Developer',
            'Cloud Engineer',
        ],
        authors: [{ name: 'R John Victor', url: BASE_URL }],
        creator: 'R John Victor',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                'index': true,
                'follow': true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: TITLE,
            description: DESCRIPTION,
            url: `${BASE_URL}/${locale}`,
            siteName: 'R John Victor',
            locale: locale === 'es' ? 'es_ES' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: TITLE,
            description: DESCRIPTION,
            creator: '@rjohnvictor',
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}`,
            languages: {
                en: `${BASE_URL}/en`,
                es: `${BASE_URL}/es`,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <html
            lang={locale}
            data-theme="professional"
            className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${exo2.variable} ${lora.variable} h-full`}
            suppressHydrationWarning
        >
            <head>
                {/* Apply stored theme before React hydrates — prevents flash */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=localStorage.getItem('portfolio-theme');if(t&&['professional','power','zen'].includes(t)){document.documentElement.setAttribute('data-theme',t);}})();`,
                    }}
                />
                {/* Material Symbols for theme switcher */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                />
                {/* JSON-LD structured data — Person schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            'name': 'R John Victor',
                            'url': BASE_URL,
                            'jobTitle': 'Full Stack Software Engineer',
                            'description': DESCRIPTION,
                            'knowsAbout': [
                                'React',
                                'Next.js',
                                'TypeScript',
                                'Node.js',
                                'NestJS',
                                'Go',
                                'AWS',
                                'Kubernetes',
                                'Docker',
                                'PostgreSQL',
                            ],
                            'address': {
                                '@type': 'PostalAddress',
                                'addressLocality': 'Bangalore',
                                'addressCountry': 'IN',
                            },
                            'sameAs': [
                                'https://github.com/rjohnvictor',
                                'https://linkedin.com/in/rjohnvictor',
                            ],
                        }),
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <EnergyProvider>
                        <ThemeEffects />
                        <CursorManager />
                        <TerrainScene />
                        {children}
                        <ThemeSwitcher />
                    </EnergyProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
