import type { Dictionary } from '@/types/dictionary';
import en from '../../../messages/en.json';
import hi from '../../../messages/hi.json';
import ta from '../../../messages/ta.json';

const dictionaries: Record<string, Dictionary> = {
    en: en as Dictionary,
    hi: hi as Dictionary,
    ta: ta as Dictionary,
};

export async function getDictionary(locale: string): Promise<Dictionary> {
    return dictionaries[locale] ?? dictionaries.en;
}
