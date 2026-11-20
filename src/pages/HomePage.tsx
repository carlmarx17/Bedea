import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP, SOON_LANGUAGES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { getCultureCapsules } from '../data/culture'
import { getWordOfTheDay } from '../lib/vocabulary'
import { LanguageCard, UpcomingLanguageCard } from '../components/LanguageCard'
import { CultureCard } from '../components/CultureCard'
import { WordIllustration } from '../components/CulturalVisuals'
import { GarzonQuote } from '../components/ProjectNotice'
import { BeadMeter, getLangTheme } from '../components/Woven'
import { ISSUES_URL } from '../config/project'
import { Button, SectionHeading, AudioButton } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey } from '../lib/utils'

export function HomePage() {
  const { progress, dailyGoal } = useProgress()
  const [specimenLang, setSpecimenLang] = useState<'embera' | 'wayuunaiki'>('embera')

  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const featuredCapsule = getCultureCapsules()[0]
  const emberaWord = getWordOfTheDay('embera')
  const wayuuWord = getWordOfTheDay('wayuunaiki')
  const specimenWord = specimenLang === 'embera' ? emberaWord : wayuuWord

  const activeLangId = progress.lastLanguage || 'embera'
  const activeLang = LANGUAGE_MAP[activeLangId] ?? AVAILABLE_LANGUAGES[0]
  const activeCurriculum = getCurriculum(activeLang.id)
  const completedInActive = progress.completedLessons[activeLang.id] ?? []
  const nextLesson =
    activeCurriculum?.lessons.find((l) => !completedInActive.includes(l.id)) ??
    activeCurriculum?.lessons[0]

  const specimenTheme = getLangTheme(specimenWord?.language === 'wayuunaiki' ? 'wayuu' : 'embera')
  const greetings = AVAILABLE_LANGUAGES.map((lang) => ({ lang, theme: getLangTheme(lang.accent) }))

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Portada tipo cartilla: el saludo primero, en grande */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
        <div className="animate-fade-up">
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-3xl font-extrabold sm:text-4xl">
            {greetings.map(({ lang, theme }) => (
              <span key={lang.id} className={cn('native-word', theme.accentText)}>
                {lang.greeting}
              </span>
            ))}
            <span className="font-sans text-base font-medium text-muted">
              (así se saluda en {AVAILABLE_LANGUAGES.map((l) => l.name.toLowerCase()).join(' y en ')})
            </span>
          </p>
          <h1 className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.02] text-ink sm:text-[3.6rem] lg:text-[4.3rem]">
            Aprendamos ẽbẽra y wayuunaiki, palabra por palabra.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Lecciones cortas, con audio y con lo que cada palabra significa para su pueblo. Cinco
            minutos al día alcanzan para arrancar.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={
                nextLesson
                  ? `/lengua/${activeLang.id}/leccion/${nextLesson.id}`
                  : `/lengua/${activeLang.id}`
              }
            >
              <Button variant="secondary" size="lg">
                <Icon name="play" size={16} />
                {completedInActive.length > 0 ? `Seguir con ${activeLang.name}` : '¿Arrancamos?'}
              </Button>
            </Link>
            <Link to="/acerca" className="link-underline text-base font-bold text-ink">
              Hablo una de estas lenguas y quiero ayudar
            </Link>
          </div>
        </div>

        {/* Palabra del día, como una lámina */}
        {specimenWord && (
          <aside
            className={cn('animate-fade-up overflow-hidden rounded-lg text-cream lg:mt-4', specimenTheme.panel)}
            style={{ animationDelay: '90ms' }}
            aria-label="Palabra del día"
          >
            <div aria-hidden="true" className={cn('h-3', specimenTheme.stripes)} />
            <div className="flex items-center justify-between gap-3 px-6 pt-5">
              <span className="text-sm font-bold text-sand-100">Palabra del día</span>
              <div className="inline-flex rounded-full bg-black/25 p-1 text-sm">
                {(['embera', 'wayuunaiki'] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSpecimenLang(id)}
                    className={cn(
                      'rounded-full px-3.5 py-1 font-bold transition-colors',
                      specimenLang === id ? 'bg-cream text-ink' : 'text-sand-100/80 hover:text-cream',
                    )}
                  >
                    {id === 'embera' ? 'Ẽbẽra' : 'Wayuunaiki'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <WordIllustration entry={specimenWord} size="md" className="border-0 bg-cream" />
                  <div>
                    <p className="native-word font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl">
                      {specimenWord.palabra_nativa}
                    </p>
                    <p className="mt-1 text-base text-sand-100/80">se dice /{specimenWord.guia_fonetica}/</p>
                  </div>
                </div>
                <AudioButton
                  text={specimenWord.palabra_nativa}
                  audioUrl={specimenWord.audio_url}
                  compact
                  className="border-white/30 bg-white/10 text-cream hover:bg-white/20"
                />
              </div>

              <p className="mt-5 font-display text-2xl font-bold text-ochre-300">
                {specimenWord.traduccion_espanol}
              </p>

              <div className="mt-5 space-y-2 border-t border-white/15 pt-5 text-[0.95rem]">
                <p className="native-word font-bold text-cream">“{specimenWord.ejemplo_uso}”</p>
                <p className="text-sm text-sand-100/75">{specimenWord.ejemplo_traduccion}</p>
                <p className="pt-2 text-sm leading-relaxed text-sand-100/85">{specimenWord.nota_cultural}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/15 bg-black/20 px-6 py-4 text-sm">
              <span className="font-bold text-sand-100">Cuentas de hoy</span>
              <span className="flex items-center gap-3">
                <BeadMeter value={todayXp} max={dailyGoal} dark />
                <span className="tabular-nums text-sand-100/80">
                  {todayXp}/{dailyGoal}
                </span>
              </span>
            </div>
          </aside>
        )}
      </section>

      {/* Lenguas disponibles */}
      <section className="space-y-7">
        <SectionHeading
          title="¿Con cuál arrancamos?"
          description="Cada lengua tiene su camino. En wayuunaiki vas tejiendo una mochila; en ẽbẽra, ensartando un collar."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {AVAILABLE_LANGUAGES.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
      </section>

      {/* La frase de Garzón y por qué existe este proyecto */}
      <section className="border-t-2 border-ink/10 pt-14 sm:pt-20">
        <GarzonQuote />
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/80">
          Estas lenguas son de sus pueblos, y la última palabra la tienen los hablantes. Si algo está
          mal dicho o mal escrito, cuéntanos: cada corrección se agradece y queda con tu nombre.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base font-bold">
          <Link to="/acerca" className="link-underline text-ink">
            Cómo ayudar
          </Link>
          <a href={ISSUES_URL} target="_blank" rel="noreferrer" className="link-underline text-ink">
            Proponer una palabra
          </a>
        </p>
      </section>

      {/* Cultura y territorio */}
      {featuredCapsule && (
        <section className="space-y-7 border-t-2 border-ink/10 pt-12">
          <SectionHeading
            title="Cultura y territorio"
            description="Una lengua no es una lista de traducciones: es cómo se nombra el territorio, la familia y el tiempo."
            action={
              <Link to="/cultura" className="link-underline text-base font-bold text-ink">
                Ver todas →
              </Link>
            }
          />
          <div className="max-w-3xl">
            <CultureCard capsule={featuredCapsule} featured />
          </div>
        </section>
      )}

      {/* Próximamente */}
      <section className="space-y-7 border-t-2 border-ink/10 pt-12">
        <SectionHeading
          title="Las que vienen en camino"
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
