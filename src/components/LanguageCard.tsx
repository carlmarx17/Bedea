import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { TerritoryFlag } from './CulturalVisuals'
import { ProgressBar } from './ui'
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

/** Tarjeta editorial de una lengua disponible, con progreso y acceso al camino. */
export function LanguageCard({ language }: { language: LanguageInfo }) {
  const { progress } = useProgress()
  const curriculum = getCurriculum(language.id)
  const totalLessons = curriculum?.lessons.length ?? 0
  const completed = progress.completedLessons[language.id]?.length ?? 0
  const percent = totalLessons === 0 ? 0 : (completed / totalLessons) * 100
  const accent = ACCENTS[language.accent] ?? ACCENTS.embera
  const words = countWords(language.id)

  return (
    <Link
      to={`/lengua/${language.id}`}
      className={cn(
        'surface group relative flex flex-col border-t-[3px] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 sm:p-8',
        accent.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <TerritoryFlag territory={language.id} size="md" />
            <p className={cn('font-display text-sm italic', accent.text)}>
              {language.family}
            </p>
          </div>
          <h3 className="mt-2.5 font-display text-3xl font-semibold text-ink">{language.name}</h3>
          <p className="native-word mt-0.5 font-display text-base italic text-muted">
            {language.nativeName} · <span className="not-italic text-xs">{language.dialect}</span>
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
          <Icon name="arrow-up-right" size={18} />
        </span>
      </div>

      {/* Saludo destacado como espécimen tipográfico */}
      <div className="mt-6 border-y border-ink/10 py-4">
        <p className="text-xs text-muted">
          Saludo tradicional
        </p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className={cn('native-word font-display text-2xl font-semibold', accent.text)}>
            “{language.greeting}”
          </span>
          <span className="text-xs text-muted">{language.greetingTranslation}</span>
        </p>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-muted">{language.description}</p>

      {/* Metadatos en línea limpia, sin pila de badges */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted">
        <span className="text-ink">{words} palabras</span>
        <span aria-hidden="true">·</span>
        <span className="text-ink">{totalLessons} lecciones</span>
        <span aria-hidden="true">·</span>
        <span>{language.speakers}</span>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>
            {completed === 0 ? 'Sin iniciar' : `${completed} de ${totalLessons} lecciones`}
          </span>
          <span className="tabular-nums text-ink">{Math.round(percent)}%</span>
        </div>
        <ProgressBar
          value={percent}
          tone={language.accent === 'wayuu' ? 'ochre' : 'jungle'}
          height="h-1.5"
        />
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
        <span className="inline-flex items-center gap-2 font-display text-xs italic text-muted">
          <TerritoryFlag territory={language.id} size="sm" />
          {index ? `0${index}` : 'Pronto'} · {language.family}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
          <span className={cn('h-1.5 w-1.5 rounded-full', accent.dot)} />
          En camino
        </span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink">{language.name}</h3>
      <p className="native-word text-xs italic text-muted">{language.nativeName}</p>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{language.description}</p>
      <p className="mt-auto pt-3 text-[0.7rem] font-medium text-ink/70">{language.region}</p>
    </div>
  )
}
