import { Link } from 'react-router-dom'
import { GARZON_QUOTE, PROJECT_STAGE } from '../config/project'
import { cn } from '../lib/utils'

/** Aviso fino en la parte superior: la app está en pre-alfa y abierta a aportes. */
export function PreAlphaBanner() {
  return (
    <div className="border-b border-ink/10 bg-ochre-100/80 text-ink">
      <p className="container-app flex flex-wrap items-center gap-x-2 gap-y-0.5 py-2 text-[0.78rem] leading-snug">
        <span className="font-semibold">{PROJECT_STAGE}.</span>
        <span className="text-ink/80">
          Bedea está en construcción abierta: faltan muchas palabras y puede haber errores.
        </span>
        <Link to="/acerca" className="font-semibold underline decoration-ink/30 underline-offset-2 hover:decoration-ink">
          Ayuda a completarla
        </Link>
      </p>
    </div>
  )
}

/** Subrayado a mano alzada, irregular a propósito. */
export function HandUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute -bottom-1.5 left-0 h-3 w-full', className)}
    >
      <path
        d="M2 9.5 C 30 5, 62 11.5, 96 7.2 S 158 4.4, 198 8.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M14 12 C 52 9.6, 110 11.8, 170 10.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/** La frase de Jaime Garzón, en grande o en versión de pie de página. */
export function GarzonQuote({ variant = 'large' }: { variant?: 'large' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <figure>
        <blockquote className="font-display text-base italic leading-snug text-ink">
          “{GARZON_QUOTE}”
        </blockquote>
        <figcaption className="mt-1.5 text-xs text-muted">— Jaime Garzón</figcaption>
      </figure>
    )
  }

  return (
    <figure className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-1 -top-10 select-none font-display text-[7rem] leading-none text-terracotta-500/25 sm:-left-6"
      >
        “
      </span>
      <blockquote className="relative max-w-4xl font-display text-[1.75rem] font-medium italic leading-[1.25] text-ink sm:text-[2.35rem] lg:text-[2.7rem]">
        {GARZON_QUOTE}
      </blockquote>
      <figcaption className="mt-6 max-w-xl border-l-2 border-terracotta-500 pl-4">
        <span className="block font-display text-lg font-semibold text-ink">Jaime Garzón</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
          Así contaba que quedó, al traducirlo a una lengua indígena, un artículo de la Constitución
          de 1991. Es la idea que guía este proyecto.
        </span>
      </figcaption>
    </figure>
  )
}
