import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { LanguageProgress, getLangTheme } from './Woven'
import { getCurriculum } from '../data/curriculum'
import { countWords } from '../lib/vocabulary'
import { useProgress } from '../lib/progress'
import { cn } from '../lib/utils'
import type { LanguageInfo } from '../types'

const ACCENTS: Record<string, { border: string; text: string; dot: string }> = {
  embera: {
    border: 'border-t-terracotta-500',
    text: 'text-terracotta-600',
    dot: 'bg-terracotta-500',
  },
  wayuu: {
    border: 'border-t-ochre-500',
    text: 'text-ochre-600',
    dot: 'bg-ochre-500',
  },
  nasa: {
    border: 'border-t-jungle-600',
    text: 'text-jungle-700',
    dot: 'bg-jungle-600',
  },
  kogui: {
    border: 'border-t-jungle-700',
    text: 'text-jungle-700',
    dot: 'bg-jungle-700',
  },
  tikuna: {
    border: 'border-t-terracotta-400',
    text: 'text-terracotta-600',
    dot: 'bg-terracotta-400',
  },
}

/** Tarjeta de una lengua disponible, con su color propio y su objeto de progreso. */
export function LanguageCard({ language }: { language: LanguageInfo }) {
  const { progress } = useProgress()
  const curriculum = getCurriculum(language.id)
  const totalLessons = curriculum?.lessons.length ?? 0
  const completed = progress.completedLessons[language.id]?.length ?? 0
  const theme = getLangTheme(language.accent)
  const words = countWords(language.id)

  return (
    <Link
      to={`/lengua/${language.id}`}
      className="surface group relative flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
    >
      <div aria-hidden="true" className={cn('h-3', theme.stripes)} />
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-muted">{language.region.split('(')[0].trim()}</p>
            <h3 className="mt-1 font-display text-4xl font-extrabold text-ink">{language.name}</h3>
            <p className="native-word mt-3 font-display text-3xl font-bold leading-none">
              <span className={theme.accentText}>{language.greeting}</span>
              <span className="ml-2 font-sans text-base font-medium text-muted">
                = {language.greetingTranslation.toLowerCase()}
              </span>
            </p>
          </div>
          <LanguageProgress
            accent={language.accent}
            done={completed}
            total={totalLessons}
            className="h-24 w-24 sm:h-28 sm:w-28"
          />
        </div>

        <p className="mt-5 line-clamp-3 text-[0.95rem] leading-relaxed text-ink/80">{language.description}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-sm text-muted">
            <span className="font-bold text-ink">{words}</span> palabras ·{' '}
            <span className="font-bold text-ink">{totalLessons}</span> lecciones
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
            {completed === 0 ? 'Arrancar' : `Llevas ${completed} ${theme.unit}`}
            <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Entrada editorial para lenguas próximas, como volúmenes en preparación. */
export function UpcomingLanguageCard({
  language,
  index,
}: {
  language: LanguageInfo
  index?: number
}) {
  const accent = ACCENTS[language.accent] ?? ACCENTS.nasa
  return (
    <div className="flex flex-col border-t border-ink/15 pt-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted">
          {index ? `${index}. ` : ''}{language.family.replace('Familia lingüística ', 'Familia ')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted">
          <span className={cn('h-2 w-2 rounded-full', accent.dot)} />
          Pronto
        </span>
      </div>
      <h3 className="mt-2 font-display text-2xl font-bold text-ink">{language.name}</h3>
      <p className="native-word text-xs italic text-muted">{language.nativeName}</p>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{language.description}</p>
      <p className="mt-auto pt-3 text-[0.7rem] font-medium text-ink/70">{language.region}</p>
    </div>
  )
}
