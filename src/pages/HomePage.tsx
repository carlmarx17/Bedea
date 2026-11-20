import { Link } from 'react-router-dom'
import { useBrand } from '../lib/brand'
import { useProgress } from '../lib/progress'
import { AVAILABLE_LANGUAGES, SOON_LANGUAGES } from '../data/languages'
import { getCultureCapsules } from '../data/culture'
import { getWordOfTheDay, countWords } from '../lib/vocabulary'
import { LanguageCard, UpcomingLanguageCard } from '../components/LanguageCard'
import { CultureCard } from '../components/CultureCard'
import { BrandMark } from '../components/BrandMark'
import { Button, SectionHeading, StatCard, ProgressBar, AudioButton, Badge } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey } from '../lib/utils'

export function HomePage() {
  const { brand } = useBrand()
  const { progress, dailyGoal, level } = useProgress()
  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const dailyPercent = Math.min(100, (todayXp / dailyGoal) * 100)
  const featuredCapsule = getCultureCapsules()[0]
  const emberaWord = getWordOfTheDay('embera')
  const wayuuWord = getWordOfTheDay('wayuunaiki')
  const totalWords = AVAILABLE_LANGUAGES.reduce((sum, lang) => sum + countWords(lang.id), 0)

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-4xl border border-jungle-800/20 bg-gradient-to-br from-jungle-900 via-jungle-800 to-jungle-950 p-6 text-cream shadow-lift sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ochre-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-terracotta-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-ochre-100">
              <Icon name="sparkles" size={14} />
              Lenguas vivas · Aprendizaje respetuoso
            </div>
            <div className="mb-4 flex items-center gap-3">
              <BrandMark size={52} />
              <div>
                <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{brand.name}</p>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-sand-200/80">{brand.subtitle}</p>
              </div>
            </div>
            <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-shadow-soft sm:text-4xl lg:text-5xl">
              Aprende las voces indígenas de Colombia, palabra a palabra.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand-100/85 sm:text-base">
              {brand.tagline} Explora ẽbẽra y wayuunaiki con lecciones, juegos y cápsulas culturales creadas
              con respeto a las comunidades y sus saberes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/lengua/${progress.lastLanguage || 'embera'}`}>
                <Button variant="ochre" size="lg">
                  <Icon name="play" size={18} />
                  Continuar aprendiendo
                </Button>
              </Link>
              <Link to="/diccionario">
                <Button variant="outline" size="lg" className="border-white/25 bg-white/5 text-cream hover:border-white/40 hover:bg-white/10">
                  <Icon name="book" size={18} />
                  Explorar diccionario
                </Button>
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-sand-200/80">
              <span className="inline-flex items-center gap-1.5"><Icon name="languages" size={14} /> {AVAILABLE_LANGUAGES.length} lenguas disponibles</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="book" size={14} /> {totalWords} palabras y frases</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="sparkles" size={14} /> {getCultureCapsules().length} cápsulas culturales</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ochre-200">Tu avance de hoy</p>
                <Badge tone="ochre" className="border-ochre-300/30 bg-ochre-400/20 text-ochre-100">Nivel {level.index + 1}</Badge>
              </div>
              <p className="mt-2 font-display text-2xl font-semibold">{level.title}</p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-sand-200/80">
                  <span>Meta diaria</span>
                  <span className="tabular-nums text-cream">{todayXp}/{dailyGoal} XP</span>
                </div>
                <ProgressBar value={dailyPercent} tone="ochre" height="h-2.5" className="bg-white/15" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <Icon name="zap" size={18} className="mx-auto text-ochre-200" />
                  <p className="mt-1 font-display text-lg font-semibold">{progress.xp}</p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-sand-200/70">XP total</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <Icon name="flame" size={18} className="mx-auto text-terracotta-300" />
                  <p className="mt-1 font-display text-lg font-semibold">{progress.streak}</p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-sand-200/70">Racha</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <Icon name="medal" size={18} className="mx-auto text-sand-100" />
                  <p className="mt-1 font-display text-lg font-semibold">{progress.medals.length}</p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-sand-200/70">Medallas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Palabras del día */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="Palabra del día"
          title="Una palabra para hoy"
          description="Cada día destacamos una voz de cada lengua. Escucha la pronunciación aproximada y descubre su contexto."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {[emberaWord, wayuuWord].filter(Boolean).map((word) => word && (
            <div key={word.id} className="surface p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone={word.language === 'embera' ? 'terracotta' : 'ochre'}>
                    {word.language === 'embera' ? 'Ẽbẽra · Emberá' : 'Wayuunaiki'}
                  </Badge>
                  <p className="native-word mt-4 font-display text-3xl font-semibold text-ink">{word.palabra_nativa}</p>
                  <p className="mt-1 text-sm italic text-muted">[{word.guia_fonetica}]</p>
                </div>
                <AudioButton text={word.palabra_nativa} />
              </div>
              <p className="mt-3 text-lg font-semibold text-jungle-800">{word.traduccion_espanol}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink/70">Ejemplo: </span>
                {word.ejemplo_uso} — {word.ejemplo_traduccion}
              </p>
              <p className="mt-3 rounded-2xl bg-sand-50 p-3 text-xs leading-relaxed text-muted">
                <span className="font-semibold text-terracotta-700">Nota cultural: </span>
                {word.nota_cultural}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lenguas disponibles */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Empieza aquí"
          title="Elige una lengua"
          description="Cada camino combina vocabulario, pronunciación y cultura. Puedes explorar ambas lenguas a tu ritmo."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {AVAILABLE_LANGUAGES.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
      </section>

      {/* Cultura destacada */}
      {featuredCapsule && (
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Sabías que..."
            title="Cultura y territorio"
            description="La lengua vive en la tierra, el tejido, la memoria y la palabra compartida."
            action={
              <Link to="/cultura">
                <Button variant="outline" size="sm">Ver todas <Icon name="arrow-right" size={15} /></Button>
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <CultureCard capsule={featuredCapsule} featured />
            <div className="surface flex flex-col justify-center p-6">
              <p className="eyebrow">Aprender con respeto</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">Más que palabras</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Cada entrada incluye una nota cultural porque una lengua no es solo un diccionario: es una forma
                de habitar el mundo. Este material es una invitación a escuchar a los hablantes y a reconocer la
                diversidad de cada pueblo.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-0.5 text-jungle-600" />Fuentes citadas: manual ẽbẽra-chamí y módulo wayuunaiki en revisión.</li>
                <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-0.5 text-jungle-600" />Pronunciación con voz sintética aproximada mientras se suman voces nativas.</li>
                <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-0.5 text-jungle-600" />Ortografías y significados pueden variar entre comunidades.</li>
              </ul>
              <div className="mt-5">
                <Link to="/cultura">
                  <Button variant="secondary" size="sm">Explorar cápsulas culturales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Próximamente */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="Próximamente"
          title="Más lenguas en camino"
          description="La arquitectura está lista para crecer. Estas lenguas se sumarán con materiales revisados junto a sus comunidades."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {SOON_LANGUAGES.map((language) => (
            <UpcomingLanguageCard key={language.id} language={language} />
          ))}
        </div>
      </section>
    </div>
  )
}
