import { useMemo, useState } from 'react'
import { getCultureCapsules } from '../data/culture'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP } from '../data/languages'
import { CultureCard } from '../components/CultureCard'
import { SectionHeading, EmptyState, Modal, Badge, AudioButton } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn } from '../lib/utils'
import type { CultureCapsule } from '../types'

export function CulturePage() {
  const [filter, setFilter] = useState<string>('todas')
  const [activeCapsule, setActiveCapsule] = useState<CultureCapsule | null>(null)
  const capsules = useMemo(() => getCultureCapsules(filter === 'todas' ? undefined : filter), [filter])
  const featured = capsules[0]
  const rest = featured ? capsules.slice(1) : []

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Sabías que..."
        title="Cultura y territorio"
        description="Historias cortas que conectan las palabras con los oficios, la familia y el territorio de los pueblos ẽbẽra y wayuu. Léelas como una invitación a preguntar, no como la última palabra."
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
          {featured && <CultureCard capsule={featured} featured onOpen={setActiveCapsule} />}
          {rest.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((capsule) => (
                <CultureCard key={capsule.id} capsule={capsule} onOpen={setActiveCapsule} />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={Boolean(activeCapsule)}
        onClose={() => setActiveCapsule(null)}
        title="Cápsula cultural"
        size="lg"
      >
        {activeCapsule && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={activeCapsule.language === 'embera' ? 'terracotta' : 'ochre'}>
                {activeCapsule.language === 'embera' ? 'Ẽbẽra · Emberá' : 'Wayuunaiki'}
              </Badge>
              <Badge tone="sand">{activeCapsule.category}</Badge>
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {activeCapsule.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink/85 sm:text-base">
              {activeCapsule.body}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-4">
              <div>
                <p className="text-sm font-bold text-muted">
                  Palabra clave
                </p>
                <p className="native-word mt-1 font-display text-2xl font-semibold text-jungle-800">
                  {activeCapsule.keyword}
                </p>
                <p className="text-sm text-muted">{activeCapsule.keywordTranslation}</p>
              </div>
              <AudioButton text={activeCapsule.keyword} />
            </div>
            <p className="text-xs text-muted">
              <span className="font-semibold text-ink/70">Fuente: </span>
              {activeCapsule.source}
            </p>
          </div>
        )}
      </Modal>

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
