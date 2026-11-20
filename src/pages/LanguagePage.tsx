import { Link, useParams } from 'react-router-dom'
import { LANGUAGE_MAP, CATEGORIES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { getWords, getWordOfTheDay, getLanguageCategoryCounts } from '../lib/vocabulary'
import { useProgress } from '../lib/progress'
import { Button, Badge, ProgressBar, SectionHeading, AudioButton, EmptyState } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn } from '../lib/utils'

export function LanguagePage() {
  const { languageId = '' } = useParams()
  const { progress } = useProgress()
  const language = LANGUAGE_MAP[languageId]
  const curriculum = getCurriculum(languageId)

  if (!language) {
    return (
      <EmptyState
        icon="languages"
        title="Lengua no encontrada"
        description="La lengua que buscas no está disponible todavía."
        action={<Link to="/"><Button>Volver al inicio</Button></Link>}
      />
    )
  }

  if (language.status === 'soon' || !curriculum) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <EmptyState
          icon="clock"
          title={`${language.name} llegará pronto`}
          description={language.sourceNote}
          action={<Link to="/"><Button variant="outline">Explorar lenguas disponibles</Button></Link>}
        />
      </div>
    )
  }

  const completed = progress.completedLessons[languageId] ?? []
  const totalLessons = curriculum.lessons.length
  const completedCount = curriculum.lessons.filter((l) => completed.includes(l.id)).length
  const percent = totalLessons === 0 ? 0 : (completedCount / totalLessons) * 100
  const wordOfDay = getWordOfTheDay(languageId)
  const categoryCounts = getLanguageCategoryCounts(languageId)
  const orderedLessons = curriculum.units.flatMap((unit) =>
    unit.lessonIds
      .map((id) => curriculum.lessons.find((l) => l.id === id))
      .filter((l): l is NonNullable<typeof l> => Boolean(l)),
  )

  const isLessonUnlocked = (lessonId: string) => {
    const index = orderedLessons.findIndex((l) => l.id === lessonId)
    if (index <= 0) return true
    return completed.includes(orderedLessons[index - 1].id)
  }

  const accent = language.accent === 'wayuu' ? 'ochre' : 'jungle'

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Encabezado de la lengua */}
      <section className="surface overflow-hidden">
        <div className={cn('h-2 w-full bg-gradient-to-r', language.accent === 'wayuu' ? 'from-ochre-400 to-ochre-600' : 'from-terracotta-500 to-jungle-700')} />
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div>
            <p className="eyebrow">{language.family}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{language.name}</h1>
            <p className="native-word mt-1 text-lg font-medium text-muted">{language.nativeName}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{language.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="sand"><Icon name="map-pin" size={13} className="mr-1" />{language.region}</Badge>
              <Badge tone="sand"><Icon name="users" size={13} className="mr-1" />{language.speakers}</Badge>
              <Badge tone="sand"><Icon name="book" size={13} className="mr-1" />{getWords(languageId).length} palabras</Badge>
            </div>

            <div className={cn('mt-5 rounded-2xl p-4', language.accent === 'wayuu' ? 'bg-ochre-50' : 'bg-terracotta-50')}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Saludo para empezar</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className={cn('native-word font-display text-2xl font-semibold', language.accent === 'wayuu' ? 'text-ochre-700' : 'text-terracotta-700')}>
                  {language.greeting}
                </span>
                <span className="text-sm text-muted">{language.greetingTranslation}</span>
                <AudioButton text={language.greeting} compact />
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-ink/70">Comunidad: </span>{language.community}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-ink/70">Fuente: </span>{language.sourceNote}
            </p>
            {language.caution && (
              <p className="mt-2 rounded-xl border border-ochre-200 bg-ochre-50/70 px-3 py-2 text-xs leading-relaxed text-ochre-800">
                <Icon name="info" size={14} className="mr-1 inline text-ochre-600" />
                {language.caution}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Tu progreso en {language.name}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink">{completedCount}<span className="text-lg text-muted">/{totalLessons}</span></p>
              <p className="text-sm text-muted">lecciones completadas</p>
              <ProgressBar value={percent} tone={accent} className="mt-3" />
              <p className="mt-2 text-xs font-medium text-muted">{Math.round(percent)}% del camino</p>
            </div>

            {wordOfDay && (
              <div className="surface-muted p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Palabra del día</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="native-word font-display text-xl font-semibold text-ink">{wordOfDay.palabra_nativa}</span>
                  <AudioButton text={wordOfDay.palabra_nativa} compact />
                </div>
                <p className="text-sm font-medium text-jungle-800">{wordOfDay.traduccion_espanol}</p>
                <p className="mt-1 text-xs italic text-muted">[{wordOfDay.guia_fonetica}]</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modos de práctica */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="Practica"
          title="Juegos y repaso"
          description="Refuerza lo aprendido con diferentes formas de practicar."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { mode: 'flashcards', icon: 'layers', label: 'Tarjetas', desc: 'Voltea y memoriza' },
            { mode: 'quiz', icon: 'target', label: 'Quiz', desc: 'Elige la respuesta' },
            { mode: 'match', icon: 'puzzle', label: 'Emparejar', desc: 'Une palabra y significado' },
            { mode: 'sentence', icon: 'pen', label: 'Oraciones', desc: 'Ordena las palabras' },
          ].map((item) => (
            <Link
              key={item.mode}
              to={`/lengua/${languageId}/practica/${item.mode}`}
              className="surface group flex flex-col items-center gap-2 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
            >
              <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl transition-colors', language.accent === 'wayuu' ? 'bg-ochre-100 text-ochre-700 group-hover:bg-ochre-200' : 'bg-jungle-100 text-jungle-700 group-hover:bg-jungle-200')}>
                <Icon name={item.icon} size={22} />
              </span>
              <span className="font-display text-base font-semibold text-ink">{item.label}</span>
              <span className="text-xs text-muted">{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Camino de aprendizaje */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Camino de aprendizaje"
          title="Tus lecciones"
          description="Avanza unidad por unidad. Cada lección completada desbloquea la siguiente."
        />
        <div className="space-y-6">
          {curriculum.units.map((unit, unitIndex) => {
            const lessons = unit.lessonIds
              .map((id) => curriculum.lessons.find((l) => l.id === id))
              .filter((l): l is NonNullable<typeof l> => Boolean(l))
            const unitDone = lessons.every((l) => completed.includes(l.id))
            return (
              <div key={unit.id} className="surface overflow-hidden">
                <div className={cn('flex items-center gap-4 border-b border-sand-200/80 p-5 sm:p-6', unitDone && 'bg-jungle-50/50')}>
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold', unitDone ? 'bg-jungle-700 text-cream' : 'bg-sand-100 text-ink')}>
                    {unitDone ? <Icon name="check" size={18} /> : unitIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold text-ink">{unit.title}</h3>
                    <p className="text-sm text-muted">{unit.subtitle}</p>
                  </div>
                  {unitDone && <Badge tone="jungle">Completada</Badge>}
                </div>
                <div className="divide-y divide-sand-200/70">
                  {lessons.map((lesson) => {
                    const isDone = completed.includes(lesson.id)
                    const unlocked = isLessonUnlocked(lesson.id)
                    const wordCount = getWords(languageId, lesson.category).length
                    return (
                      <div key={lesson.id} className={cn('flex items-center gap-4 p-4 sm:p-5', !unlocked && 'opacity-60')}>
                        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2', isDone ? 'border-jungle-600 bg-jungle-600 text-cream' : unlocked ? 'border-ochre-300 bg-ochre-50 text-ochre-700' : 'border-sand-300 bg-sand-100 text-muted')}>
                          {isDone ? <Icon name="check" size={18} /> : unlocked ? <Icon name="play" size={17} /> : <Icon name="lock" size={16} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base font-semibold text-ink">{lesson.title}</p>
                          <p className="native-word text-xs text-muted">{lesson.subtitle}</p>
                          <p className="mt-0.5 text-xs text-muted">{lesson.description}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold text-muted">
                            <span className="inline-flex items-center gap-1"><Icon name="book" size={12} />{wordCount} palabras</span>
                            <span className="inline-flex items-center gap-1"><Icon name="zap" size={12} className="text-ochre-500" />+{lesson.xp} XP</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {unlocked ? (
                            <Link to={`/lengua/${languageId}/leccion/${lesson.id}`}>
                              <Button variant={isDone ? 'outline' : 'primary'} size="sm">
                                {isDone ? 'Repasar' : 'Empezar'}
                              </Button>
                            </Link>
                          ) : (
                            <Badge tone="outline"><Icon name="lock" size={12} className="mr-1" />Bloqueada</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categorías del léxico */}
      <section className="space-y-4">
        <SectionHeading eyebrow="Léxico" title="Categorías de vocabulario" description="Explora las palabras de esta lengua en el diccionario." />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((cat) => (categoryCounts[cat.id] ?? 0) > 0).map((cat) => (
            <Link
              key={cat.id}
              to={`/diccionario?lang=${languageId}&cat=${cat.id}`}
              className="chip"
            >
              <Icon name={cat.icon} size={15} />
              {cat.label}
              <span className="ml-0.5 rounded-full bg-sand-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-muted">{categoryCounts[cat.id]}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
