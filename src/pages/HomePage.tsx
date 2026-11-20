import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP, SOON_LANGUAGES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { getCultureCapsules } from '../data/culture'
import { getWordOfTheDay, countWords } from '../lib/vocabulary'
import { LanguageCard, UpcomingLanguageCard } from '../components/LanguageCard'
import { CultureCard } from '../components/CultureCard'
import { TerritoryFlag, WordIllustration } from '../components/CulturalVisuals'
import { GarzonQuote, HandUnderline } from '../components/ProjectNotice'
import { ISSUES_URL } from '../config/project'
import { Button, SectionHeading, ProgressBar, AudioButton } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey } from '../lib/utils'

export function HomePage() {
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
      {/* Portada */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
        <div className="animate-fade-up pt-1 sm:pt-4">
          <div className="inline-flex items-center gap-2.5">
            <TerritoryFlag territory="colombia" size="sm" />
            <p className="eyebrow">Un cuaderno abierto de lenguas de Colombia</p>
          </div>
          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.05] text-ink sm:text-[3.4rem] lg:text-[4rem]">
            Aprende ẽbẽra y wayuunaiki, despacio y{' '}
            <span className="relative inline-block whitespace-nowrap">
              con respeto
              <HandUnderline className="text-terracotta-500" />
            </span>
            .
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/75 sm:text-[1.0625rem]">
            Lecciones cortas, práctica con audio y notas culturales para acercarse a dos lenguas vivas.
            Es un proyecto en <strong className="font-semibold text-ink">pre-alfa</strong>: hay {totalWords}{' '}
            palabras y faltan miles. Si hablas alguna de estas lenguas, o las estudias, puedes ayudar a
            completarlo.
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
            <Link
              to="/acerca"
              className="text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
            >
              Quiero contribuir
            </Link>
          </div>

          {/* Datos honestos del estado actual */}
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/12 pt-6">
            <div>
              <dt className="text-xs text-muted">Lenguas</dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {AVAILABLE_LANGUAGES.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Palabras, por ahora</dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {totalWords}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Estado</dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold text-terracotta-600 sm:text-3xl">
                Pre-alfa
              </dd>
            </div>
          </dl>
        </div>

        {/* Palabra del día */}
        {specimenWord && (
          <aside
            className="animate-fade-up overflow-hidden rounded-md bg-ink text-cream lg:mt-6 lg:rotate-[0.6deg]"
            style={{ animationDelay: '90ms' }}
            aria-label="Palabra del día"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="font-display text-base italic text-ochre-300">
                Palabra del día
              </span>
              <div className="inline-flex rounded-[5px] border border-white/15 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSpecimenLang('embera')}
                  className={cn(
                    'rounded-[3px] px-3 py-1 font-medium transition-colors',
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
                    'rounded-[3px] px-3 py-1 font-medium transition-colors',
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
                <div className="flex items-start gap-4">
                  <WordIllustration
                    entry={specimenWord}
                    size="md"
                    className="border-white/15 bg-sand-50"
                  />
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <TerritoryFlag territory={specimenWord.language} size="sm" />
                      <span className="text-xs text-sand-200/75">
                        {specimenWord.language === 'embera' ? 'Ẽbẽra-Chamí' : 'Wayuunaiki'}
                      </span>
                    </div>
                    <p className="native-word font-display text-3xl font-semibold leading-tight text-cream sm:text-[2.45rem]">
                      {specimenWord.palabra_nativa}
                    </p>
                    <p className="mt-1 text-sm italic text-sand-200/70">
                      /{specimenWord.guia_fonetica}/
                    </p>
                  </div>
                </div>
                <AudioButton
                  text={specimenWord.palabra_nativa}
                  audioUrl={specimenWord.audio_url}
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

      {/* La frase de Garzón y por qué existe este proyecto */}
      <section className="border-t border-ink/12 pt-16 sm:pt-20">
        <GarzonQuote />

        <div className="mt-14 grid gap-10 border-t border-ink/12 pt-10 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Desde el respeto</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Estas lenguas son de sus pueblos. Aquí no se muestran como curiosidad: cada palabra lleva
              su fuente y su contexto, y la última palabra la tienen siempre los hablantes.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Todavía en pre-alfa</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Es una versión temprana, con errores. Hay {totalWords} palabras y estas lenguas tienen
              miles. La pronunciación aún es una aproximación mientras llegan grabaciones de hablantes.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Abierto a todos</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Puedes sugerir una palabra, corregir una grafía, grabar tu voz o avisar si algo no está
              bien dicho. El código y el contenido están en GitHub.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
              <Link to="/acerca" className="text-ink underline decoration-terracotta-500 decoration-2 underline-offset-4">
                Cómo contribuir
              </Link>
              <a
                href={ISSUES_URL}
                target="_blank"
                rel="noreferrer"
                className="text-ink/75 underline decoration-ink/25 underline-offset-4 hover:text-ink"
              >
                Proponer una palabra
              </a>
            </div>
          </div>
        </div>
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
                <p className="eyebrow">Una nota antes de leer</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                  Más que un diccionario
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  Una lengua no es una lista de equivalencias al español: es una manera de nombrar el
                  territorio, el parentesco y el tiempo. Las grafías y los usos cambian entre resguardos,
                  rancherías y generaciones, así que lee estas cápsulas como una invitación a preguntar,
                  no como la versión definitiva.
                </p>
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
          eyebrow="Más adelante"
          title="Otras lenguas que queremos sumar"
          description="Solo llegarán cuando haya hablantes y comunidades que quieran acompañar el trabajo."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {SOON_LANGUAGES.map((language) => (
            <UpcomingLanguageCard key={language.id} language={language} />
          ))}
        </div>
      </section>
    </div>
  )
}
