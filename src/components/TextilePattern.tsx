import { cn } from '../lib/utils'

/**
 * Franja de colores planos que separa secciones.
 *
 * A propósito NO imita kanasü wayuu ni diseños de chaquira ẽbẽra: esos diseños tienen nombre,
 * dueño y significado. Si una tejedora o una comunidad comparte uno con permiso, se agrega
 * aquí con su crédito.
 */
export function TextileBorder({
  className,
  tone = 'gold',
}: {
  className?: string
  tone?: 'gold' | 'terracotta' | 'jungle' | 'wayuu' | 'embera'
}) {
  const stripes =
    tone === 'wayuu' || tone === 'gold'
      ? 'stripes-wayuu'
      : tone === 'embera' || tone === 'terracotta'
        ? 'stripes-embera'
        : 'stripes-colombia'
  return <div aria-hidden="true" className={cn('h-2 w-full', stripes, className)} />
}
