import { cn } from '../lib/utils'

/**
 * Cenefa geométrica inspirada en el tejido tradicional (rombos chaquira / kanasü).
 * Se usa como acento sutil en cabeceras, tarjetas destacadas y pantallas de celebración.
 */
export function TextileBorder({
  className,
  tone = 'gold',
}: {
  className?: string
  tone?: 'gold' | 'terracotta' | 'jungle'
}) {
  const stroke =
    tone === 'terracotta' ? '#C75B39' : tone === 'jungle' ? '#3D7A5E' : '#DCA94A'
  const dot =
    tone === 'terracotta' ? '#DCA94A' : tone === 'jungle' ? '#DCA94A' : '#C75B39'

  return (
    <div
      aria-hidden="true"
      className={cn('h-3 w-full overflow-hidden opacity-85', className)}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern
            id={`woven-strip-${tone}`}
            width="28"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 6 L7 1 L14 6 L7 11 Z M14 6 L21 1 L28 6 L21 11 Z"
              fill="none"
              stroke={stroke}
              strokeWidth="1.2"
              strokeOpacity="0.65"
            />
            <circle cx="7" cy="6" r="1.4" fill={dot} fillOpacity="0.85" />
            <circle cx="21" cy="6" r="1.4" fill={dot} fillOpacity="0.85" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#woven-strip-${tone})`} />
      </svg>
    </div>
  )
}

/**
 * Fondo sutil de trama geométrica para héroes y tarjetas oscuras.
 */
export function TextileLattice({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <defs>
        <pattern
          id="bedea-lattice"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 4 L52 28 L28 52 L4 28 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <path
            d="M28 16 L40 28 L28 40 L16 28 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
          />
          <circle cx="28" cy="28" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bedea-lattice)" />
    </svg>
  )
}
