import type { Medal, ProgressState } from '../types'

export const MEDALS: Medal[] = [
  {
    id: 'primera-palabra',
    name: 'Primera palabra',
    description: 'Ganaste tus primeros 10 XP.',
    icon: 'sparkles',
    tier: 'bronce',
    requirement: '10 XP',
  },
  {
    id: 'aprendiz',
    name: 'Aprendiz de voces',
    description: 'Completaste tu primera lección.',
    icon: 'book',
    tier: 'bronce',
    requirement: '1 lección',
  },
  {
    id: 'racha-3',
    name: 'Fuego de tres días',
    description: 'Mantuviste una racha de 3 días.',
    icon: 'flame',
    tier: 'plata',
    requirement: 'Racha de 3 días',
  },
  {
    id: 'explorador',
    name: 'Explorador de palabras',
    description: 'Descubriste 15 palabras del diccionario.',
    icon: 'compass',
    tier: 'plata',
    requirement: '15 palabras vistas',
  },
  {
    id: 'tejedor',
    name: 'Tejedor de lecciones',
    description: 'Completaste 4 lecciones.',
    icon: 'grid',
    tier: 'plata',
    requirement: '4 lecciones',
  },
  {
    id: 'dos-voces',
    name: 'Dos voces',
    description: 'Aprendiste con las dos lenguas disponibles.',
    icon: 'languages',
    tier: 'oro',
    requirement: '2 lenguas',
  },
  {
    id: 'cien',
    name: 'Cien palabras de aliento',
    description: 'Acumulaste 100 XP.',
    icon: 'award',
    tier: 'oro',
    requirement: '100 XP',
  },
  {
    id: 'sabio',
    name: 'Sabio del camino',
    description: 'Acumulaste 300 XP y una racha de 7 días.',
    icon: 'crown',
    tier: 'oro',
    requirement: '300 XP + racha 7',
  },
]

export function getEarnedMedalIds(state: ProgressState): string[] {
  const earned: string[] = []
  const completedLessons = Object.values(state.completedLessons).flat().length
  const languagesStudied = Object.values(state.completedLessons).filter(
    (lessons) => lessons.length > 0,
  ).length

  if (state.xp >= 10) earned.push('primera-palabra')
  if (completedLessons >= 1) earned.push('aprendiz')
  if (state.streak >= 3) earned.push('racha-3')
  if (state.seenWords.length >= 15) earned.push('explorador')
  if (completedLessons >= 4) earned.push('tejedor')
  if (languagesStudied >= 2) earned.push('dos-voces')
  if (state.xp >= 100) earned.push('cien')
  if (state.xp >= 300 && state.streak >= 7) earned.push('sabio')

  return earned
}
