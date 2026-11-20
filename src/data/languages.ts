import type { CategoryInfo, LanguageInfo } from '../types'

export const LANGUAGES: LanguageInfo[] = [
  {
    id: 'embera',
    name: 'Emberá',
    nativeName: 'Ẽbẽra beɗea',
    family: 'Familia lingüística Chocó',
    region: 'Chocó, Antioquia, Risaralda, Valle del Cauca y Nariño',
    speakers: '≈ 70.000 hablantes',
    community: 'Pueblo ẽbẽra-chamí · Karmata Rua, Jardín (Antioquia)',
    description:
      'Una lengua nasal, gutural y aglutinante del occidente colombiano. El manual base documenta el dialecto chamí de la comunidad de Karmata Rua, en Jardín, Antioquia.',
    greeting: 'Mãe',
    greetingTranslation: 'Hola',
    status: 'available',
    accent: 'embera',
    sourceNote:
      'Base léxica extraída del Manual de enseñanza y escritura ẽbẽra-chamí (2013), con algunos saludos y números de uso extendido claramente marcados como complemento.',
    caution:
      'La ortografía y los significados varían entre comunidades y dialectos. Este material es una invitación a escuchar y aprender con hablantes ẽbẽra.',
  },
  {
    id: 'wayuunaiki',
    name: 'Wayuunaiki',
    nativeName: 'Wayuunaiki',
    family: 'Familia lingüística Arawak',
    region: 'La Guajira (Colombia) y Zulia (Venezuela)',
    speakers: '≈ 150.000 en Colombia',
    community: 'Pueblo wayuu · rancherías de La Guajira',
    description:
      'Lengua del pueblo wayuu, marcada por vocales largas, la ü y saltos glotales. Su tejido, su música y su palabra son memoria viva del desierto y el mar.',
    greeting: 'Ajaa',
    greetingTranslation: 'Hola',
    status: 'available',
    accent: 'wayuu',
    sourceNote:
      'Módulo inicial de vocabulario de uso frecuente, construido con fuentes divulgativas y diccionarios wayuunaiki. Está pendiente de revisión con hablantes y autoridades wayuu.',
    caution:
      'Este es un material de aprendizaje inicial. La ortografía y los significados pueden variar por comunidad: prioriza siempre la palabra de los hablantes y las autoridades wayuu.',
  },
  {
    id: 'nasayuwe',
    name: 'Nasa Yuwe',
    nativeName: 'Nasa Yuwe',
    family: 'Familia lingüística Nasa',
    region: 'Cauca y sur del Valle del Cauca',
    speakers: '≈ 90.000 hablantes',
    community: 'Pueblo nasa · Tierradentro y norte del Cauca',
    description:
      'La lengua del pueblo nasa, conocida también como paez. Su palabra está ligada al agua, la montaña y la defensa del territorio.',
    greeting: 'Mawe',
    greetingTranslation: 'Hola',
    status: 'soon',
    accent: 'nasa',
    sourceNote: 'Próximamente, con revisión de hablantes y materiales propios del pueblo nasa.',
  },
  {
    id: 'kogui',
    name: 'Kággaba',
    nativeName: 'Kággaba kouguian',
    family: 'Familia lingüística Chibcha',
    region: 'Sierra Nevada de Santa Marta',
    speakers: '≈ 15.000 hablantes',
    community: 'Pueblo kogui · Sierra Nevada de Santa Marta',
    description:
      'Lengua del pueblo kogui, guardián de la Sierra Nevada. Su cosmovisión entiende el territorio como un cuerpo vivo que debe cuidarse.',
    greeting: 'Ubamilein',
    greetingTranslation: 'Buenos días',
    status: 'soon',
    accent: 'kogui',
    sourceNote: 'Próximamente, con revisión de las autoridades y hablantes kogui.',
  },
  {
    id: 'tikuna',
    name: 'Tikuna',
    nativeName: 'Ticuna',
    family: 'Lengua aislada',
    region: 'Amazonas, sur de Colombia y frontera con Perú y Brasil',
    speakers: '≈ 13.000 en Colombia',
    community: 'Pueblo tikuna · ríos Amazonas, Putumayo y Loretoyacu',
    description:
      'Una de las lenguas indígenas más habladas de la Amazonía. Su oralidad, sus cantos y su relación con el río son parte de la memoria del sur del país.',
    greeting: 'Nüxü',
    greetingTranslation: 'Hola',
    status: 'soon',
    accent: 'tikuna',
    sourceNote: 'Próximamente, con revisión de hablantes y organizaciones tikuna.',
  },
]

export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map((language) => [language.id, language]),
) as Record<string, LanguageInfo>

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'saludos',
    label: 'Saludos y cortesía',
    shortLabel: 'Saludos',
    description: 'Las primeras palabras para abrir una conversación.',
    icon: 'hand',
    accent: 'terracotta',
  },
  {
    id: 'familia',
    label: 'Familia y comunidad',
    shortLabel: 'Familia',
    description: 'Parentescos, personas y la red que sostiene la vida.',
    icon: 'users',
    accent: 'ochre',
  },
  {
    id: 'numeros',
    label: 'Números y cantidades',
    shortLabel: 'Números',
    description: 'Contar, repartir y nombrar lo que existe.',
    icon: 'hash',
    accent: 'jungle',
  },
  {
    id: 'naturaleza',
    label: 'Naturaleza y territorio',
    shortLabel: 'Territorio',
    description: 'Tierra, agua, ríos y caminos que dan forma al mundo.',
    icon: 'mountain',
    accent: 'jungle',
  },
  {
    id: 'animales',
    label: 'Animales y seres del monte',
    shortLabel: 'Animales',
    description: 'Vecinos del bosque, el río y la memoria.',
    icon: 'paw',
    accent: 'ochre',
  },
  {
    id: 'casa',
    label: 'Casa y objetos',
    shortLabel: 'Casa',
    description: 'Lo que se usa, se teje y se comparte cada día.',
    icon: 'home',
    accent: 'terracotta',
  },
  {
    id: 'cuerpo',
    label: 'Cuerpo y persona',
    shortLabel: 'Cuerpo',
    description: 'Nombrar el cuerpo es nombrar la experiencia.',
    icon: 'body',
    accent: 'coral',
  },
  {
    id: 'verbos',
    label: 'Verbos y acciones',
    shortLabel: 'Verbos',
    description: 'Comer, ir, hablar, pensar: la vida en movimiento.',
    icon: 'activity',
    accent: 'jungle',
  },
  {
    id: 'frases',
    label: 'Frases útiles',
    shortLabel: 'Frases',
    description: 'Expresiones del manual para usar en contexto.',
    icon: 'message',
    accent: 'terracotta',
  },
  {
    id: 'cualidades',
    label: 'Palabras para describir',
    shortLabel: 'Describir',
    description: 'Bueno, enfermo, derecho, feo: matices del mundo.',
    icon: 'sparkles',
    accent: 'ochre',
  },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<string, CategoryInfo>

export const SOON_LANGUAGES = LANGUAGES.filter((language) => language.status === 'soon')
export const AVAILABLE_LANGUAGES = LANGUAGES.filter((language) => language.status === 'available')
