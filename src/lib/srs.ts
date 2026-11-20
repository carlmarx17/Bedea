import type { SrsCardState } from '../types'
import { dateKey } from './utils'

function addDays(baseDateKey: string, days: number): string {
  const [y, m, d] = baseDateKey.split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, (d || 1) + days)
  return dateKey(date)
}

/**
 * Algoritmo SM-2 simplificado para repetición espaciada.
 * quality: 1 = fallé / otra vez, 4 = bien / recordada.
 */
export function reviewSrsCard(
  previous: SrsCardState | undefined,
  remembered: boolean,
  today = dateKey(),
): SrsCardState {
  const prevEase = previous?.easeFactor ?? 2.5
  const prevReps = previous?.reps ?? 0
  const prevInterval = previous?.interval ?? 0
  const prevLapses = previous?.lapses ?? 0

  if (!remembered) {
    return {
      due: today,
      interval: 1,
      easeFactor: Math.max(1.3, Number((prevEase - 0.2).toFixed(2))),
      reps: 0,
      lapses: prevLapses + 1,
      lastResult: 'again',
    }
  }

  const nextReps = prevReps + 1
  let nextInterval = 1
  if (nextReps === 1) nextInterval = 1
  else if (nextReps === 2) nextInterval = 3
  else nextInterval = Math.max(4, Math.round(prevInterval * prevEase))

  const nextEase = Math.min(2.8, Number((prevEase + 0.08).toFixed(2)))

  return {
    due: addDays(today, nextInterval),
    interval: nextInterval,
    easeFactor: nextEase,
    reps: nextReps,
    lapses: prevLapses,
    lastResult: 'good',
  }
}

/** Devuelve los IDs de palabras vencidas hoy o antes para repaso espaciado. */
export function getDueWordIds(
  cards: Record<string, SrsCardState>,
  allowedWordIds: Set<string>,
  today = dateKey(),
): string[] {
  return Object.entries(cards)
    .filter(([id, card]) => allowedWordIds.has(id) && card.due <= today)
    .sort((a, b) => a[1].due.localeCompare(b[1].due))
    .map(([id]) => id)
}

/** Devuelve los IDs de palabras con fallos registrados, ordenadas por mayor dificultad. */
export function getMistakeWordIds(
  cards: Record<string, SrsCardState>,
  allowedWordIds: Set<string>,
): string[] {
  return Object.entries(cards)
    .filter(([id, card]) => allowedWordIds.has(id) && (card.lapses > 0 || card.lastResult === 'again'))
    .sort((a, b) => b[1].lapses - a[1].lapses)
    .map(([id]) => id)
}
