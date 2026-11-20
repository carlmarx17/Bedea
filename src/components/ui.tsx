import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'
import { isSpeechSupported, speak } from '../lib/speech'
import { cn } from '../lib/utils'

/* ------------------------------------------------------------------ */
/* Botones                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ochre' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ochre: 'btn-ochre',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn('btn', BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Etiquetas y badges                                                  */
/* ------------------------------------------------------------------ */

type BadgeTone = 'jungle' | 'ochre' | 'terracotta' | 'coral' | 'sand' | 'outline'

const BADGE_TONES: Record<BadgeTone, string> = {
  jungle: 'bg-jungle-100 text-jungle-800 border-jungle-200',
  ochre: 'bg-ochre-100 text-ochre-800 border-ochre-200',
  terracotta: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
  coral: 'bg-coral-400/15 text-coral-600 border-coral-400/30',
  sand: 'bg-sand-100 text-muted border-sand-200',
  outline: 'bg-transparent text-muted border-sand-300',
}

export function Badge({
  children,
  tone = 'sand',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Progreso                                                            */
/* ------------------------------------------------------------------ */

type ProgressTone = 'jungle' | 'ochre' | 'terracotta'

const PROGRESS_TONES: Record<ProgressTone, string> = {
  jungle: 'bg-jungle-600',
  ochre: 'bg-ochre-400',
  terracotta: 'bg-terracotta-500',
}

export function ProgressBar({
  value,
  tone = 'jungle',
  className,
  label,
  height = 'h-2.5',
}: {
  value: number
  tone?: ProgressTone
  className?: string
  label?: string
  height?: string
}) {
  const safe = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-sand-200/80', height, className)}
      role="progressbar"
      aria-valuenow={Math.round(safe)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', PROGRESS_TONES[tone])}
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Encabezado de sección                                               */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tarjeta de estadística                                              */
/* ------------------------------------------------------------------ */

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = 'jungle',
  className,
}: {
  icon: string
  label: string
  value: ReactNode
  hint?: string
  tone?: 'jungle' | 'ochre' | 'terracotta' | 'sand'
  className?: string
}) {
  const tones = {
    jungle: 'bg-jungle-100 text-jungle-700',
    ochre: 'bg-ochre-100 text-ochre-700',
    terracotta: 'bg-terracotta-100 text-terracotta-700',
    sand: 'bg-sand-100 text-muted',
  }
  return (
    <div className={cn('surface flex items-center gap-3.5 p-4', className)}>
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', tones[tone])}>
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="font-display text-xl font-semibold leading-tight text-ink">{value}</p>
        {hint && <p className="truncate text-xs text-muted">{hint}</p>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Estado vacío                                                        */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-sand-100 text-muted">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Botón de audio                                                      */
/* ------------------------------------------------------------------ */

export function AudioButton({
  text,
  compact = false,
  className,
}: {
  text: string
  compact?: boolean
  className?: string
}) {
  const supported = isSpeechSupported()
  const handleClick = () => speak(text)

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!supported}
      title={
        supported
          ? 'Escuchar una pronunciación aproximada (voz sintética en español)'
          : 'Tu navegador no permite reproducir voz'
      }
      aria-label={`Escuchar pronunciación aproximada de ${text}`}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full border border-jungle-200 bg-jungle-50 font-semibold text-jungle-700 transition-colors hover:border-jungle-300 hover:bg-jungle-100 disabled:cursor-not-allowed disabled:opacity-40',
        compact ? 'h-8 w-8' : 'px-3 py-1.5 text-xs',
        className,
      )}
    >
      <Icon name="volume" size={compact ? 15 : 14} />
      {!compact && <span>Escuchar</span>}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Modal accesible                                                     */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-jungle-950/45 backdrop-blur-sm animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-4xl border border-sand-200 bg-cream p-5 shadow-lift animate-slide-up sm:rounded-4xl sm:p-7 sm:animate-pop-in',
          widths[size],
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-200 text-muted transition-colors hover:bg-sand-100 hover:text-ink"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Barra de progreso de pasos (lecciones y juegos)                     */
/* ------------------------------------------------------------------ */

export function StepProgress({
  current,
  total,
  onExit,
  label,
}: {
  current: number
  total: number
  onExit?: () => void
  label?: string
}) {
  const percentage = total === 0 ? 0 : (current / total) * 100
  return (
    <div className="flex items-center gap-3">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          aria-label="Salir"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-cream text-muted transition-colors hover:bg-sand-100 hover:text-ink"
        >
          <Icon name="x" size={17} />
        </button>
      )}
      <div className="flex-1">
        <ProgressBar value={percentage} height="h-3" tone="jungle" label={label ?? 'Progreso'} />
      </div>
      <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">
        {Math.min(current, total)}/{total}
      </span>
    </div>
  )
}
