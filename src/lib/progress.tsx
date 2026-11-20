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
import { DAILY_GOAL, createInitialProgress, loadProgress, saveProgress } from './storage'
import { dateKey, isYesterday } from './utils'
import type { LanguageId, ProgressState } from '../types'

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

interface ProgressContextValue {
  progress: ProgressState
  level: LevelInfo
  dailyGoal: number
  earnedMedals: string[]
  addXp: (amount: number) => void
  completeLesson: (languageId: LanguageId, lessonId: string, xp: number) => boolean
  recordAnswer: (correct: boolean) => void
  markWordsSeen: (ids: string[]) => void
  setLastLanguage: (languageId: LanguageId) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

/** Aplica XP y actualiza la racha diaria de forma consistente. */
function withXp(state: ProgressState, amount: number): ProgressState {
  const today = dateKey()
  const newDay = state.dailyDate !== today
  let streak = state.streak

  if (newDay) {
    if (state.lastStudyDate && isYesterday(state.lastStudyDate, today)) {
      streak = Math.max(1, streak) + 1
    } else if (state.lastStudyDate === today) {
      streak = Math.max(1, streak)
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
    lastStudyDate: today,
    dailyXp: newDay ? amount : state.dailyXp + amount,
    dailyDate: today,
    totalSessions: state.totalSessions + (newDay ? 1 : 0),
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  // Persistencia inmediata: toda mutación se guarda en localStorage.
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const earnedMedals = useMemo(() => getEarnedMedalIds(progress), [progress])

  // Mantiene el campo medals sincronizado con los logros calculados.
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
        // La primera vez se gana el XP completo; repetir da un pequeño refuerzo.
        return withXp(nextState, isNew ? xp : Math.max(2, Math.round(xp * 0.2)))
      })
      return wasNew
    },
    [progress.completedLessons],
  )

  const recordAnswer = useCallback((correct: boolean) => {
    setProgress((state) => ({
      ...state,
      correctAnswers: state.correctAnswers + (correct ? 1 : 0),
      totalAnswers: state.totalAnswers + 1,
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

  const resetProgress = useCallback(() => {
    setProgress(createInitialProgress())
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      level: getLevelInfo(progress.xp),
      dailyGoal: DAILY_GOAL,
      earnedMedals,
      addXp,
      completeLesson,
      recordAnswer,
      markWordsSeen,
      setLastLanguage,
      resetProgress,
    }),
    [
      progress,
      earnedMedals,
      addXp,
      completeLesson,
      recordAnswer,
      markWordsSeen,
      setLastLanguage,
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
