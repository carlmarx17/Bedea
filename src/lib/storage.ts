import type { ProgressState } from '../types'

export const PROGRESS_STORAGE_KEY = 'bedea.progress.v1'
export const DAILY_GOAL = 30

export function createInitialProgress(): ProgressState {
  return {
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    dailyXp: 0,
    dailyDate: '',
    completedLessons: { embera: [], wayuunaiki: [] },
    seenWords: [],
    correctAnswers: 0,
    totalAnswers: 0,
    medals: [],
    lastLanguage: 'embera',
    totalSessions: 0,
  }
}

export function loadProgress(): ProgressState {
  const initial = createInitialProgress()
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      ...initial,
      ...parsed,
      completedLessons: {
        ...initial.completedLessons,
        ...(parsed.completedLessons ?? {}),
      },
      seenWords: Array.isArray(parsed.seenWords) ? parsed.seenWords : [],
      medals: Array.isArray(parsed.medals) ? parsed.medals : [],
    }
  } catch {
    return initial
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
