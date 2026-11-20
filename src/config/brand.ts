import type { BrandPreset } from '../types'

/**
 * Identidad de marca configurable.
 * Cambia DEFAULT_BRAND_ID o añade un preset para renombrar toda la app
 * sin tocar componentes. El logo se dibuja con `BrandMark`.
 */
export const BRAND_PRESETS: BrandPreset[] = [
  {
    id: 'bedea',
    name: 'Bedea',
    subtitle: 'Voces Vivas de Colombia',
    tagline: 'La palabra que nos conecta con la tierra.',
    logoSymbol: 'woven',
    monogram: 'B',
    description:
      'Bedea significa palabra y lengua en ẽbẽra. Elegimos este nombre como un puente entre pueblos, memorias y generaciones.',
  },
  {
    id: 'anasu',
    name: 'Anasü',
    subtitle: 'Lenguas que florecen',
    tagline: 'Aprender una lengua es abrir una casa.',
    logoSymbol: 'spiral',
    monogram: 'A',
    description:
      'Anasü significa bien, bueno en wayuunaiki. Un nombre para celebrar lo que florece cuando una lengua se habla.',
  },
  {
    id: 'raices',
    name: 'Raíces Vivas',
    subtitle: 'Memoria, lengua y territorio',
    tagline: 'Hay raíces que se riegan hablando.',
    logoSymbol: 'leaf',
    monogram: 'R',
    description:
      'Una alternativa para nombrar el proyecto desde la metáfora de las raíces que sostienen y alimentan la palabra.',
  },
]

export const DEFAULT_BRAND_ID = 'bedea'

export const BRAND_STORAGE_KEY = 'bedea.brand.v1'

export function getBrandPreset(id: string | null | undefined): BrandPreset {
  return BRAND_PRESETS.find((preset) => preset.id === id) ?? BRAND_PRESETS[0]
}
