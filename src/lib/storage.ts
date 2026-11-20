import type { DailyGoalOption, ProgressState } from '../types'

export const PROGRESS_STORAGE_KEY = 'bedea.progress.v1'
export const SCHEMA_VERSION = 2
export const DAILY_GOAL: DailyGoalOption = 30

export const DAILY_GOAL_OPTIONS: Array<{ xp: DailyGoalOption; label: string; minutes: string }> = [
  { xp: 30, label: 'Tranquilo', minutes: '5 min / día' },
  { xp: 50, label: 'Constante', minutes: '10 min / día' },
  { xp: 80, label: 'Intenso', minutes: '15 min / día' },
]

export function createInitialProgress(): ProgressState {
  return {
    schemaVersion: SCHEMA_VERSION,
    xp: 0,
    streak: 0,
    streakFreezes: 1,
    dailyGoal: DAILY_GOAL,
    lastStudyDate: null,
    dailyXp: 0,
    dailyDate: '',
    completedLessons: { embera: [], wayuunaiki: [] },
    seenWords: [],
    cards: {},
    correctAnswers: 0,
    totalAnswers: 0,
    medals: [],
    lastLanguage: 'embera',
    totalSessions: 0,
  }
}

export function normalizeProgress(parsed: Partial<ProgressState> | null | undefined): ProgressState {
  const initial = createInitialProgress()
  if (!parsed || typeof parsed !== 'object') return initial
  const goal = parsed.dailyGoal === 50 || parsed.dailyGoal === 80 ? parsed.dailyGoal : 30
  return {
    ...initial,
    ...parsed,
    schemaVersion: SCHEMA_VERSION,
    dailyGoal: goal,
    streakFreezes:
      typeof parsed.streakFreezes === 'number' && parsed.streakFreezes >= 0
        ? Math.min(3, parsed.streakFreezes)
        : initial.streakFreezes,
    completedLessons: {
      ...initial.completedLessons,
      ...(parsed.completedLessons ?? {}),
    },
    seenWords: Array.isArray(parsed.seenWords) ? parsed.seenWords : [],
    cards: parsed.cards && typeof parsed.cards === 'object' ? parsed.cards : {},
    medals: Array.isArray(parsed.medals) ? parsed.medals : [],
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return createInitialProgress()
    return normalizeProgress(JSON.parse(raw) as Partial<ProgressState>)
  } catch {
    return createInitialProgress()
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Si localStorage no está disponible, la app sigue funcionando en memoria.
  }
}

export function loadBrandId(): string | null {
  try {
    return window.localStorage.getItem('bedea.brand.v1')
  } catch {
    return null
  }
}

export function saveBrandId(id: string): void {
  try {
    window.localStorage.setItem('bedea.brand.v1', id)
  } catch {
    // Silencioso: la preferencia es opcional.
  }
}
