import { useBrand } from '../lib/brand'
import { BrandMark } from '../components/BrandMark'
import { SectionHeading, Button, Badge } from '../components/ui'
import { Icon } from '../components/Icon'
import { VOCABULARY_META } from '../lib/vocabulary'
import { AVAILABLE_LANGUAGES, SOON_LANGUAGES } from '../data/languages'
import { cn } from '../lib/utils'

export function SettingsPage() {
  const { brand, brandId, presets, setBrandId } = useBrand()

  return (
    <div className="space-y-8 sm:space-y-10">
      <SectionHeading
        eyebrow="Ajustes"
        title="Ajustes"
        description="Cambia el nombre y el logo de la app, y otras preferencias."
      />

      {/* Selector de marca */}
      <section className="surface p-6 sm:p-8">
        <p className="eyebrow">Identidad de marca</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">Nombre y logo de la app</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Elige uno de los nombres propuestos o cambia <code className="rounded bg-sand-100 px-1.5 py-0.5 text-xs font-semibold text-ink">DEFAULT_BRAND_ID</code> y
          los presets en <code className="rounded bg-sand-100 px-1.5 py-0.5 text-xs font-semibold text-ink">src/config/brand.ts</code> para personalizar la identidad.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {presets.map((preset) => {
            const active = preset.id === brandId
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setBrandId(preset.id)}
                className={cn(
                  'group relative flex flex-col items-start rounded-3xl border-2 p-5 text-left transition-all',
                  active
                    ? 'border-jungle-600 bg-jungle-50/60 shadow-soft'
                    : 'border-sand-200 bg-cream hover:border-jungle-300 hover:shadow-card',
                )}
              >
                {active && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-jungle-700 text-cream">
                    <Icon name="check" size={14} />
                  </span>
                )}
                <BrandMark brand={preset} size={48} />
                <p className="mt-4 font-display text-xl font-semibold text-ink">{preset.name}</p>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{preset.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{preset.description}</p>
                <p className="mt-3 text-xs italic text-terracotta-700">“{preset.tagline}”</p>
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-jungle-200 bg-jungle-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-jungle-800">
            <Icon name="check-circle" size={16} /> Marca activa: {brand.name}
          </p>
          <p className="mt-1 text-sm text-jungle-700/80">{brand.subtitle} · {brand.tagline}</p>
        </div>
      </section>

      {/* Sobre los datos */}
      <section className="surface p-6 sm:p-8">
        <p className="eyebrow">Datos y fuentes</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">Origen del vocabulario</h3>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-ink">Fuente base: </span>
            {String((VOCABULARY_META as Record<string, unknown>).base_source ?? 'Manual ẽbẽra-chamí (2013)')}.
          </p>
          <p>{String((VOCABULARY_META as Record<string, unknown>).base_source_note ?? '')}</p>
          <p>
            <span className="font-semibold text-ink">Audio: </span>
            {String((VOCABULARY_META as Record<string, unknown>).audio_note ?? '')}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sand-200 p-4">
            <h4 className="font-display text-base font-semibold text-ink">Lenguas disponibles</h4>
            <ul className="mt-3 space-y-3">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <li key={lang.id} className="text-sm">
                  <p className="font-semibold text-ink">{lang.name} <span className="font-normal text-muted">· {lang.nativeName}</span></p>
                  <p className="text-xs leading-relaxed text-muted">{lang.sourceNote}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-sand-200 p-4">
            <h4 className="font-display text-base font-semibold text-ink">Próximamente</h4>
            <ul className="mt-3 space-y-2">
              {SOON_LANGUAGES.map((lang) => (
                <li key={lang.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink/80">{lang.name}</span>
                  <Badge tone="outline">En camino</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Para añadir una lengua: agrega sus metadatos en <code className="rounded bg-sand-100 px-1">src/data/languages.ts</code>,
              sus entradas en <code className="rounded bg-sand-100 px-1">vocabulary.json</code> y su currículo en
              <code className="rounded bg-sand-100 px-1"> src/data/curriculum.ts</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Stack y notas */}
      <section className="surface-muted p-6">
        <h3 className="font-display text-base font-semibold text-ink">Tecnología</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'React Router', 'Lucide React'].map((tech) => (
            <Badge key={tech} tone="sand">{tech}</Badge>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Aplicación web estática, sin backend. El progreso se almacena en localStorage del navegador.
          El campo <code className="rounded bg-sand-100 px-1 text-xs">audio_url</code> de cada palabra está preparado para
          enlazar grabaciones de hablantes nativos cuando estén disponibles.
        </p>
      </section>
    </div>
  )
}
