import { ImageResponse } from 'next/og';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background:
                    'linear-gradient(135deg, #0b1020 0%, #111827 45%, #1d4ed8 100%)',
                color: '#f8fafc',
                padding: '64px',
                fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
            }}
        >
            <div
                style={{
                    fontSize: 34,
                    letterSpacing: '0.08em',
                    opacity: 0.9,
                }}
            >
                RJOHNVICTOR.COM
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                }}
            >
                <div
                    style={{
                        fontSize: 72,
                        lineHeight: 1.1,
                        fontWeight: 700,
                        maxWidth: '90%',
                    }}
                >
                    R John Victor
                </div>
                <div
                    style={{
                        fontSize: 34,
                        lineHeight: 1.35,
                        opacity: 0.95,
                        maxWidth: '95%',
                    }}
                >
                    Solutions Engineer | Full Stack, Platform and Cloud Engineer
                </div>
            </div>

            <div
                style={{
                    fontSize: 28,
                    opacity: 0.85,
                    letterSpacing: '0.02em',
                }}
            >
                React • Next.js • NestJS • Go • AWS • Kubernetes • TypeScript
            </div>
        </div>,
        {
            ...size,
        },
    );
}
