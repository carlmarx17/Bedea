import type { SentenceExercise } from '../types'

/**
 * Frases para el constructor de oraciones.
 * Los tokens se barajan y el usuario debe ordenarlos.
 */
export const SENTENCES: SentenceExercise[] = [
  {
    id: 'emb-sen-01',
    language: 'embera',
    tokens: ['kõchitamá', 'w’ãs'],
    translation: '¡Vaya donde Conchita!',
    hint: 'El sufijo -má indica dirección: hacia, para.',
    source: 'Manual ẽbẽra-chamí',
  },
  {
    id: 'emb-sen-02',
    language: 'embera',
    tokens: ['jῦkaa', 'w’ãs'],
    translation: '¡Vaya cerca!',
    hint: 'jῦkaa indica proximidad; w’ãs es la orden de ir.',
    source: 'Manual ẽbẽra-chamí',
  },
  {
    id: 'emb-sen-03',
    language: 'embera',
    tokens: ['mɯá', 'deas'],
    translation: '¡Deme!',
    hint: 'Es la forma de pedido que el manual deriva de mɯa deay.',
    source: 'Manual ẽbẽra-chamí',
  },
  {
    id: 'emb-sen-04',
    language: 'embera',
    tokens: ['kóa', 'ɓú'],
    translation: 'Tengo pereza.',
    hint: 'Expresión del manual para hablar del ánimo y el cuerpo.',
    source: 'Manual ẽbẽra-chamí',
  },
  {
    id: 'emb-sen-05',
    language: 'embera',
    tokens: ['saka', 'ewarisma'],
    translation: 'Buenos días.',
    hint: 'Saludo de la mañana usado en el chamí.',
    source: 'Saludos de uso extendido',
  },
  {
    id: 'emb-sen-06',
    language: 'embera',
    tokens: ['tatamá', 'w’ãs'],
    translation: '¡Vaya donde la abuela!',
    hint: 'tatamá es la forma con -má de táta, abuela.',
    source: 'Manual ẽbẽra-chamí',
  },
  {
    id: 'way-sen-01',
    language: 'wayuunaiki',
    tokens: ['anasü', 'wattama’at'],
    translation: 'Buenos días.',
    hint: 'anasü expresa bien/bueno; wattama’at se refiere a la mañana.',
    source: 'Módulo inicial wayuunaiki',
  },
  {
    id: 'way-sen-02',
    language: 'wayuunaiki',
    tokens: ['anasü', 'alikaa'],
    translation: 'Buenas tardes.',
    hint: 'alikaa sitúa el momento de la tarde.',
    source: 'Módulo inicial wayuunaiki',
  },
  {
    id: 'way-sen-03',
    language: 'wayuunaiki',
    tokens: ['anasü', 'aipa’a'],
    translation: 'Buenas noches.',
    hint: 'aipa’a se refiere a la noche.',
    source: 'Módulo inicial wayuunaiki',
  },
  {
    id: 'way-sen-04',
    language: 'wayuunaiki',
    tokens: ['jamaya', 'pia?'],
    translation: '¿Cómo estás?',
    hint: 'pia significa tú; la pregunta se apoya en la entonación.',
    source: 'Módulo inicial wayuunaiki',
  },
  {
    id: 'way-sen-05',
    language: 'wayuunaiki',
    tokens: ['ajaa', 'pia'],
    translation: 'Hola, tú.',
    hint: 'Una construcción sencilla para practicar dos palabras de saludo.',
    source: 'Módulo inicial wayuunaiki',
  },
]

export function getSentences(languageId: string): SentenceExercise[] {
  return SENTENCES.filter((sentence) => sentence.language === languageId)
}
