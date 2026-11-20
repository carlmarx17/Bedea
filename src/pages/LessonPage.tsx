import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LANGUAGE_MAP, CATEGORY_MAP } from '../data/languages'
import { getLesson, getCurriculum } from '../data/curriculum'
import { getCultureCapsules } from '../data/culture'
import { getWords, buildTranslationOptions, buildNativeOptions } from '../lib/vocabulary'
import { useProgress } from '../lib/progress'
import { TerritoryFlag, WordIllustration } from '../components/CulturalVisuals'
import { Button, Badge, StepProgress, AudioButton } from '../components/ui'
import { TextileBorder } from '../components/TextilePattern'
import { Icon } from '../components/Icon'
import { cn, shuffle } from '../lib/utils'
import type { VocabularyEntry } from '../types'

type Phase = 'intro' | 'learn' | 'practice' | 'complete'

interface Question {
  id: string
  entry: VocabularyEntry
  direction: 'native-to-es' | 'es-to-native'
  prompt: string
  options: string[]
  correct: string
}

function buildQuestions(words: VocabularyEntry[]): Question[] {
  const pool = shuffle(words).slice(0, Math.min(6, words.length))
  return pool.map((entry, index) => {
    const direction: Question['direction'] = index % 2 === 0 ? 'native-to-es' : 'es-to-native'
    if (direction === 'native-to-es') {
      return {
        id: `q-${entry.id}-${index}`,
        entry,
        direction,
        prompt: entry.palabra_nativa,
        options: buildTranslationOptions(entry, 4),
        correct: entry.traduccion_espanol,
      }
    }
    return {
      id: `q-${entry.id}-${index}`,
      entry,
      direction,
      prompt: entry.traduccion_espanol,
      options: buildNativeOptions(entry, 4),
      correct: entry.palabra_nativa,
    }
  })
}

export function LessonPage() {
  const { languageId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const { completeLesson, recordAnswer, markWordsSeen } = useProgress()

  const language = LANGUAGE_MAP[languageId]
  const lesson = getLesson(languageId, lessonId)
  const curriculum = getCurriculum(languageId)
  const words = useMemo(() => (language && lesson ? getWords(languageId, lesson.category) : []), [language, languageId, lesson])
  const questions = useMemo(() => buildQuestions(words), [words])

  const [phase, setPhase] = useState<Phase>('intro')
  const [learnIndex, setLearnIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [awardedXp, setAwardedXp] = useState(0)
  const [wasNewCompletion, setWasNewCompletion] = useState(false)

  // Reinicia el estado cuando el usuario pasa directamente a la siguiente lección.
  useEffect(() => {
    setPhase('intro')
    setLearnIndex(0)
    setQuestionIndex(0)
    setSelected(null)
    setAnswered(false)
    setCorrectCount(0)
    setAwardedXp(0)
    setWasNewCompletion(false)
  }, [languageId, lessonId])

  const orderedLessons = useMemo(
    () =>
      curriculum
        ? curriculum.units.flatMap((unit) =>
            unit.lessonIds
              .map((id) => curriculum.lessons.find((l) => l.id === id))
              .filter((l): l is NonNullable<typeof l> => Boolean(l)),
          )
        : [],
    [curriculum],
  )
  const currentLessonOrderIndex = orderedLessons.findIndex((l) => l.id === lessonId)
  const nextLessonInPath =
    currentLessonOrderIndex >= 0 && currentLessonOrderIndex < orderedLessons.length - 1
      ? orderedLessons[currentLessonOrderIndex + 1]
      : null

  if (!language || !lesson || !curriculum || words.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-sand-50 p-6">
        <div className="surface max-w-md p-8 text-center">
          <Icon name="book" size={32} className="mx-auto text-muted" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Lección no disponible</h1>
          <p className="mt-2 text-sm text-muted">No encontramos esta lección o aún no tiene palabras.</p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate(languageId ? `/lengua/${languageId}` : '/')}>Volver</Button>
          </div>
        </div>
      </div>
    )
  }

  const category = CATEGORY_MAP[lesson.category]
  const currentWord = words[learnIndex]
  const currentQuestion = questions[questionIndex]

  const exit = () => navigate(`/lengua/${languageId}`)

  const startLearn = () => {
    markWordsSeen(words.map((word) => word.id))
    setPhase('learn')
  }

  const nextLearn = () => {
    if (learnIndex < words.length - 1) {
      setLearnIndex((index) => index + 1)
    } else {
      setPhase(questions.length > 0 ? 'practice' : 'complete')
      if (questions.length === 0) finalizeLesson()
    }
  }

  const prevLearn = () => {
    if (learnIndex > 0) setLearnIndex((index) => index - 1)
  }

  const finalizeLesson = () => {
    const wasNew = completeLesson(languageId, lesson.id, lesson.xp)
    setWasNewCompletion(wasNew)
    setAwardedXp(wasNew ? lesson.xp : Math.max(2, Math.round(lesson.xp * 0.2)))
  }

  const submitAnswer = (option: string) => {
    if (answered || !currentQuestion) return
    const correct = option === currentQuestion.correct
    setSelected(option)
    setAnswered(true)
    recordAnswer(correct, currentQuestion.entry.id)
    if (correct) setCorrectCount((count) => count + 1)
  }

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      finalizeLesson()
      setPhase('complete')
    }
  }

  useEffect(() => {
    if (phase !== 'practice' || !currentQuestion) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!answered) {
        const idx = Number(event.key) - 1
        if (idx >= 0 && idx < currentQuestion.options.length) {
          submitAnswer(currentQuestion.options[idx])
        }
      } else if (event.key === 'Enter') {
        nextQuestion()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const progressTotal =
    phase === 'learn'
      ? words.length
      : phase === 'practice'
        ? questions.length
        : 1
  const progressCurrent =
    phase === 'learn'
      ? learnIndex + 1
      : phase === 'practice'
        ? questionIndex + (answered ? 1 : 0)
        : 1

  return (
    <div className="min-h-dvh bg-sand-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        {phase !== 'intro' && phase !== 'complete' && (
          <StepProgress
            current={progressCurrent}
            total={progressTotal}
            onExit={exit}
            label="Progreso de la lección"
          />
        )}

        {/* Intro */}
        {phase === 'intro' && (
          <div className="flex flex-1 flex-col justify-center py-6 animate-fade-up">
            <button type="button" onClick={exit} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
              <Icon name="arrow-left" size={16} /> Volver a {language.name}
            </button>
            <div className="surface overflow-hidden">
              <TextileBorder tone={language.accent === 'wayuu' ? 'gold' : 'terracotta'} />
              <div className="p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-2.5">
                  <TerritoryFlag territory={language.id} size="sm" />
                  <Badge tone={language.accent === 'wayuu' ? 'ochre' : 'terracotta'}>
                    {language.name} · {category?.label ?? lesson.category}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted">{language.dialect}</p>
              <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{lesson.title}</h1>
              <p className="native-word mt-2 text-lg font-medium text-muted">{lesson.subtitle}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{lesson.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Palabras</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">{words.length}</p>
                </div>
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Práctica</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">{questions.length}</p>
                  <p className="text-xs text-muted">preguntas</p>
                </div>
                <div className="rounded-2xl bg-ochre-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ochre-700">Recompensa</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ochre-800">+{lesson.xp} XP</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={startLearn}>
                  <Icon name="play" size={18} /> Comenzar lección
                </Button>
                <Button variant="outline" size="lg" onClick={exit}>Más tarde</Button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted">
                <Icon name="volume" size={14} className="mr-1 inline text-jungle-600" />
                La pronunciación usa una voz sintética aproximada en español mientras se incorporan grabaciones de hablantes nativos.
              </p>
              </div>
            </div>
          </div>
        )}

        {/* Learn */}
        {phase === 'learn' && currentWord && (
          <div className="flex flex-1 flex-col py-6 animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone="sand">Aprende · {learnIndex + 1} de {words.length}</Badge>
              <Badge tone={currentWord.source === 'manual' ? 'jungle' : 'ochre'}>
                {currentWord.source === 'manual' ? 'Manual' : 'Complemento'}
              </Badge>
            </div>

            <div className="surface flex flex-1 flex-col p-6 sm:p-8">
              <p className="eyebrow">{category?.label}</p>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <WordIllustration entry={currentWord} size="lg" />
                  <div>
                    <p className="native-word font-display text-4xl font-semibold text-ink sm:text-5xl">{currentWord.palabra_nativa}</p>
                    <p className="mt-2 text-base italic text-muted">/{currentWord.guia_fonetica}/</p>
                  </div>
                </div>
                <AudioButton text={currentWord.palabra_nativa} audioUrl={currentWord.audio_url} />
              </div>

              <p className="mt-5 font-display text-2xl font-semibold text-jungle-800">{currentWord.traduccion_espanol}</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Ejemplo de uso</p>
                  <p className="native-word mt-1.5 text-sm font-semibold text-ink">{currentWord.ejemplo_uso}</p>
                  <p className="mt-0.5 text-sm text-muted">{currentWord.ejemplo_traduccion}</p>
                </div>
                <div className="rounded-2xl border border-terracotta-100 bg-terracotta-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-terracotta-700">
                    <Icon name="sparkles" size={13} /> Nota cultural
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{currentWord.nota_cultural}</p>
                </div>
              </div>

              <p className="mt-5 text-[0.7rem] text-muted/80">Fuente: {currentWord.source_detail}</p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={prevLearn} disabled={learnIndex === 0}>
                <Icon name="arrow-left" size={16} /> Anterior
              </Button>
              <Button size="lg" onClick={nextLearn}>
                {learnIndex < words.length - 1 ? 'Siguiente' : questions.length > 0 ? 'Ir a practicar' : 'Terminar'}
                <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Practice */}
        {phase === 'practice' && currentQuestion && (
          <div className="flex flex-1 flex-col py-6 animate-fade-in">
            <Badge tone="sand" className="mb-3 self-start">
              Pregunta {questionIndex + 1} de {questions.length} ·{' '}
              {currentQuestion.direction === 'native-to-es' ? '¿Qué significa?' : '¿Cómo se dice?'}
            </Badge>

            <div className="surface flex-1 p-6 sm:p-8">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {currentQuestion.direction === 'native-to-es' ? 'Palabra en ' + language.name : 'En español'}
                </p>
                <p className={cn('native-word mt-3 font-display font-semibold text-ink', currentQuestion.direction === 'native-to-es' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl')}>
                  {currentQuestion.prompt}
                </p>
                {currentQuestion.direction === 'native-to-es' && (
                  <div className="mt-3 flex justify-center">
                    <AudioButton text={currentQuestion.entry.palabra_nativa} compact />
                  </div>
                )}
              </div>

              <div className="mx-auto mt-8 grid max-w-xl gap-3">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isCorrectOption = option === currentQuestion.correct
                  const isSelected = option === selected
                  let stateClass = 'border-sand-300 bg-cream hover:border-jungle-300 hover:bg-jungle-50'
                  if (answered && isCorrectOption) stateClass = 'border-jungle-500 bg-jungle-50 text-jungle-900'
                  else if (answered && isSelected && !isCorrectOption) stateClass = 'border-coral-500 bg-red-50 text-coral-600 animate-shake'
                  else if (answered) stateClass = 'border-sand-200 bg-sand-50 opacity-60'

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={answered}
                      onClick={() => submitAnswer(option)}
                      className={cn(
                        'native-word w-full rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-all duration-200',
                        stateClass,
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <span className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sand-300 bg-sand-50 text-xs font-bold text-muted sm:inline-flex">
                            {optionIndex + 1}
                          </span>
                          <span>{option}</span>
                        </span>
                        {answered && isCorrectOption && <Icon name="check-circle" size={20} className="text-jungle-600" />}
                        {answered && isSelected && !isCorrectOption && <Icon name="x-circle" size={20} className="text-coral-500" />}
                      </span>
                    </button>
                  )
                })}
              </div>

              {answered && (
                <div className={cn('mx-auto mt-6 max-w-xl rounded-2xl border p-4 animate-fade-up', selected === currentQuestion.correct ? 'border-jungle-200 bg-jungle-50' : 'border-coral-400/30 bg-red-50/70')}>
                  <p className={cn('font-semibold', selected === currentQuestion.correct ? 'text-jungle-800' : 'text-coral-600')}>
                    {selected === currentQuestion.correct ? '¡Muy bien!' : 'Respuesta correcta:'}
                  </p>
                  {selected !== currentQuestion.correct && (
                    <p className="native-word mt-1 font-display text-lg font-semibold text-ink">{currentQuestion.correct}</p>
                  )}
                  <p className="mt-2 text-sm text-muted">
                    <span className="native-word font-semibold text-ink">{currentQuestion.entry.palabra_nativa}</span>
                    {' '}[{currentQuestion.entry.guia_fonetica}] = {currentQuestion.entry.traduccion_espanol}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{currentQuestion.entry.nota_cultural}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <Button size="lg" onClick={nextQuestion} disabled={!answered}>
                {questionIndex < questions.length - 1 ? 'Siguiente' : 'Ver resultado'}
                <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Complete */}
        {phase === 'complete' && (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center animate-pop-in">
            <div className="surface w-full max-w-lg overflow-hidden">
              <TextileBorder tone="gold" />
              <div className="p-8 sm:p-10">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-4xl bg-ochre-100 text-ochre-600 shadow-soft">
                  <Icon name="trophy" size={38} />
                </span>
                <h1 className="mt-5 font-display text-3xl font-semibold text-ink">¡Lección completada!</h1>
                <p className="mt-2 text-sm text-muted">{lesson.title} · {language.name}</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-ochre-50 p-4">
                    <p className="font-display text-2xl font-semibold text-ochre-800">+{awardedXp}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ochre-700">XP</p>
                  </div>
                  <div className="rounded-2xl bg-jungle-50 p-4">
                    <p className="font-display text-2xl font-semibold text-jungle-800">{correctCount}/{questions.length}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-jungle-700">Aciertos</p>
                  </div>
                  <div className="rounded-2xl bg-sand-100 p-4">
                    <p className="font-display text-2xl font-semibold text-ink">{words.length}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Palabras</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {wasNewCompletion
                    ? 'Has ganado XP completo por completar esta lección por primera vez. ¡Sigue tejiendo tu camino!'
                    : 'Has repasado esta lección y ganado un pequeño refuerzo de XP. Repetir también es aprender.'}
                </p>

                {/* Microhistoria cultural al cerrar una unidad */}
                {(() => {
                  const unit = curriculum.units.find((u) => u.id === lesson.unitId)
                  const isLastInUnit = unit && unit.lessonIds[unit.lessonIds.length - 1] === lesson.id
                  const story = isLastInUnit ? getCultureCapsules(languageId)[0] : null
                  if (!story) return null
                  return (
                    <div className="mt-6 rounded-2xl border border-ink/12 bg-sand-50 p-4 text-left">
                      <p className="eyebrow">Microhistoria cultural de la unidad</p>
                      <p className="mt-1 font-display text-base font-semibold text-ink">{story.title}</p>
                      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted">{story.body}</p>
                      <p className="mt-2 text-xs font-semibold text-jungle-700">
                        {story.keyword} — <span className="font-normal text-muted">{story.keywordTranslation}</span>
                      </p>
                    </div>
                  )
                })()}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {nextLessonInPath ? (
                    <Link to={`/lengua/${languageId}/leccion/${nextLessonInPath.id}`} className="w-full sm:w-auto">
                      <Button size="lg" className="w-full">
                        Siguiente lección <Icon name="arrow-right" size={16} />
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/lengua/${languageId}/practica/quiz`} className="w-full sm:w-auto">
                      <Button size="lg" className="w-full">Practicar en quiz</Button>
                    </Link>
                  )}
                  <Link to={`/lengua/${languageId}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full">Volver al camino</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
