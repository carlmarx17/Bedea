import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AVAILABLE_LANGUAGES, CATEGORIES, CATEGORY_MAP, LANGUAGE_MAP } from '../data/languages'
import { searchWords, VOCABULARY_META } from '../lib/vocabulary'
import { downloadJson } from '../lib/utils'
import { WordCard } from '../components/WordCard'
import { TerritoryFlag, WordIllustration } from '../components/CulturalVisuals'
import { Icon } from '../components/Icon'
import { SectionHeading, EmptyState, Badge, AudioButton, Modal, Button } from '../components/ui'
import type { CategoryId, LanguageId, VocabularyEntry } from '../types'

export function DictionaryPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<LanguageId | 'todas'>((params.get('lang') as LanguageId) || 'todas')
  const [category, setCategory] = useState<CategoryId | 'todas'>((params.get('cat') as CategoryId) || 'todas')
  const [source, setSource] = useState<'manual' | 'complemento' | 'todas'>('todas')
  const [selected, setSelected] = useState<VocabularyEntry | null>(null)

  useEffect(() => {
    const next = new URLSearchParams()
    if (language !== 'todas') next.set('lang', language)
    if (category !== 'todas') next.set('cat', category)
    setParams(next, { replace: true })
  }, [language, category, setParams])

  const results = useMemo(
    () => searchWords({ query, language, category, source }),
    [query, language, category, source],
  )

  const exportData = () => {
    downloadJson('bedea-diccionario.json', {
      meta: VOCABULARY_META,
      filtros: { query, language, category, source },
      total: results.length,
      entries: results,
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeading
        eyebrow="Diccionario"
        title="Busca y explora palabras"
        description="Filtra por lengua, categoría o fuente. Cada palabra incluye pronunciación aproximada, ejemplo de uso y nota cultural."
        action={
          <Button variant="outline" size="sm" onClick={exportData}>
            <Icon name="download" size={16} /> Exportar vista
          </Button>
        }
      />

      <div className="surface p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr]">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar palabra, traducción, ejemplo..."
              className="field pl-11"
            />
          </label>

          <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageId | 'todas')} className="field" aria-label="Filtrar por lengua">
            <option value="todas">Todas las lenguas</option>
            {AVAILABLE_LANGUAGES.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <select value={category} onChange={(event) => setCategory(event.target.value as CategoryId | 'todas')} className="field" aria-label="Filtrar por categoría">
            <option value="todas">Todas las categorías</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>

          <select value={source} onChange={(event) => setSource(event.target.value as 'manual' | 'complemento' | 'todas')} className="field" aria-label="Filtrar por fuente">
            <option value="todas">Todas las fuentes</option>
            <option value="manual">Extraídas del manual</option>
            <option value="complemento">Complementos</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="sand">{results.length} resultados</Badge>
          {language !== 'todas' && (
            <button type="button" className="chip" onClick={() => setLanguage('todas')}>
              {LANGUAGE_MAP[language]?.name} <Icon name="x" size={14} />
            </button>
          )}
          {category !== 'todas' && (
            <button type="button" className="chip" onClick={() => setCategory('todas')}>
              {CATEGORY_MAP[category]?.label} <Icon name="x" size={14} />
            </button>
          )}
          {source !== 'todas' && (
            <button type="button" className="chip" onClick={() => setSource('todas')}>
              {source === 'manual' ? 'Manual' : 'Complemento'} <Icon name="x" size={14} />
            </button>
          )}
          {(query || language !== 'todas' || category !== 'todas' || source !== 'todas') && (
            <button
              type="button"
              className="chip text-terracotta-700"
              onClick={() => {
                setQuery('')
                setLanguage('todas')
                setCategory('todas')
                setSource('todas')
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No encontramos palabras"
          description="Prueba con otra búsqueda, cambia la lengua o quita algún filtro."
          action={<Button variant="outline" onClick={() => { setQuery(''); setLanguage('todas'); setCategory('todas'); setSource('todas') }}>Ver todo</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => (
            <WordCard key={entry.id} entry={entry} onOpen={setSelected} className="relative" />
          ))}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Ficha de palabra" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <WordIllustration entry={selected} size="lg" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <TerritoryFlag territory={selected.language} size="sm" />
                    <Badge tone={selected.language === 'embera' ? 'terracotta' : 'ochre'}>
                      {LANGUAGE_MAP[selected.language]?.name}
                    </Badge>
                    <Badge tone="sand">{CATEGORY_MAP[selected.category]?.label}</Badge>
                    <Badge tone={selected.source === 'manual' ? 'jungle' : 'ochre'}>
                      {selected.source === 'manual' ? 'Manual' : 'Complemento'}
                    </Badge>
                  </div>
                  <p className="native-word mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{selected.palabra_nativa}</p>
                  <p className="mt-1 text-base italic text-muted">/{selected.guia_fonetica}/</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-jungle-800">{selected.traduccion_espanol}</p>
                </div>
              </div>
              <AudioButton text={selected.palabra_nativa} audioUrl={selected.audio_url} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Ejemplo de uso</p>
                <p className="native-word mt-2 text-sm font-semibold text-ink">{selected.ejemplo_uso}</p>
                <p className="mt-1 text-sm text-muted">{selected.ejemplo_traduccion}</p>
              </div>
              <div className="rounded-2xl border border-terracotta-100 bg-terracotta-50/70 p-4">
                <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-terracotta-700">
                  <Icon name="sparkles" size={13} /> Nota cultural
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{selected.nota_cultural}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-sand-200 p-4 text-sm text-muted">
              <p><span className="font-semibold text-ink/70">Fuente: </span>{selected.source_detail}</p>
              {selected.tags && selected.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-muted">#{tag}</span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs leading-relaxed text-muted/80">
                <Icon name="volume" size={13} className="mr-1 inline" />
                El audio usa una voz sintética aproximada en español. Los campos <code className="rounded bg-sand-100 px-1">audio_url</code> están listos para incorporar grabaciones de hablantes nativos.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
