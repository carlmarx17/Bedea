import vocabularyData from '../data/vocabulary.json'
import type { CategoryId, LanguageId, VocabularyEntry } from '../types'
import { dailyIndex, normalizeText, sample, shuffle } from './utils'

/**
 * Capa de acceso al léxico. Toda la app consulta el vocabulario por aquí,
 * de modo que añadir una lengua nueva solo requiere ampliar vocabulary.json.
 */
export const VOCABULARY = (vocabularyData.entries as VocabularyEntry[]) ?? []
export const VOCABULARY_META = vocabularyData.meta

export function getWords(languageId: LanguageId, categoryId?: CategoryId): VocabularyEntry[] {
  return VOCABULARY.filter(
    (entry) =>
      entry.language === languageId && (!categoryId || entry.category === categoryId),
  )
}

export function getEntry(id: string): VocabularyEntry | undefined {
  return VOCABULARY.find((entry) => entry.id === id)
}

export function countWords(languageId: LanguageId, categoryId?: CategoryId): number {
  return getWords(languageId, categoryId).length
}

export interface DictionaryFilters {
  query?: string
  language?: LanguageId | 'todas'
  category?: CategoryId | 'todas'
  source?: 'manual' | 'complemento' | 'todas'
}

export function searchWords(filters: DictionaryFilters): VocabularyEntry[] {
  const query = normalizeText(filters.query ?? '')
  return VOCABULARY.filter((entry) => {
    if (filters.language && filters.language !== 'todas' && entry.language !== filters.language) {
      return false
    }
    if (filters.category && filters.category !== 'todas' && entry.category !== filters.category) {
      return false
    }
    if (filters.source && filters.source !== 'todas' && entry.source !== filters.source) {
      return false
    }
    if (!query) return true
    const haystack = normalizeText(
      [
        entry.palabra_nativa,
        entry.traduccion_espanol,
        entry.guia_fonetica,
        entry.ejemplo_uso,
        entry.ejemplo_traduccion,
        entry.nota_cultural,
        ...(entry.tags ?? []),
      ].join(' '),
    )
    return query.split(' ').every((token) => haystack.includes(token))
  })
}

/** Categorías presentes en una lengua, con su conteo de palabras. */
export function getLanguageCategoryCounts(languageId: LanguageId): Record<string, number> {
  return getWords(languageId).reduce<Record<string, number>>((counts, entry) => {
    counts[entry.category] = (counts[entry.category] ?? 0) + 1
    return counts
  }, {})
}

export function getWordOfTheDay(languageId: LanguageId): VocabularyEntry | undefined {
  const words = getWords(languageId)
  if (words.length === 0) return undefined
  return words[dailyIndex(words.length)]
}

/** Opciones únicas para preguntas de selección múltiple. */
export function buildTranslationOptions(entry: VocabularyEntry, count = 4): string[] {
  const pool = getWords(entry.language).filter(
    (candidate) =>
      candidate.id !== entry.id &&
      normalizeText(candidate.traduccion_espanol) !== normalizeText(entry.traduccion_espanol),
  )
  const sameCategory = pool.filter((candidate) => candidate.category === entry.category)
  const preferred = sample(sameCategory.length >= count - 1 ? sameCategory : pool, count - 1)
  const options = [entry.traduccion_espanol, ...preferred.map((word) => word.traduccion_espanol)]
  return shuffle(Array.from(new Set(options)))
}

/** Opciones únicas de palabras nativas, para preguntar en la dirección inversa. */
export function buildNativeOptions(entry: VocabularyEntry, count = 4): string[] {
  const pool = getWords(entry.language).filter(
    (candidate) =>
      candidate.id !== entry.id &&
      normalizeText(candidate.palabra_nativa) !== normalizeText(entry.palabra_nativa),
  )
  const sameCategory = pool.filter((candidate) => candidate.category === entry.category)
  const preferred = sample(sameCategory.length >= count - 1 ? sameCategory : pool, count - 1)
  const options = [entry.palabra_nativa, ...preferred.map((word) => word.palabra_nativa)]
  return shuffle(Array.from(new Set(options)))
}

/** Pares para el juego de emparejar: palabra nativa y su traducción. */
export function buildMatchPairs(languageId: LanguageId, count = 6): VocabularyEntry[] {
  return sample(getWords(languageId), count)
}
