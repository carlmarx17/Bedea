import { useBrand } from '../lib/brand'
import { cn } from '../lib/utils'
import type { BrandPreset } from '../types'

interface BrandMarkProps {
  size?: number
  className?: string
  brand?: BrandPreset
  decorative?: boolean
}

/**
 * Logo configurable de la app. Tres símbolos disponibles:
 * tejido (woven), espiral (spiral) y hoja (leaf).
 */
export function BrandMark({ size = 44, className, brand, decorative = false }: BrandMarkProps) {
  const { brand: activeBrand } = useBrand()
  const current = brand ?? activeBrand
  const symbol = current.logoSymbol

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : `Logo de ${current.name}`}
      className={cn('shrink-0', className)}
    >
      <defs>
        <clipPath id={`mark-bubble-${current.id}`}>
          {/* Globo de diálogo: la palabra hablada */}
          <path d="M14 12h36a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H30l-11 9v-9h-5a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6Z" />
        </clipPath>
      </defs>
      <rect width="64" height="64" rx="14" fill="#1A1512" />

      {symbol === 'woven' && (
        <g clipPath={`url(#mark-bubble-${current.id})`}>
          <rect x="0" y="0" width="64" height="20" fill="#D7261E" />
          <rect x="0" y="20" width="64" height="9" fill="#F8BC0B" />
          <rect x="0" y="29" width="64" height="9" fill="#0B9AA6" />
          <rect x="0" y="38" width="64" height="20" fill="#D92A63" />
        </g>
      )}

      {symbol === 'spiral' && (
        <>
          <path
            d="M32 50c-10 0-18-8-18-18S22 14 32 14s18 8 18 18c0 7.5-6 13.5-13.5 13.5S23 39.5 23 32s5-9.5 11-9.5 9 4 9 9"
            fill="none"
            stroke="#F8BC0B"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="3.4" fill="#E2401C" />
        </>
      )}

      {symbol === 'leaf' && (
        <>
          <path
            d="M46 16C32 16 20 24 20 38c0 5 2 8 5 10 3-10 9-17 19-22-7 6-12 13-14 23 3 1 6 1 9-1 9-5 12-17 7-32Z"
            fill="#F8BC0B"
          />
          <path
            d="M20 50c4-12 12-20 24-27"
            fill="none"
            stroke="#E2401C"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}

interface BrandLockupProps {
  compact?: boolean
  invert?: boolean
  className?: string
}

export function BrandLockup({ compact = false, invert = false, className }: BrandLockupProps) {
  const { brand } = useBrand()
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <BrandMark size={compact ? 36 : 44} />
      <div className="min-w-0">
        <p
          className={cn(
            'font-display text-2xl font-extrabold leading-none tracking-tight',
            invert ? 'text-cream' : 'text-ink',
          )}
        >
          {brand.name}
        </p>
        {!compact && (
          <p
            className={cn(
              'mt-0.5 truncate text-xs font-medium',
              invert ? 'text-sand-200/80' : 'text-muted',
            )}
          >
            {brand.subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
