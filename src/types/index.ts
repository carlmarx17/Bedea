/**
 * Tipos compartidos de Bedea.
 * El modelo está preparado para añadir nuevas lenguas sin tocar los componentes:
 * basta con agregar metadatos en `languages.ts`, entradas en `vocabulary.json`
 * y un currículo en `curriculum.ts`.
 */

export type LanguageId = string

export type CategoryId =
  | 'saludos'
  | 'familia'
  | 'numeros'
  | 'naturaleza'
  | 'animales'
  | 'casa'
  | 'cuerpo'
  | 'verbos'
  | 'frases'
  | 'cualidades'

export type SourceKind = 'manual' | 'complemento'

export interface VocabularyEntry {
  id: string
  language: LanguageId
  category: CategoryId
  palabra_nativa: string
  traduccion_espanol: string
  guia_fonetica: string
  ejemplo_uso: string
  ejemplo_traduccion: string
  nota_cultural: string
  audio_url: string | null
  source: SourceKind
  source_detail: string
  tags?: string[]
}

export interface LanguageInfo {
  id: LanguageId
  name: string
  nativeName: string
  family: string
  region: string
  speakers: string
  description: string
  community: string
  greeting: string
  greetingTranslation: string
  status: 'available' | 'soon'
  accent: 'embera' | 'wayuu' | 'nasa' | 'kogui' | 'tikuna'
  sourceNote: string
  caution?: string
}

export interface CategoryInfo {
  id: CategoryId
  label: string
  shortLabel: string
  description: string
  icon: string
  accent: string
}

export interface LessonConfig {
  id: string
  language: LanguageId
  category: CategoryId
  unitId: string
  title: string
  subtitle: string
  description: string
  xp: number
}

export interface UnitConfig {
  id: string
  title: string
  subtitle: string
  lessonIds: string[]
}

export interface Curriculum {
  languageId: LanguageId
  units: UnitConfig[]
  lessons: LessonConfig[]
}

export interface SentenceExercise {
  id: string
  language: LanguageId
  tokens: string[]
  translation: string
  hint: string
  source: string
}

export interface CultureCapsule {
  id: string
  language: LanguageId
  category: string
  title: string
  body: string
  keyword: string
  keywordTranslation: string
  icon: string
  source: string
}

export interface Medal {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronce' | 'plata' | 'oro'
  requirement: string
}

export interface ProgressState {
  xp: number
  streak: number
  lastStudyDate: string | null
  dailyXp: number
  dailyDate: string
  completedLessons: Record<LanguageId, string[]>
  seenWords: string[]
  correctAnswers: number
  totalAnswers: number
  medals: string[]
  lastLanguage: LanguageId
  totalSessions: number
}

export type PracticeMode = 'flashcards' | 'quiz' | 'match' | 'sentence'

export interface BrandPreset {
  id: string
  name: string
  subtitle: string
  tagline: string
  logoSymbol: 'woven' | 'spiral' | 'leaf'
  monogram: string
  description: string
}
