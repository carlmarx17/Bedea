import { AudioButton } from './ui'
import { TerritoryFlag, WordIllustration } from './CulturalVisuals'
import { CATEGORY_MAP, LANGUAGE_MAP } from '../data/languages'
import type { VocabularyEntry } from '../types'
import { cn } from '../lib/utils'

interface WordCardProps {
  entry: VocabularyEntry
  onOpen?: (entry: VocabularyEntry) => void
  className?: string
}

/** Ficha léxica editorial para el diccionario y resultados de búsqueda. */
export function WordCard({ entry, onOpen, className }: WordCardProps) {
  const category = CATEGORY_MAP[entry.category]
  const language = LANGUAGE_MAP[entry.language]

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-muted">
          <TerritoryFlag territory={entry.language} size="sm" />
          <span className="font-medium text-ink/85">{language?.name ?? entry.language}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.source === 'manual' ? 'Manual' : 'Complemento'}</span>
        </span>
        <div
          className="relative z-10"
          onClick={(event) => event.stopPropagation()}
        >
          <AudioButton text={entry.palabra_nativa} audioUrl={entry.audio_url} compact />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3.5">
        <WordIllustration entry={entry} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="native-word font-display text-[1.45rem] font-semibold leading-tight text-ink">
            {entry.palabra_nativa}
          </p>
          <p className="mt-0.5 text-xs italic text-muted">/{entry.guia_fonetica}/</p>
          <p className="mt-1.5 text-sm font-semibold text-jungle-700">{entry.traduccion_espanol}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
        <span className="native-word font-medium text-ink/80">“{entry.ejemplo_uso}”</span>{' '}
        — {entry.ejemplo_traduccion}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-3 mt-4">
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted">
          {category?.shortLabel ?? entry.category}
        </span>
        {onOpen && (
          <span className="text-xs font-semibold text-ink transition-transform group-hover:translate-x-0.5">
            Ficha →
          </span>
        )}
      </div>
    </>
  )

  if (!onOpen) {
    return <article className={cn('surface flex flex-col p-5', className)}>{content}</article>
  }

  return (
    <article
      className={cn(
        'surface group relative flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25',
        className,
      )}
    >
      {content}
      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="absolute inset-0 rounded-2xl focus-visible:outline-offset-2"
        aria-label={`Ver ficha de ${entry.palabra_nativa}`}
      />
    </article>
  )
}
