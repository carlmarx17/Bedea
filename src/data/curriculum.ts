import type { Curriculum, LessonConfig, UnitConfig } from '../types'

/**
 * Currículo por lengua. Cada lección apunta a una categoría del léxico.
 * Añadir una lengua nueva = añadir su bloque aquí + entradas en vocabulary.json.
 */

const emberaUnits: UnitConfig[] = [
  {
    id: 'emb-u1',
    title: 'Primeras voces',
    subtitle: 'Saludos, familia y números para empezar a nombrar el mundo.',
    lessonIds: ['emb-l-saludos', 'emb-l-familia', 'emb-l-numeros'],
  },
  {
    id: 'emb-u2',
    title: 'La tierra que habla',
    subtitle: 'Territorio, animales y objetos cotidianos.',
    lessonIds: ['emb-l-naturaleza', 'emb-l-animales', 'emb-l-casa'],
  },
  {
    id: 'emb-u3',
    title: 'Cuerpo y acción',
    subtitle: 'El cuerpo, los verbos y la vida en movimiento.',
    lessonIds: ['emb-l-cuerpo', 'emb-l-verbos'],
  },
  {
    id: 'emb-u4',
    title: 'La palabra en uso',
    subtitle: 'Frases del manual y palabras para describir.',
    lessonIds: ['emb-l-frases', 'emb-l-cualidades'],
  },
]

const emberaLessons: LessonConfig[] = [
  {
    id: 'emb-l-saludos',
    language: 'embera',
    category: 'saludos',
    unitId: 'emb-u1',
    title: 'Saludos que abren camino',
    subtitle: 'mãe · sakabuma · saka ewarisma',
    description: 'Aprende a saludar y a preguntar cómo está alguien.',
    xp: 20,
  },
  {
    id: 'emb-l-familia',
    language: 'embera',
    category: 'familia',
    unitId: 'emb-u1',
    title: 'La casa de la palabra',
    subtitle: 'chácha · táta · wár · ãba',
    description: 'Nombra a la familia y a las personas que sostienen la comunidad.',
    xp: 25,
  },
  {
    id: 'emb-l-numeros',
    language: 'embera',
    category: 'numeros',
    unitId: 'emb-u1',
    title: 'Contar con las manos',
    subtitle: 'áɓa · omê · õbéa · kimârê',
    description: 'Los primeros números y cantidades para contar y repartir.',
    xp: 20,
  },
  {
    id: 'emb-l-naturaleza',
    language: 'embera',
    category: 'naturaleza',
    unitId: 'emb-u2',
    title: 'Ríos, tierra y canasto',
    subtitle: 'rúa · ɓá · ẽ · ó',
    description: 'Palabras del territorio, el agua y los caminos.',
    xp: 30,
  },
  {
    id: 'emb-l-animales',
    language: 'embera',
    category: 'animales',
    unitId: 'emb-u2',
    title: 'Vecinos del monte',
    subtitle: 'opóa · yerré · ĩchúr',
    description: 'Animales que habitan los relatos y la vida cotidiana.',
    xp: 25,
  },
  {
    id: 'emb-l-casa',
    language: 'embera',
    category: 'casa',
    unitId: 'emb-u2',
    title: 'Objetos de cada día',
    subtitle: 'dé · chóko · chíko · ẽ',
    description: 'La casa, la cocina y los objetos que se comparten.',
    xp: 25,
  },
  {
    id: 'emb-l-cuerpo',
    language: 'embera',
    category: 'cuerpo',
    unitId: 'emb-u3',
    title: 'El cuerpo recuerda',
    subtitle: 'bóro · dáu · kώrɯ · iɗúɓa',
    description: 'Nombra el cuerpo y descubre cómo se componen sus palabras.',
    xp: 30,
  },
  {
    id: 'emb-l-verbos',
    language: 'embera',
    category: 'verbos',
    unitId: 'emb-u3',
    title: 'Verbos para hacer',
    subtitle: 'kó · w’ã · beɗeay · kũrisiay',
    description: 'Comer, ir, hablar y pensar: acciones que sostienen la vida.',
    xp: 30,
  },
  {
    id: 'emb-l-frases',
    language: 'embera',
    category: 'frases',
    unitId: 'emb-u4',
    title: 'Frases del manual',
    subtitle: 'wãs · w’ãrruru · mɯá deas',
    description: 'Expresiones para pedir, invitar y llamar la atención.',
    xp: 35,
  },
  {
    id: 'emb-l-cualidades',
    language: 'embera',
    category: 'cualidades',
    unitId: 'emb-u4',
    title: 'Decir cómo es',
    subtitle: 'bía · káya · apí · máturu',
    description: 'Palabras para describir estados, valores y matices.',
    xp: 25,
  },
]

const wayuuUnits: UnitConfig[] = [
  {
    id: 'way-u1',
    title: 'La palabra que recibe',
    subtitle: 'Saludos, familia y números para abrir una conversación.',
    lessonIds: ['way-l-saludos', 'way-l-familia', 'way-l-numeros'],
  },
  {
    id: 'way-u2',
    title: 'El desierto y el mar',
    subtitle: 'El territorio y los objetos que acompañan la vida.',
    lessonIds: ['way-l-naturaleza', 'way-l-casa'],
  },
  {
    id: 'way-u3',
    title: 'Vida y palabra',
    subtitle: 'Emociones, acciones y expresiones de todos los días.',
    lessonIds: ['way-l-cualidades', 'way-l-verbos', 'way-l-frases'],
  },
]

const wayuuLessons: LessonConfig[] = [
  {
    id: 'way-l-saludos',
    language: 'wayuunaiki',
    category: 'saludos',
    unitId: 'way-u1',
    title: 'Saludos del amanecer',
    subtitle: 'ajaa · anasü wattama’at · anayaawatsü',
    description: 'Abre una conversación y agradece.',
    xp: 20,
  },
  {
    id: 'way-l-familia',
    language: 'wayuunaiki',
    category: 'familia',
    unitId: 'way-u1',
    title: 'La ranchería',
    subtitle: 'tashi · tei · achon · püla',
    description: 'La familia extensa y las personas de la comunidad.',
    xp: 25,
  },
  {
    id: 'way-l-numeros',
    language: 'wayuunaiki',
    category: 'numeros',
    unitId: 'way-u1',
    title: 'Contar en el desierto',
    subtitle: 'wane · piama · apünüin · po’loo',
    description: 'Números para contar, repartir y orientarse.',
    xp: 20,
  },
  {
    id: 'way-l-naturaleza',
    language: 'wayuunaiki',
    category: 'naturaleza',
    unitId: 'way-u2',
    title: 'Agua, sol y territorio',
    subtitle: 'wüin · mma · müin · kashi',
    description: 'El paisaje que sostiene la vida wayuu.',
    xp: 30,
  },
  {
    id: 'way-l-casa',
    language: 'wayuunaiki',
    category: 'casa',
    unitId: 'way-u2',
    title: 'Tejidos y objetos',
    subtitle: 'piichi · sui · kattoi · siwarai',
    description: 'La casa, el chinchorro y la mochila.',
    xp: 25,
  },
  {
    id: 'way-l-cualidades',
    language: 'wayuunaiki',
    category: 'cualidades',
    unitId: 'way-u3',
    title: 'Nombrar lo que sentimos',
    subtitle: 'anasü · aishi · akapüla · yala’a',
    description: 'Palabras para el afecto, la alegría y la paz.',
    xp: 25,
  },
  {
    id: 'way-l-verbos',
    language: 'wayuunaiki',
    category: 'verbos',
    unitId: 'way-u3',
    title: 'Acciones cotidianas',
    subtitle: 'apülii · puula · iraa · yonna',
    description: 'Comer, beber, mirar y danzar.',
    xp: 25,
  },
  {
    id: 'way-l-frases',
    language: 'wayuunaiki',
    category: 'frases',
    unitId: 'way-u3',
    title: 'Palabras de cada día',
    subtitle: 'ishia · atta · wale’ka · tapüla',
    description: 'Respuestas, invitaciones y afecto.',
    xp: 30,
  },
]

export const CURRICULA: Record<string, Curriculum> = {
  embera: {
    languageId: 'embera',
    units: emberaUnits,
    lessons: emberaLessons,
  },
  wayuunaiki: {
    languageId: 'wayuunaiki',
    units: wayuuUnits,
    lessons: wayuuLessons,
  },
}

export function getCurriculum(languageId: string): Curriculum | undefined {
  return CURRICULA[languageId]
}

export function getLesson(languageId: string, lessonId: string): LessonConfig | undefined {
  return CURRICULA[languageId]?.lessons.find((lesson) => lesson.id === lessonId)
}

export function getOrderedLessons(languageId: string): LessonConfig[] {
  const curriculum = CURRICULA[languageId]
  if (!curriculum) return []
  return curriculum.units.flatMap((unit) =>
    unit.lessonIds
      .map((lessonId) => curriculum.lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is LessonConfig => Boolean(lesson)),
  )
}
