import { cn } from '../lib/utils'

/**
 * Identidad visual y metáforas de progreso de cada lengua.
 *
 * - Wayuunaiki: una mochila que se teje vuelta por vuelta (una vuelta por lección).
 * - Ẽbẽra: un collar al que se le van ensartando cuentas de chaquira (una cuenta por lección).
 *
 * Son colores planos y formas simples. No copian diseños tradicionales concretos.
 */

const WAYUU_COLORS = ['#D92A63', '#F26B1D', '#F8BC0B', '#0B9AA6', '#0A5E73']
const EMBERA_COLORS = ['#D7261E', '#F8BC0B', '#1E4FB0', '#FFFDF7', '#0E8A4C']
/** Cuentas de la meta diaria: mezcla de ambas paletas. */
const DAILY_COLORS = ['#D7261E', '#F8BC0B', '#0B9AA6', '#D92A63', '#0E8A4C']

export interface LangTheme {
  stripes: string
  panel: string
  accentText: string
  accentBg: string
  accentBorder: string
  object: string
  unit: string
}

export function getLangTheme(accent: string): LangTheme {
  if (accent === 'wayuu') {
    return {
      stripes: 'stripes-wayuu',
      panel: 'bg-wayuu-deep',
      accentText: 'text-wayuu-pink',
      accentBg: 'bg-wayuu-pink',
      accentBorder: 'border-wayuu-pink',
      object: 'Tu mochila',
      unit: 'vueltas',
    }
  }
  return {
    stripes: 'stripes-embera',
    panel: 'bg-embera-jagua',
    accentText: 'text-embera-red',
    accentBg: 'bg-embera-red',
    accentBorder: 'border-embera-red',
    object: 'Tu collar',
    unit: 'cuentas',
  }
}

/** Mochila: cada lección terminada es una vuelta de color. */
export function MochilaProgress({
  done,
  total,
  className,
  dark = false,
}: {
  done: number
  total: number
  className?: string
  dark?: boolean
}) {
  const rows = Math.max(total, 1)
  const top = 30
  const bottom = 104
  const rowH = (bottom - top) / rows
  const pending = dark ? 'rgba(255,255,255,0.14)' : 'rgba(26,21,18,0.08)'
  const line = dark ? '#FFFDF7' : '#1A1512'

  return (
    <svg
      viewBox="0 0 100 112"
      className={cn('shrink-0', className)}
      role="img"
      aria-label={`Mochila: ${done} de ${total} vueltas tejidas`}
    >
      <defs>
        <clipPath id="mochila-body">
          <path d="M14 30 H86 L84 92 Q83 106 68 106 H32 Q17 106 16 92 Z" />
        </clipPath>
      </defs>
      {/* Gaza (correa) */}
      <path d="M20 31 C14 2, 86 2, 80 31" fill="none" stroke={line} strokeWidth="4" strokeLinecap="round" />
      <g clipPath="url(#mochila-body)">
        <rect x="0" y="0" width="100" height="112" fill={pending} />
        {Array.from({ length: rows }).map((_, i) => {
          // Se teje desde el fondo hacia arriba
          const y = bottom - (i + 1) * rowH
          const filled = i < done
          return (
            <rect
              key={i}
              x="0"
              y={y}
              width="100"
              height={rowH + 0.5}
              fill={filled ? WAYUU_COLORS[i % WAYUU_COLORS.length] : 'transparent'}
              stroke={filled ? 'none' : line}
              strokeOpacity="0.12"
              strokeDasharray="3 3"
            />
          )
        })}
        <rect x="0" y={bottom} width="100" height="10" fill={done > 0 ? WAYUU_COLORS[0] : pending} />
      </g>
      <path
        d="M14 30 H86 L84 92 Q83 106 68 106 H32 Q17 106 16 92 Z"
        fill="none"
        stroke={line}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Cordón de la boca */}
      <path d="M14 30 H86" stroke={line} strokeWidth="4" />
    </svg>
  )
}

/** Collar de chaquira: cada lección terminada es una cuenta ensartada. */
export function ChaquiraProgress({
  done,
  total,
  className,
  dark = false,
}: {
  done: number
  total: number
  className?: string
  dark?: boolean
}) {
  const n = Math.max(total, 1)
  const cx = 50
  const cy = 22
  const rx = 40
  const ry = 72
  const line = dark ? '#FFFDF7' : '#1A1512'
  const pendingFill = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,21,18,0.05)'
  const pendingStroke = dark ? 'rgba(255,255,255,0.35)' : 'rgba(26,21,18,0.3)'
  const r = Math.max(4, Math.min(7.5, 150 / n))

  const beads = Array.from({ length: n }).map((_, i) => {
    // Las cuentas recorren la mitad inferior de una elipse, de izquierda a derecha
    const t = Math.PI - (Math.PI * (i + 0.5)) / n
    return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t) }
  })

  return (
    <svg
      viewBox="0 0 100 104"
      className={cn('shrink-0', className)}
      role="img"
      aria-label={`Collar: ${done} de ${total} cuentas ensartadas`}
    >
      <path
        d={`M${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`}
        fill="none"
        stroke={line}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {beads.map((b, i) => {
        const filled = i < done
        const color = EMBERA_COLORS[i % EMBERA_COLORS.length]
        return (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={r}
            fill={filled ? color : pendingFill}
            stroke={filled ? line : pendingStroke}
            strokeWidth={filled ? 1.4 : 1}
            strokeDasharray={filled ? undefined : '2 2'}
          />
        )
      })}
    </svg>
  )
}

export function LanguageProgress({
  accent,
  done,
  total,
  className,
  dark,
}: {
  accent: string
  done: number
  total: number
  className?: string
  dark?: boolean
}) {
  return accent === 'wayuu' ? (
    <MochilaProgress done={done} total={total} className={className} dark={dark} />
  ) : (
    <ChaquiraProgress done={done} total={total} className={className} dark={dark} />
  )
}

/** Hilo con cuentas para la meta diaria. */
export function BeadMeter({
  value,
  max,
  beads = 10,
  className,
  dark = false,
  height = 0.75,
}: {
  value: number
  max: number
  beads?: number
  className?: string
  dark?: boolean
  /** Alto en rem; el ancho se calcula para mantener las cuentas redondas. */
  height?: number
}) {
  const filled = max <= 0 ? 0 : Math.min(beads, Math.floor((value / max) * beads))
  const w = beads * 9 + 2
  return (
    <svg
      viewBox={`0 0 ${w} 10`}
      className={cn('shrink-0', className)}
      style={{ width: `${(w * height) / 10}rem`, height: `${height}rem` }}
      role="img"
      aria-label={`${value} de ${max} cuentas de hoy`}
    >
      <line x1="0" y1="5" x2={w} y2="5" stroke={dark ? '#FFFDF7' : '#1A1512'} strokeWidth="1" opacity="0.4" />
      {Array.from({ length: beads }).map((_, i) => (
        <circle
          key={i}
          cx={5 + i * 9}
          cy="5"
          r="3.6"
          fill={i < filled ? DAILY_COLORS[i % DAILY_COLORS.length] : dark ? '#3A332D' : '#F1DEBB'}
          stroke={i < filled ? (dark ? '#FFFDF7' : '#1A1512') : 'none'}
          strokeWidth="0.8"
        />
      ))}
    </svg>
  )
}
