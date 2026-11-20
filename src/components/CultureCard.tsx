import { cn } from '../lib/utils'
import type { CultureCapsule } from '../types'

/** Cápsula cultural con estética de ensayo editorial. */
export function CultureCard({
  capsule,
  featured = false,
  onOpen,
  className,
}: {
  capsule: CultureCapsule
  featured?: boolean
  onOpen?: (capsule: CultureCapsule) => void
  className?: string
}) {
  const isEmbera = capsule.language === 'embera'

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-200 sm:p-7',
        featured
          ? 'border-ink bg-ink text-cream'
          : 'border-ink/10 bg-cream text-ink hover:border-ink/25',
        onOpen && 'cursor-pointer hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em]',
            featured ? 'text-ochre-300' : 'text-terracotta-600',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              featured ? 'bg-ochre-300' : isEmbera ? 'bg-terracotta-500' : 'bg-ochre-500',
            )}
          />
          {isEmbera ? 'Ẽbẽra' : 'Wayuunaiki'} · {capsule.category}
        </span>
      </div>

      <h3
        className={cn(
          'mt-4 font-display font-semibold leading-snug',
          featured ? 'text-2xl text-cream sm:text-[1.75rem]' : 'text-xl text-ink',
        )}
      >
        {capsule.title}
      </h3>
      <p
        className={cn(
          'mt-3 text-sm leading-relaxed',
          featured ? 'text-sand-100/80' : 'text-muted',
          !featured && 'line-clamp-4',
        )}
      >
        {capsule.body}
      </p>

      <div
        className={cn(
          'mt-auto flex flex-wrap items-baseline justify-between gap-3 border-t pt-4 mt-6',
          featured ? 'border-white/12' : 'border-ink/10',
        )}
      >
        <span className="flex items-baseline gap-2.5">
          <span
            className={cn(
              'native-word font-display text-lg font-semibold',
              featured ? 'text-ochre-200' : 'text-ink',
            )}
          >
            {capsule.keyword}
          </span>
          <span className={cn('text-xs italic', featured ? 'text-sand-200/70' : 'text-muted')}>
            {capsule.keywordTranslation}
          </span>
        </span>
        {onOpen ? (
          <span
            className={cn(
              'text-xs font-semibold transition-transform group-hover:translate-x-0.5',
              featured ? 'text-ochre-200' : 'text-ink',
            )}
          >
            Leer →
          </span>
        ) : (
          <span className={cn('text-[0.68rem]', featured ? 'text-sand-200/55' : 'text-muted/75')}>
            {capsule.source}
          </span>
        )}
      </div>

      {onOpen && (
        <button
          type="button"
          onClick={() => onOpen(capsule)}
          className="absolute inset-0 rounded-2xl"
          aria-label={`Leer cápsula cultural: ${capsule.title}`}
        />
      )}
    </article>
  )
}
