import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'R John Victor',
        short_name: 'RJV',
        description:
            'R John Victor is a Solutions Engineer with 8+ years of experience building enterprise software, cloud-native platforms, and scalable full-stack applications using React, Next.js, NestJS, Go, AWS, Kubernetes, and TypeScript.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0f19',
        theme_color: '#0b0f19',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
