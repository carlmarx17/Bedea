import { Link } from 'react-router-dom'
import { GARZON_QUOTE, PROJECT_STAGE } from '../config/project'

/** Aviso fino en la parte superior: la app está en pre-alfa y abierta a aportes. */
export function PreAlphaBanner() {
  return (
    <div className="bg-ochre-300 text-ink">
      <p className="container-app flex flex-wrap items-center gap-x-2 gap-y-0.5 py-2 text-sm leading-snug">
        <span className="font-bold">Ojo: esto apenas va en {PROJECT_STAGE.toLowerCase()}.</span>
        <span>Faltan muchas palabras y puede haber errores.</span>
        <Link to="/acerca" className="font-bold underline decoration-2 underline-offset-2">
          ¿Nos echas una mano?
        </Link>
      </p>
    </div>
  )
}

/** La frase de Jaime Garzón, en grande o en versión de pie de página. */
export function GarzonQuote({ variant = 'large' }: { variant?: 'large' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <figure>
        <blockquote className="font-display text-lg font-bold leading-snug text-ink">
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
        className="absolute -left-1 -top-12 select-none font-display text-[7rem] font-extrabold leading-none text-terracotta-500 sm:-left-8"
      >
        “
      </span>
      <blockquote className="relative max-w-4xl font-display text-[1.9rem] font-bold leading-[1.2] text-ink sm:text-[2.5rem] lg:text-[2.9rem]">
        {GARZON_QUOTE}
      </blockquote>
      <figcaption className="mt-6 max-w-xl border-l-4 border-terracotta-500 pl-4">
        <span className="block font-display text-xl font-extrabold text-ink">Jaime Garzón</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
          Así contaba él que quedó un artículo de la Constitución del 91 cuando lo tradujeron a una
          lengua indígena. Por eso existe este proyecto.
        </span>
      </figcaption>
    </figure>
  )
}
