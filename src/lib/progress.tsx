import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getEarnedMedalIds } from '../data/medals'
import { reviewSrsCard } from './srs'
import {
  createInitialProgress,
  loadProgress,
  normalizeProgress,
  saveProgress,
} from './storage'
import { dateKey, isYesterday } from './utils'
import type { DailyGoalOption, LanguageId, ProgressState } from '../types'

export interface LevelInfo {
  index: number
  title: string
  minXp: number
  nextXp: number | null
  progress: number
}

const LEVELS: Array<{ minXp: number; title: string }> = [
  { minXp: 0, title: 'Semilla' },
  { minXp: 50, title: 'Brote' },
  { minXp: 120, title: 'Raíz' },
  { minXp: 220, title: 'Árbol' },
  { minXp: 350, title: 'Ceiba' },
  { minXp: 500, title: 'Guardián de voces' },
  { minXp: 750, title: 'Tejedor de lenguas' },
  { minXp: 1000, title: 'Sabio del camino' },
]

export function getLevelInfo(xp: number): LevelInfo {
  let index = 0
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].minXp) index = i
  }
  const current = LEVELS[index]
  const next = LEVELS[index + 1] ?? null
  const progress = next
    ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))
    : 1
  return {
    index,
    title: current.title,
    minXp: current.minXp,
    nextXp: next?.minXp ?? null,
    progress,
  }
}

function daysBetween(prevKey: string, nextKey: string): number {
  const [py, pm, pd] = prevKey.split('-').map(Number)
  const [ny, nm, nd] = nextKey.split('-').map(Number)
  const a = new Date(py, (pm || 1) - 1, pd || 1).getTime()
  const b = new Date(ny, (nm || 1) - 1, nd || 1).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

interface ProgressContextValue {
  progress: ProgressState
  level: LevelInfo
  dailyGoal: DailyGoalOption
  earnedMedals: string[]
  addXp: (amount: number) => void
  completeLesson: (languageId: LanguageId, lessonId: string, xp: number) => boolean
  recordAnswer: (correct: boolean, wordId?: string) => void
  recordSrsReview: (wordId: string, remembered: boolean) => void
  markWordsSeen: (ids: string[]) => void
  setLastLanguage: (languageId: LanguageId) => void
  setDailyGoal: (goal: DailyGoalOption) => void
  importProgressJson: (raw: string) => boolean
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

/** Aplica XP, actualiza la racha diaria y usa protector de racha si faltaste 1 día. */
function withXp(state: ProgressState, amount: number): ProgressState {
  const today = dateKey()
  const newDay = state.dailyDate !== today
  let streak = state.streak
  let streakFreezes = state.streakFreezes

  if (newDay) {
    if (state.lastStudyDate && isYesterday(state.lastStudyDate, today)) {
      streak = Math.max(1, streak) + 1
      if (streak % 5 === 0 && streakFreezes < 3) {
        streakFreezes += 1
      }
    } else if (state.lastStudyDate === today) {
      streak = Math.max(1, streak)
    } else if (
      state.lastStudyDate &&
      daysBetween(state.lastStudyDate, today) === 2 &&
      streak > 0 &&
      streakFreezes > 0
    ) {
      // Protector de racha automático: salva la racha si solo faltaste un día.
      streakFreezes -= 1
      streak += 1
    } else {
      streak = 1
    }
  } else if (streak === 0) {
    streak = 1
  }

  return {
    ...state,
    xp: state.xp + amount,
    streak,
    streakFreezes,
    lastStudyDate: today,
    dailyXp: newDay ? amount : state.dailyXp + amount,
    dailyDate: today,
    totalSessions: state.totalSessions + (newDay ? 1 : 0),
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const earnedMedals = useMemo(() => getEarnedMedalIds(progress), [progress])

  useEffect(() => {
    setProgress((state) => {
      if (
        state.medals.length === earnedMedals.length &&
        state.medals.every((medal) => earnedMedals.includes(medal))
      ) {
        return state
      }
      return { ...state, medals: earnedMedals }
    })
  }, [earnedMedals])

  const addXp = useCallback((amount: number) => {
    if (amount <= 0) return
    setProgress((state) => withXp(state, amount))
  }, [])

  const completeLesson = useCallback(
    (languageId: LanguageId, lessonId: string, xp: number) => {
      const completed = progress.completedLessons[languageId] ?? []
      const wasNew = !completed.includes(lessonId)
      setProgress((state) => {
        const current = state.completedLessons[languageId] ?? []
        const isNew = !current.includes(lessonId)
        const nextState = isNew
          ? {
              ...state,
              completedLessons: {
                ...state.completedLessons,
                [languageId]: [...current, lessonId],
              },
            }
          : state
        return withXp(nextState, isNew ? xp : Math.max(2, Math.round(xp * 0.2)))
      })
      return wasNew
    },
    [progress.completedLessons],
  )

  const recordAnswer = useCallback((correct: boolean, wordId?: string) => {
    setProgress((state) => {
      const nextCards = wordId
        ? {
            ...state.cards,
            [wordId]: reviewSrsCard(state.cards[wordId], correct),
          }
        : state.cards
      return {
        ...state,
        correctAnswers: state.correctAnswers + (correct ? 1 : 0),
        totalAnswers: state.totalAnswers + 1,
        cards: nextCards,
      }
    })
  }, [])

  const recordSrsReview = useCallback((wordId: string, remembered: boolean) => {
    setProgress((state) => ({
      ...state,
      cards: {
        ...state.cards,
        [wordId]: reviewSrsCard(state.cards[wordId], remembered),
      },
    }))
  }, [])

  const markWordsSeen = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    setProgress((state) => {
      const merged = new Set(state.seenWords)
      ids.forEach((id) => merged.add(id))
      if (merged.size === state.seenWords.length) return state
      return { ...state, seenWords: Array.from(merged) }
    })
  }, [])

  const setLastLanguage = useCallback((languageId: LanguageId) => {
    setProgress((state) =>
      state.lastLanguage === languageId ? state : { ...state, lastLanguage: languageId },
    )
  }, [])

  const setDailyGoal = useCallback((goal: DailyGoalOption) => {
    setProgress((state) => (state.dailyGoal === goal ? state : { ...state, dailyGoal: goal }))
  }, [])

  const importProgressJson = useCallback((raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw) as Partial<ProgressState>
      if (!parsed || typeof parsed !== 'object') return false
      const normalized = normalizeProgress(parsed)
      setProgress(normalized)
      return true
    } catch {
      return false
    }
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(createInitialProgress())
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      level: getLevelInfo(progress.xp),
      dailyGoal: progress.dailyGoal,
      earnedMedals,
      addXp,
      completeLesson,
      recordAnswer,
      recordSrsReview,
      markWordsSeen,
      setLastLanguage,
      setDailyGoal,
      importProgressJson,
      resetProgress,
    }),
    [
      progress,
      earnedMedals,
      addXp,
      completeLesson,
      recordAnswer,
      recordSrsReview,
      markWordsSeen,
      setLastLanguage,
      setDailyGoal,
      importProgressJson,
      resetProgress,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress debe usarse dentro de ProgressProvider')
  return context
}
