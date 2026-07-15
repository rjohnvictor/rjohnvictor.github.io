'use client';

import { PERSONAL } from '@/data/portfolio/personal';
import type { Dictionary } from '@/types/dictionary';
import styles from './Footer.module.css';

interface Props {
    dict: Dictionary;
}

export default function Footer({ dict }: Props) {
    return (
        <footer className={styles.footer}>
            <div className={`section-container ${styles.content}`}>
                <p className={styles.meta}>
                    © {new Date().getFullYear()} {PERSONAL.name}
                </p>
                <p className={styles.meta}>{dict.footer.builtWith}</p>
            </div>
        </footer>
    );
}
