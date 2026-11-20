import { Badge, AudioButton } from './ui'
import { CATEGORY_MAP, LANGUAGE_MAP } from '../data/languages'
import type { VocabularyEntry } from '../types'
import { cn } from '../lib/utils'

interface WordCardProps {
  entry: VocabularyEntry
  onOpen?: (entry: VocabularyEntry) => void
  className?: string
}

/** Tarjeta de palabra usada en el diccionario y en resultados de búsqueda. */
export function WordCard({ entry, onOpen, className }: WordCardProps) {
  const category = CATEGORY_MAP[entry.category]
  const language = LANGUAGE_MAP[entry.language]
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={entry.language === 'embera' ? 'terracotta' : 'ochre'}>
            {language?.name ?? entry.language}
          </Badge>
          <Badge tone={entry.source === 'manual' ? 'jungle' : 'sand'}>
            {entry.source === 'manual' ? 'Manual' : 'Complemento'}
          </Badge>
        </div>
        <div
          className="relative z-10"
          onClick={(event) => event.stopPropagation()}
        >
          <AudioButton text={entry.palabra_nativa} compact />
        </div>
      </div>

      <p className="native-word mt-4 font-display text-2xl font-semibold leading-tight text-ink">
        {entry.palabra_nativa}
      </p>
      <p className="mt-1 text-xs font-medium italic text-muted">[{entry.guia_fonetica}]</p>
      <p className="mt-3 text-sm font-semibold text-jungle-800">{entry.traduccion_espanol}</p>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink/70">Ejemplo: </span>
        {entry.ejemplo_uso} · {entry.ejemplo_traduccion}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-sand-200/80 pt-3 mt-4">
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              entry.language === 'embera' ? 'bg-terracotta-500' : 'bg-ochre-500',
            )}
          />
          {category?.shortLabel ?? entry.category}
        </span>
        {onOpen && (
          <span className="text-[0.68rem] font-semibold text-jungle-700 transition-transform group-hover:translate-x-0.5">
            Ver ficha →
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
        'surface group relative flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-jungle-200 hover:shadow-lift',
        className,
      )}
    >
      {content}
      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="absolute inset-0 rounded-3xl focus-visible:outline-offset-2"
        aria-label={`Ver ficha de ${entry.palabra_nativa}`}
      />
    </article>
  )
}
