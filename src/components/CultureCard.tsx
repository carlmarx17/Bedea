import { Icon } from './Icon'
import { Badge } from './ui'
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
  className,
}: {
  capsule: CultureCapsule
  featured?: boolean
  className?: string
}) {
  const isEmbera = capsule.language === 'embera'

  return (
    <article
      className={cn(
        'surface flex flex-col p-5 transition-shadow duration-300 hover:shadow-lift sm:p-6',
        featured && 'bg-gradient-to-br from-jungle-900 to-jungle-800 text-cream',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
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
        <Badge tone={featured ? 'ochre' : isEmbera ? 'terracotta' : 'ochre'}>
          {isEmbera ? 'Ẽbẽra' : 'Wayuunaiki'}
        </Badge>
      </div>

      <p
        className={cn(
          'mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em]',
          featured ? 'text-ochre-200' : 'text-terracotta-600',
        )}
      >
        Sabías que · {capsule.category}
      </p>
      <h3
        className={cn(
          'mt-1.5 font-display text-xl font-semibold leading-snug',
          featured ? 'text-cream' : 'text-ink',
        )}
      >
        {capsule.title}
      </h3>
      <p
        className={cn(
          'mt-3 text-sm leading-relaxed',
          featured ? 'text-sand-100/85' : 'text-muted',
          !featured && 'line-clamp-5',
        )}
      >
        {capsule.body}
      </p>

      <div
        className={cn(
          'mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3',
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
        <span className={cn('text-[0.65rem]', featured ? 'text-sand-200/60' : 'text-muted/70')}>
          {capsule.source}
        </span>
      </div>
    </article>
  )
}
