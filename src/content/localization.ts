import en from './locales/en.json';
import ru from './locales/ru.json';
import type { Locale, TranslationTable } from '../shared/types';

const tables: Record<Locale, TranslationTable> = {
  en,
  ru,
};

export function getLocaleTable(locale: Locale): TranslationTable {
  return tables[locale];
}

