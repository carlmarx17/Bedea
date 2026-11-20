import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBrand } from '../lib/brand'
import { useProgress } from '../lib/progress'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP, SOON_LANGUAGES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { getCultureCapsules } from '../data/culture'
import { getWordOfTheDay, countWords } from '../lib/vocabulary'
import { LanguageCard, UpcomingLanguageCard } from '../components/LanguageCard'
import { CultureCard } from '../components/CultureCard'
import { Button, SectionHeading, ProgressBar, AudioButton } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey } from '../lib/utils'

export function HomePage() {
  const { brand } = useBrand()
  const { progress, dailyGoal, level } = useProgress()
  const [specimenLang, setSpecimenLang] = useState<'embera' | 'wayuunaiki'>('embera')

  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const dailyPercent = Math.min(100, (todayXp / dailyGoal) * 100)
  const featuredCapsule = getCultureCapsules()[0]
  const emberaWord = getWordOfTheDay('embera')
  const wayuuWord = getWordOfTheDay('wayuunaiki')
  const specimenWord = specimenLang === 'embera' ? emberaWord : wayuuWord
  const totalWords = AVAILABLE_LANGUAGES.reduce((sum, lang) => sum + countWords(lang.id), 0)

  const activeLangId = progress.lastLanguage || 'embera'
  const activeLang = LANGUAGE_MAP[activeLangId] ?? AVAILABLE_LANGUAGES[0]
  const activeCurriculum = getCurriculum(activeLang.id)
  const completedInActive = progress.completedLessons[activeLang.id] ?? []
  const nextLesson =
    activeCurriculum?.lessons.find((l) => !completedInActive.includes(l.id)) ??
    activeCurriculum?.lessons[0]

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Portada editorial: abierta sobre el papel, sin cajas oscuras con orbes */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12">
        <div className="animate-fade-up pt-1 sm:pt-4">
          <p className="eyebrow">
            {brand.subtitle} · Colombia
          </p>
          <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.85rem]">
            Las voces indígenas de Colombia,{' '}
            <span className="font-normal italic text-terracotta-600">palabra a palabra.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]">
            {brand.tagline} Aprende <span className="font-medium text-ink">ẽbẽra</span> y{' '}
            <span className="font-medium text-ink">wayuunaiki</span> con lecciones guiadas,
            práctica interactiva y cápsulas culturales construidas con respeto a cada pueblo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to={
                nextLesson
                  ? `/lengua/${activeLang.id}/leccion/${nextLesson.id}`
                  : `/lengua/${activeLang.id}`
              }
            >
              <Button variant="primary" size="lg">
                <Icon name="play" size={16} />
                {completedInActive.length > 0 ? `Continuar ${activeLang.name}` : 'Empezar a aprender'}
              </Button>
            </Link>
            <Link to="/diccionario">
              <Button variant="outline" size="lg">
                Explorar diccionario
                <Icon name="arrow-right" size={15} />
              </Button>
            </Link>
          </div>

          {/* Índice editorial silencioso */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/12 pt-6">
            <div>
              <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {AVAILABLE_LANGUAGES.length}
              </p>
              <p className="mt-1 text-xs text-muted">Lenguas activas</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {totalWords}
              </p>
              <p className="mt-1 text-xs text-muted">Palabras y frases</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {getCultureCapsules().length}
              </p>
              <p className="mt-1 text-xs text-muted">Cápsulas culturales</p>
            </div>
          </div>
        </div>

        {/* Placa tipográfica de Palabra del día (tinta profunda, sin glassmorphism ni orbes) */}
        {specimenWord && (
          <aside
            className="animate-fade-up overflow-hidden rounded-2xl bg-ink text-cream"
            style={{ animationDelay: '90ms' }}
            aria-label="Palabra del día"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ochre-300">
                Palabra del día
              </span>
              <div className="inline-flex rounded-full border border-white/15 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSpecimenLang('embera')}
                  className={cn(
                    'rounded-full px-3 py-1 font-medium transition-colors',
                    specimenLang === 'embera'
                      ? 'bg-cream text-ink'
                      : 'text-sand-200/70 hover:text-cream',
                  )}
                >
                  Ẽbẽra
                </button>
                <button
                  type="button"
                  onClick={() => setSpecimenLang('wayuunaiki')}
                  className={cn(
                    'rounded-full px-3 py-1 font-medium transition-colors',
                    specimenLang === 'wayuunaiki'
                      ? 'bg-cream text-ink'
                      : 'text-sand-200/70 hover:text-cream',
                  )}
                >
                  Wayuunaiki
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="native-word font-display text-4xl font-semibold leading-tight text-cream sm:text-[2.75rem]">
                    {specimenWord.palabra_nativa}
                  </p>
                  <p className="mt-1.5 text-sm italic text-sand-200/70">
                    /{specimenWord.guia_fonetica}/
                  </p>
                </div>
                <AudioButton
                  text={specimenWord.palabra_nativa}
                  compact
                  className="border-white/20 bg-white/10 text-cream hover:border-ochre-300/60 hover:bg-white/15"
                />
              </div>

              <p className="mt-5 font-display text-xl font-medium text-ochre-200">
                {specimenWord.traduccion_espanol}
              </p>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                <p className="leading-relaxed text-sand-100/90">
                  <span className="native-word font-medium text-cream">“{specimenWord.ejemplo_uso}”</span>
                  <span className="block text-xs text-sand-200/65">{specimenWord.ejemplo_traduccion}</span>
                </p>
                <p className="text-xs leading-relaxed text-sand-200/75">
                  {specimenWord.nota_cultural}
                </p>
              </div>
            </div>

            {/* Franja discreta de avance personal */}
            <div className="border-t border-white/10 bg-jungle-950/60 px-6 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sand-200/75">
                  Nivel {level.index + 1} · <span className="font-medium text-cream">{level.title}</span>
                </span>
                <span className="tabular-nums text-ochre-200">
                  {todayXp}/{dailyGoal} XP hoy
                </span>
              </div>
              <ProgressBar value={dailyPercent} tone="ochre" height="h-1.5" className="mt-2.5 bg-white/10" />
            </div>
          </aside>
        )}
      </section>

      {/* Lenguas disponibles */}
      <section className="space-y-7 border-t border-ink/12 pt-12">
        <SectionHeading
          eyebrow="Empieza tu camino"
          title="Elige una lengua"
          description="Cada recorrido entrelaza vocabulario, pronunciación y contexto cultural. Avanza a tu propio ritmo."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {AVAILABLE_LANGUAGES.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
      </section>

      {/* Cultura y territorio */}
      {featuredCapsule && (
        <section className="space-y-7 border-t border-ink/12 pt-12">
          <SectionHeading
            eyebrow="Sabías que"
            title="Cultura y territorio"
            description="La lengua habita en el tejido, el río, la memoria y la palabra compartida."
            action={
              <Link to="/cultura" className="link-underline text-sm font-semibold text-ink">
                Ver todas las cápsulas →
              </Link>
            }
          />
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <CultureCard capsule={featuredCapsule} featured />
            <div className="flex flex-col justify-between border-t border-ink/12 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="eyebrow">Criterio editorial</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                  Más que un diccionario
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Una lengua indígena no es una lista de equivalencias al español: es una manera de
                  nombrar el territorio y el parentesco. Por eso cada entrada incluye contexto
                  cultural y fuente explícita.
                </p>
                <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                  <div className="py-3">
                    <dt className="font-semibold text-ink">Fuentes documentadas</dt>
                    <dd className="mt-0.5 text-xs text-muted">
                      Manual ẽbẽra-chamí (2013) y módulo wayuunaiki abierto a revisión comunitaria.
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-semibold text-ink">Pronunciación transparente</dt>
                    <dd className="mt-0.5 text-xs text-muted">
                      Voz sintética aproximada mientras se incorporan grabaciones de hablantes nativos.
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-semibold text-ink">Diversidad dialectal</dt>
                    <dd className="mt-0.5 text-xs text-muted">
                      Las grafías y usos varían entre resguardos, rancherías y generaciones.
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6">
                <Link to="/cultura">
                  <Button variant="outline" size="md">
                    Leer cápsulas culturales
                    <Icon name="arrow-right" size={15} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Próximamente */}
      <section className="space-y-7 border-t border-ink/12 pt-12">
        <SectionHeading
          eyebrow="En preparación"
          title="Más lenguas en camino"
          description="La plataforma está preparada para crecer junto a comunidades, maestros y hablantes."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {SOON_LANGUAGES.map((language, idx) => (
            <UpcomingLanguageCard key={language.id} language={language} index={idx + 3} />
          ))}
        </div>
      </section>
    </div>
  )
}
