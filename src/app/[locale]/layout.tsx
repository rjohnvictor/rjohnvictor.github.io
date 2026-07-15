import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto, Exo_2, Lora } from 'next/font/google';
import localFont from 'next/font/local';
import '../globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { EnergyProvider } from '@/context/EnergyContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CursorManager from '@/components/CursorManager';
import ThemeEffects from '@/components/ThemeEffects';
import TerrainScene from '@/components/TerrainScene';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
const materialSymbols = localFont({
    src: '../../../public/fonts/MaterialSymbolsOutlined.ttf',
    variable: '--font-material-symbols',
    display: 'optional',
});

const BASE_URL = 'https://rjohnvictor.com';

const BRAND_NAME = 'R John Victor';
const SEO_TITLE =
    'R John Victor | Solutions Engineer | Full Stack, Platform & Cloud Engineer';
const DESCRIPTION =
    'R John Victor is a Solutions Engineer with 8+ years of experience building enterprise software, cloud-native platforms, and scalable full-stack applications using React, Next.js, NestJS, Go, AWS, Kubernetes, and TypeScript.';

export async function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'hi' }, { locale: 'ta' }];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    await params;
    const canonicalLocale = 'en';

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: SEO_TITLE,
            template: `%s | ${BRAND_NAME}`,
        },
        applicationName: BRAND_NAME,
        description: DESCRIPTION,
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/icon.png', type: 'image/png', sizes: '512x512' },
                { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
            ],
            shortcut: ['/favicon.ico'],
            apple: [
                {
                    url: '/apple-icon.png',
                    sizes: '180x180',
                    type: 'image/png',
                },
            ],
        },
        manifest: '/manifest.webmanifest',
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
            title: SEO_TITLE,
            description: DESCRIPTION,
            url: `${BASE_URL}/${canonicalLocale}`,
            siteName: BRAND_NAME,
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: SEO_TITLE,
            description: DESCRIPTION,
            creator: '@rjohnvictor',
        },
        alternates: {
            canonical: `${BASE_URL}/${canonicalLocale}`,
            languages: {
                en: `${BASE_URL}/en`,
                hi: `${BASE_URL}/hi`,
                ta: `${BASE_URL}/ta`,
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
    const supportedLocales = new Set(['en', 'hi', 'ta']);
    const lang = supportedLocales.has(locale) ? locale : 'en';

    return (
        <html
            lang={lang}
            data-theme="professional"
            className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${exo2.variable} ${lora.variable} ${materialSymbols.variable} h-full`}
            suppressHydrationWarning
        >
            <head>
                <meta
                    name="google-site-verification"
                    content="MxXAQCIeZFRhVIkCUqasbQ8GGaNNErFrLdM9LCVoc2s"
                />
                {/* Apply stored theme before React hydrates — prevents flash */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=localStorage.getItem('portfolio-theme');if(t&&['professional','power','zen'].includes(t)){document.documentElement.setAttribute('data-theme',t);}})();`,
                    }}
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
                            'jobTitle': 'Solutions Engineer',
                            'description': DESCRIPTION,
                            'knowsAbout': [
                                'React',
                                'Next.js',
                                'Angular',
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
                        <Analytics />
                        <SpeedInsights />
                    </EnergyProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
