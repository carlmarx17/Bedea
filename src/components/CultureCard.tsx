import { Icon } from './Icon'
import { Badge } from './ui'
import { TextileLattice } from './TextilePattern'
import { cn } from '../lib/utils'
import type { CultureCapsule } from '../types'

const ICON_TONES: Record<string, string> = {
  embera: 'bg-terracotta-100 text-terracotta-700',
  wayuunaiki: 'bg-ochre-100 text-ochre-700',
}

/** Cápsula cultural "Sabías que...". */
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
        'surface group relative flex flex-col overflow-hidden p-5 transition-all duration-300 hover:shadow-lift sm:p-6',
        featured && 'border-jungle-800/30 bg-gradient-to-br from-jungle-900 via-jungle-800 to-jungle-950 text-cream',
        onOpen && 'cursor-pointer hover:-translate-y-0.5',
        className,
      )}
    >
      {featured && <TextileLattice className="text-ochre-300 opacity-[0.06]" />}

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            featured
              ? 'bg-white/10 text-ochre-200'
              : ICON_TONES[capsule.language] ?? 'bg-sand-100 text-jungle-700',
          )}
        >
          <Icon name={capsule.icon} size={21} />
        </span>
        <Badge
          tone={featured ? 'ochre' : isEmbera ? 'terracotta' : 'ochre'}
          className={featured ? 'border-ochre-300/30 bg-ochre-400/20 text-ochre-100' : undefined}
        >
          {isEmbera ? 'Ẽbẽra' : 'Wayuunaiki'}
        </Badge>
      </div>

      <p
        className={cn(
          'relative mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em]',
          featured ? 'text-ochre-200' : 'text-terracotta-600',
        )}
      >
        Sabías que · {capsule.category}
      </p>
      <h3
        className={cn(
          'relative mt-1.5 font-display text-xl font-semibold leading-snug',
          featured ? 'text-cream sm:text-2xl' : 'text-ink',
        )}
      >
        {capsule.title}
      </h3>
      <p
        className={cn(
          'relative mt-3 text-sm leading-relaxed',
          featured ? 'text-sand-100/85' : 'text-muted',
          !featured && 'line-clamp-4',
        )}
      >
        {capsule.body}
      </p>

      <div
        className={cn(
          'relative mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 mt-4',
          featured ? 'border-white/15' : 'border-sand-200/80',
        )}
      >
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              'native-word font-display text-lg font-semibold',
              featured ? 'text-ochre-200' : 'text-jungle-800',
            )}
          >
            {capsule.keyword}
          </span>
          <span className={cn('text-xs', featured ? 'text-sand-200/70' : 'text-muted')}>
            {capsule.keywordTranslation}
          </span>
        </span>
        {onOpen ? (
          <span
            className={cn(
              'text-[0.7rem] font-semibold transition-transform group-hover:translate-x-0.5',
              featured ? 'text-ochre-200' : 'text-jungle-700',
            )}
          >
            Leer completa →
          </span>
        ) : (
          <span className={cn('text-[0.65rem]', featured ? 'text-sand-200/60' : 'text-muted/70')}>
            {capsule.source}
          </span>
        )}
      </div>

      {onOpen && (
        <button
          type="button"
          onClick={() => onOpen(capsule)}
          className="absolute inset-0 rounded-3xl"
          aria-label={`Leer cápsula cultural: ${capsule.title}`}
        />
      )}
    </article>
  )
}
