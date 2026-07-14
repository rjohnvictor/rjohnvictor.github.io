import type { Dictionary } from '@/types/dictionary';
import en from '../../../messages/en.json';

const dictionaries: Record<string, Dictionary> = {
    en: en as Dictionary,
};

export async function getDictionary(locale: string): Promise<Dictionary> {
    return dictionaries[locale] ?? dictionaries.en;
}
