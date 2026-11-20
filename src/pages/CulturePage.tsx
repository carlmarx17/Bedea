import { useMemo, useState } from 'react'
import { getCultureCapsules } from '../data/culture'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP } from '../data/languages'
import { CultureCard } from '../components/CultureCard'
import { SectionHeading, EmptyState } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn } from '../lib/utils'

export function CulturePage() {
  const [filter, setFilter] = useState<string>('todas')
  const capsules = useMemo(() => getCultureCapsules(filter === 'todas' ? undefined : filter), [filter])
  const featured = capsules[0]
  const rest = featured ? capsules.slice(1) : []

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Sabías que..."
        title="Cultura, territorio y memoria"
        description="Cada lengua guarda una forma de ver el mundo. Estas cápsulas conectan palabras con historias, oficios y saberes de los pueblos ẽbẽra y wayuu."
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter('todas')} className={cn('chip', filter === 'todas' && 'chip-active')}>Todas</button>
        {AVAILABLE_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setFilter(lang.id)}
            className={cn('chip', filter === lang.id && 'chip-active')}
          >
            {lang.name}
          </button>
        ))}
      </div>

      {capsules.length === 0 ? (
        <EmptyState icon="sparkles" title="No hay cápsulas" description="Pronto sumaremos más contenidos culturales para esta lengua." />
      ) : (
        <div className="space-y-6">
          {featured && <CultureCard capsule={featured} featured />}
          {rest.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((capsule) => (
                <CultureCard key={capsule.id} capsule={capsule} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="surface-muted p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-jungle-100 text-jungle-700">
            <Icon name="heart" size={20} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Aprender con respeto</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Las cápsulas culturales son una invitación a conocer, no un reemplazo de la voz de las comunidades.
              La ortografía, los significados y las prácticas varían entre territorios y familias. Cuando sea posible,
              aprende con hablantes, maestros y autoridades de cada pueblo.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li><span className="font-semibold text-ink/70">Ẽbẽra: </span>{LANGUAGE_MAP.embera?.sourceNote}</li>
              <li><span className="font-semibold text-ink/70">Wayuunaiki: </span>{LANGUAGE_MAP.wayuunaiki?.sourceNote}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
