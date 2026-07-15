'use client';

import { PERSONAL } from '@/data/portfolio/personal';
import type { Dictionary } from '@/types/dictionary';

interface Props {
    dict: Dictionary;
}

export default function Footer({ dict }: Props) {
    return (
        <footer
            style={{ borderTop: '1px solid var(--border)', padding: '2rem 0' }}
        >
            <div
                className="section-container"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <p
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-geist-mono)',
                    }}
                >
                    © {new Date().getFullYear()} {PERSONAL.name}
                </p>
                <p
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-geist-mono)',
                    }}
                >
                    {dict.footer.builtWith}
                </p>
            </div>
        </footer>
    );
}
