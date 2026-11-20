import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { Badge, ProgressBar } from './ui'
import { getCurriculum } from '../data/curriculum'
import { countWords } from '../lib/vocabulary'
import { useProgress } from '../lib/progress'
import { cn } from '../lib/utils'
import type { LanguageInfo } from '../types'

const ACCENTS: Record<string, { bar: string; soft: string; text: string }> = {
  embera: {
    bar: 'from-terracotta-500 to-terracotta-700',
    soft: 'bg-terracotta-50',
    text: 'text-terracotta-700',
  },
  wayuu: {
    bar: 'from-ochre-400 to-ochre-600',
    soft: 'bg-ochre-50',
    text: 'text-ochre-700',
  },
  nasa: {
    bar: 'from-jungle-500 to-jungle-700',
    soft: 'bg-jungle-50',
    text: 'text-jungle-700',
  },
  kogui: {
    bar: 'from-jungle-600 to-jungle-800',
    soft: 'bg-jungle-50',
    text: 'text-jungle-700',
  },
  tikuna: {
    bar: 'from-terracotta-400 to-ochre-500',
    soft: 'bg-sand-100',
    text: 'text-terracotta-700',
  },
}

/** Tarjeta de una lengua disponible, con progreso y acceso al camino. */
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
      className="surface group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className={cn('h-1.5 w-full bg-gradient-to-r', accent.bar)} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={cn('text-[0.68rem] font-semibold uppercase tracking-[0.16em]', accent.text)}>
              {language.family}
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-semibold text-ink">{language.name}</h3>
            <p className="native-word text-sm font-medium text-muted">{language.nativeName}</p>
          </div>
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105',
              accent.soft,
              accent.text,
            )}
          >
            <Icon name="languages" size={21} />
          </span>
        </div>

        <div className={cn('mt-5 rounded-2xl px-4 py-3', accent.soft)}>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">Saludo</p>
          <p className="mt-0.5 flex items-baseline gap-2">
            <span className={cn('native-word font-display text-xl font-semibold', accent.text)}>
              {language.greeting}
            </span>
            <span className="text-xs font-medium text-muted">{language.greetingTranslation}</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{language.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <Badge tone="sand">{words} palabras</Badge>
          <Badge tone="sand">{totalLessons} lecciones</Badge>
          <Badge tone="sand">{language.speakers}</Badge>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-1.5 flex items-center justify-between text-[0.7rem] font-semibold text-muted">
            <span>{completed === 0 ? 'Empieza tu camino' : `${completed} de ${totalLessons} lecciones`}</span>
            <span className="tabular-nums">{Math.round(percent)}%</span>
          </div>
          <ProgressBar value={percent} tone={language.accent === 'wayuu' ? 'ochre' : 'jungle'} height="h-2" />
        </div>
      </div>
    </Link>
  )
}

/** Tarjeta de una lengua que llegará próximamente. */
export function UpcomingLanguageCard({ language }: { language: LanguageInfo }) {
  return (
    <div className="surface-muted relative flex flex-col overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {language.family}
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-ink/80">{language.name}</h3>
          <p className="text-xs font-medium text-muted">{language.nativeName}</p>
        </div>
        <Badge tone="outline">Próximamente</Badge>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{language.description}</p>
      <p className="mt-3 text-[0.68rem] font-medium text-muted/80">{language.region}</p>
    </div>
  )
}
