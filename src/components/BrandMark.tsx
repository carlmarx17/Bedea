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
        <linearGradient id={`mark-bg-${current.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B3D2F" />
          <stop offset="100%" stopColor="#0B1F18" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="17" fill={`url(#mark-bg-${current.id})`} />

      {symbol === 'woven' && (
        <>
          <path
            d="M32 8.5 55.5 32 32 55.5 8.5 32Z"
            fill="none"
            stroke="#DCA94A"
            strokeWidth="2.4"
          />
          <path d="M32 16.5 47.5 32 32 47.5 16.5 32Z" fill="#C75B39" />
          <path d="M32 23 41 32 32 41 23 32Z" fill="#FBF8F1" />
          <circle cx="32" cy="32" r="3.2" fill="#132C22" />
        </>
      )}

      {symbol === 'spiral' && (
        <>
          <path
            d="M32 50c-10 0-18-8-18-18S22 14 32 14s18 8 18 18c0 7.5-6 13.5-13.5 13.5S23 39.5 23 32s5-9.5 11-9.5 9 4 9 9"
            fill="none"
            stroke="#DCA94A"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="3.4" fill="#C75B39" />
        </>
      )}

      {symbol === 'leaf' && (
        <>
          <path
            d="M46 16C32 16 20 24 20 38c0 5 2 8 5 10 3-10 9-17 19-22-7 6-12 13-14 23 3 1 6 1 9-1 9-5 12-17 7-32Z"
            fill="#DCA94A"
          />
          <path
            d="M20 50c4-12 12-20 24-27"
            fill="none"
            stroke="#C75B39"
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
            'font-display text-xl font-semibold leading-tight tracking-tight',
            invert ? 'text-cream' : 'text-ink',
          )}
        >
          {brand.name}
        </p>
        {!compact && (
          <p
            className={cn(
              'truncate text-[0.7rem] font-medium uppercase tracking-[0.14em]',
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
