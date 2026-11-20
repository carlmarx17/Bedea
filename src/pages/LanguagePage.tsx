import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AVAILABLE_LANGUAGES, LANGUAGE_MAP, CATEGORIES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { getWords, getWordOfTheDay, getLanguageCategoryCounts } from '../lib/vocabulary'
import { getDueWordIds, getMistakeWordIds } from '../lib/srs'
import { useProgress } from '../lib/progress'
import { TerritoryFlag, WordIllustration } from '../components/CulturalVisuals'
import { Button, Badge, ProgressBar, SectionHeading, AudioButton, EmptyState } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn } from '../lib/utils'

export function LanguagePage() {
  const { languageId = '' } = useParams()
  const { progress, setLastLanguage } = useProgress()
  const language = LANGUAGE_MAP[languageId]
  const curriculum = getCurriculum(languageId)

  useEffect(() => {
    if (language && language.status === 'available') {
      setLastLanguage(language.id)
    }
  }, [language, setLastLanguage])

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

  const isWayuu = language.accent === 'wayuu'
  const nextActiveLesson = orderedLessons.find((l) => !completed.includes(l.id))
  const nextActiveLessonId = nextActiveLesson?.id
  const langWordIds = new Set(getWords(languageId).map((w) => w.id))
  const dueCount = getDueWordIds(progress.cards, langWordIds).length
  const mistakeCount = getMistakeWordIds(progress.cards, langWordIds).length

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Selector editorial de lengua */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/12 pb-4">
        <div className="flex items-center gap-6">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const active = lang.id === language.id
            return (
              <Link
                key={lang.id}
                to={`/lengua/${lang.id}`}
                className={cn(
                  'relative inline-flex items-center gap-2.5 pb-1 font-display text-lg font-semibold transition-colors',
                  active ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                <TerritoryFlag territory={lang.id} size="sm" />
                {lang.name}
                {active && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-[1.06rem] h-[2px]',
                      lang.accent === 'wayuu' ? 'bg-ochre-500' : 'bg-terracotta-500',
                    )}
                  />
                )}
              </Link>
            )
          })}
        </div>
        <Link
          to={`/diccionario?lang=${language.id}`}
          className="link-underline text-xs font-semibold text-ink"
        >
          Diccionario {language.name} ({getWords(languageId).length}) →
        </Link>
      </div>

      {/* Cabecera abierta de la lengua */}
      <section className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <TerritoryFlag territory={language.id} size="md" />
            <p className="eyebrow">{language.family}</p>
          </div>
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
              {language.name}
            </h1>
            <span className="native-word font-display text-xl italic text-muted">
              {language.nativeName}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-ink/75">
            {language.dialect} · <span className="text-muted">{language.orthography}</span>
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {language.description}
          </p>

          {/* Saludo interactivo */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-ink/12 py-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Saludo para empezar
              </p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span
                  className={cn(
                    'native-word font-display text-2xl font-semibold sm:text-3xl',
                    isWayuu ? 'text-ochre-700' : 'text-terracotta-600',
                  )}
                >
                  “{language.greeting}”
                </span>
                <span className="text-sm text-muted">{language.greetingTranslation}</span>
              </p>
            </div>
            <AudioButton text={language.greeting} />
          </div>

          {/* Ficha territorial en 3 columnas limpias */}
          <dl className="mt-5 grid gap-4 text-xs sm:grid-cols-3">
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-muted">Territorio</dt>
              <dd className="mt-1 font-medium text-ink">{language.region}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-muted">Hablantes</dt>
              <dd className="mt-1 font-medium text-ink">{language.speakers}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-muted">Fuente</dt>
              <dd className="mt-1 text-muted">{language.sourceNote}</dd>
            </div>
          </dl>

          {language.caution && (
            <p className="mt-5 border-l-2 border-ochre-500 pl-3.5 text-xs leading-relaxed text-muted">
              {language.caution}
            </p>
          )}
        </div>

        {/* Columna derecha: progreso y palabra del día */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-ink p-6 text-cream">
            <div className="flex items-baseline justify-between">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ochre-300">
                Tu avance
              </p>
              <span className="text-xs tabular-nums text-sand-200/75">{Math.round(percent)}%</span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
              {completedCount}
              <span className="text-lg font-normal text-sand-200/60"> / {totalLessons} lecciones</span>
            </p>
            <ProgressBar
              value={percent}
              tone={isWayuu ? 'ochre' : 'jungle'}
              height="h-1.5"
              className="mt-4 bg-white/15"
            />
            {nextActiveLesson && (
              <div className="mt-5 border-t border-white/12 pt-4">
                <Link to={`/lengua/${languageId}/leccion/${nextActiveLesson.id}`}>
                  <Button variant="ochre" size="md" className="w-full">
                    <Icon name="play" size={15} />
                    {completedCount === 0 ? 'Comenzar lección 1' : `Seguir: ${nextActiveLesson.title}`}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {wordOfDay && (
            <div className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <WordIllustration entry={wordOfDay} size="sm" />
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                      Palabra del día
                    </p>
                    <p className="native-word mt-1 font-display text-2xl font-semibold text-ink">
                      {wordOfDay.palabra_nativa}
                    </p>
                    <p className="text-xs italic text-muted">/{wordOfDay.guia_fonetica}/</p>
                  </div>
                </div>
                <AudioButton text={wordOfDay.palabra_nativa} audioUrl={wordOfDay.audio_url} compact />
              </div>
              <p className="mt-2.5 text-sm font-semibold text-jungle-700">
                {wordOfDay.traduccion_espanol}
              </p>
            </div>
          )}
        </aside>
      </section>

      {/* Repaso espaciado y errores */}
      <section className="grid gap-4 border-t border-ink/12 pt-10 sm:grid-cols-2">
        <Link
          to={`/lengua/${languageId}/practica/srs`}
          className="surface group flex items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-ink/30"
        >
          <div>
            <p className="eyebrow">Repetición espaciada · SM-2</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">
              Repaso inteligente
            </p>
            <p className="mt-1 text-xs text-muted">
              {dueCount > 0
                ? `${dueCount} ${dueCount === 1 ? 'palabra lista' : 'palabras listas'} justo antes de olvidarlas.`
                : 'Al día. Practica una selección para entrenar tu memoria.'}
            </p>
          </div>
          <span className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-full bg-ink px-3 font-display text-sm font-semibold tabular-nums text-cream">
            {dueCount > 0 ? dueCount : '→'}
          </span>
        </Link>

        <Link
          to={`/lengua/${languageId}/practica/mistakes`}
          className="surface group flex items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-ink/30"
        >
          <div>
            <p className="eyebrow">Refuerzo dirigido</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink">
              Repaso de errores
            </p>
            <p className="mt-1 text-xs text-muted">
              {mistakeCount > 0
                ? `${mistakeCount} ${mistakeCount === 1 ? 'palabra' : 'palabras'} que fallaste antes, sin penalización.`
                : 'Sin errores pendientes. Equivocarse también es parte de aprender.'}
            </p>
          </div>
          <span className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-full border border-ink/15 bg-sand-100 px-3 font-display text-sm font-semibold tabular-nums text-ink">
            {mistakeCount > 0 ? mistakeCount : '✓'}
          </span>
        </Link>
      </section>

      {/* Modos de práctica: índice editorial numerado */}
      <section className="space-y-5 border-t border-ink/12 pt-10">
        <SectionHeading
          eyebrow="Práctica libre"
          title="Ejercicios variados"
          description="Escucha, elige imágenes, escribe con el teclado especial, graba tu voz o arma oraciones."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { num: '01', mode: 'images', label: 'Imágenes', desc: 'Escucha y elige la ilustración' },
            { num: '02', mode: 'dictation', label: 'Dictado', desc: 'Escucha y escribe con teclado especial' },
            { num: '03', mode: 'speak', label: 'Hablar', desc: 'Grábate y compara tu voz' },
            { num: '04', mode: 'flashcards', label: 'Tarjetas', desc: 'Voltea y evalúa tu memoria' },
            { num: '05', mode: 'quiz', label: 'Quiz', desc: 'Traduce en dos direcciones' },
            { num: '06', mode: 'match', label: 'Emparejar', desc: 'Conecta palabra y sentido' },
            { num: '07', mode: 'sentence', label: 'Oraciones', desc: 'Ordena expresiones reales' },
          ].map((item) => (
            <Link
              key={item.mode}
              to={`/lengua/${languageId}/practica/${item.mode}`}
              className="surface group flex flex-col justify-between p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/30"
            >
              <div className="flex items-center justify-between text-xs font-medium text-muted">
                <span className="font-display italic">{item.num}</span>
                <Icon
                  name="arrow-up-right"
                  size={15}
                  className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </div>
              <div className="mt-5">
                <p className="font-display text-xl font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Camino de aprendizaje */}
      <section className="space-y-6 border-t border-ink/12 pt-10">
        <SectionHeading
          eyebrow="Recorrido guiado"
          title="Tus lecciones"
          description="Avanza unidad por unidad. Cada lección completada abre el paso a la siguiente."
        />
        <div className="space-y-8">
          {curriculum.units.map((unit, unitIndex) => {
            const lessons = unit.lessonIds
              .map((id) => curriculum.lessons.find((l) => l.id === id))
              .filter((l): l is NonNullable<typeof l> => Boolean(l))
            const unitDone = lessons.every((l) => completed.includes(l.id))
            return (
              <div key={unit.id} className="surface overflow-hidden">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 px-6 py-5">
                  <div>
                    <p className="font-display text-xs italic text-terracotta-600">
                      Unidad 0{unitIndex + 1}
                    </p>
                    <h3 className="mt-0.5 font-display text-xl font-semibold text-ink">
                      {unit.title}
                    </h3>
                    <p className="text-sm text-muted">{unit.subtitle}</p>
                  </div>
                  {unitDone && <Badge tone="jungle">Completada</Badge>}
                </div>

                <div className="divide-y divide-ink/10">
                  {lessons.map((lesson, lessonIdx) => {
                    const isDone = completed.includes(lesson.id)
                    const unlocked = isLessonUnlocked(lesson.id)
                    const isNext = lesson.id === nextActiveLessonId
                    const isLast = lessonIdx === lessons.length - 1
                    const wordCount = getWords(languageId, lesson.category).length
                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          'relative flex items-center gap-4 px-5 py-4 transition-colors sm:px-6 sm:py-5',
                          isNext && 'bg-sand-100/70',
                          !unlocked && 'opacity-55',
                        )}
                      >
                        <div className="relative flex flex-col items-center self-stretch">
                          <span
                            className={cn(
                              'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors',
                              isDone
                                ? 'border-jungle-700 bg-jungle-700 text-cream'
                                : isNext
                                  ? 'border-ink bg-ink text-cream'
                                  : unlocked
                                    ? 'border-ink/25 bg-cream text-ink'
                                    : 'border-ink/15 bg-sand-100 text-muted',
                            )}
                          >
                            {isDone ? (
                              <Icon name="check" size={16} />
                            ) : unlocked ? (
                              <Icon name="play" size={15} />
                            ) : (
                              <Icon name="lock" size={14} />
                            )}
                          </span>
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className={cn(
                                'mt-1.5 w-px flex-1',
                                isDone ? 'bg-jungle-500' : 'border-l border-dashed border-ink/20',
                              )}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-lg font-semibold text-ink">
                              {lesson.title}
                            </p>
                            {isNext && (
                              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-terracotta-600">
                                · Siguiente
                              </span>
                            )}
                          </div>
                          <p className="native-word text-xs italic text-muted">{lesson.subtitle}</p>
                          <p className="mt-1 text-xs text-muted">{lesson.description}</p>
                          <p className="mt-1.5 text-[0.7rem] font-medium text-muted">
                            {wordCount} palabras · +{lesson.xp} XP
                          </p>
                        </div>

                        <div className="shrink-0">
                          {unlocked ? (
                            <Link to={`/lengua/${languageId}/leccion/${lesson.id}`}>
                              <Button variant={isDone ? 'outline' : 'primary'} size="sm">
                                {isDone ? 'Repasar' : 'Empezar'}
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-xs font-medium text-muted">Bloqueada</span>
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
      <section className="space-y-4 border-t border-ink/12 pt-10">
        <SectionHeading
          eyebrow="Léxico"
          title="Explora por tema"
          description="Filtra directamente el diccionario de esta lengua según la categoría."
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((cat) => (categoryCounts[cat.id] ?? 0) > 0).map((cat) => (
            <Link
              key={cat.id}
              to={`/diccionario?lang=${languageId}&cat=${cat.id}`}
              className="chip"
            >
              {cat.label}
              <span className="tabular-nums text-muted">({categoryCounts[cat.id]})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
