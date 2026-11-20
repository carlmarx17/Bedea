import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LANGUAGE_MAP } from '../data/languages'
import { getWords, buildTranslationOptions, buildMatchPairs } from '../lib/vocabulary'
import { getSentences } from '../data/sentences'
import { useProgress } from '../lib/progress'
import { Button, Badge, StepProgress, AudioButton, EmptyState } from '../components/ui'
import { TextileBorder } from '../components/TextilePattern'
import { Icon } from '../components/Icon'
import { cn, shuffle } from '../lib/utils'
import type { VocabularyEntry } from '../types'

type Mode = 'flashcards' | 'quiz' | 'match' | 'sentence'

export function PracticePage() {
  const { languageId = '', mode = '' } = useParams()
  const navigate = useNavigate()
  const [sessionKey, setSessionKey] = useState(0)
  const language = LANGUAGE_MAP[languageId]
  const normalizedMode = (['flashcards', 'quiz', 'match', 'sentence'].includes(mode) ? mode : 'flashcards') as Mode
  const restart = () => setSessionKey((k) => k + 1)

  if (!language || language.status !== 'available') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-sand-50 p-6">
        <EmptyState
          icon="gamepad"
          title="Práctica no disponible"
          description="Esta lengua o modo no está disponible."
          action={<Link to="/"><Button>Volver al inicio</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-sand-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        {normalizedMode === 'flashcards' && (
          <FlashcardsMode key={`fc-${sessionKey}`} languageId={languageId} onExit={() => navigate(`/lengua/${languageId}`)} onRestart={restart} />
        )}
        {normalizedMode === 'quiz' && (
          <QuizMode key={`qz-${sessionKey}`} languageId={languageId} onExit={() => navigate(`/lengua/${languageId}`)} onRestart={restart} />
        )}
        {normalizedMode === 'match' && (
          <MatchMode key={`mt-${sessionKey}`} languageId={languageId} onExit={() => navigate(`/lengua/${languageId}`)} onRestart={restart} />
        )}
        {normalizedMode === 'sentence' && (
          <SentenceMode key={`st-${sessionKey}`} languageId={languageId} onExit={() => navigate(`/lengua/${languageId}`)} onRestart={restart} />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */

function FlashcardsMode({ languageId, onExit, onRestart }: { languageId: string; onExit: () => void; onRestart: () => void }) {
  const words = useMemo(() => shuffle(getWords(languageId)).slice(0, 10), [languageId])
  const { addXp, markWordsSeen } = useProgress()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [done, setDone] = useState(false)

  if (words.length === 0) return <NoWords onExit={onExit} />

  const current = words[index]

  const rate = (remembered: boolean) => {
    if (remembered) setKnown((value) => value + 1)
    markWordsSeen([current.id])
    if (index < words.length - 1) {
      setIndex((value) => value + 1)
      setFlipped(false)
    } else {
      const gained = 10 + Math.round(((remembered ? known + 1 : known) / words.length) * 10)
      addXp(gained)
      setDone(true)
    }
  }

  if (done) {
    return (
      <Completion
        title="Repaso completado"
        subtitle="Tarjetas"
        stats={[
          { label: 'Recordadas', value: `${known}/${words.length}` },
          { label: 'XP', value: `+${10 + Math.round((known / words.length) * 10)}` },
        ]}
        onExit={onExit}
        onRetry={onRestart}
      />
    )
  }

  return (
    <>
      <StepProgress current={index} total={words.length} onExit={onExit} label="Tarjetas" />
      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Tarjeta {index + 1} de {words.length} · Toca para voltear
        </p>
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="perspective w-full max-w-md"
          aria-label={flipped ? 'Ver palabra' : 'Ver significado'}
        >
          <div
            className={cn(
              'preserve-3d relative h-80 w-full transition-transform duration-500 sm:h-96',
              flipped && 'rotate-y-180',
            )}
          >
            {/* Frente */}
            <div className="surface backface-hidden absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <Badge tone="sand" className="mb-4">Palabra nativa</Badge>
              <p className="native-word font-display text-4xl font-semibold text-ink sm:text-5xl">{current.palabra_nativa}</p>
              <p className="mt-3 text-base italic text-muted">[{current.guia_fonetica}]</p>
              <span className="mt-6 inline-flex" onClick={(event) => event.stopPropagation()}>
                <AudioButton text={current.palabra_nativa} />
              </span>
              <p className="mt-6 text-xs text-muted">Toca la tarjeta para ver el significado</p>
            </div>
            {/* Reverso */}
            <div className="surface backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center overflow-y-auto p-8 text-center">
              <Badge tone="jungle" className="mb-4">Significado</Badge>
              <p className="font-display text-3xl font-semibold text-jungle-800">{current.traduccion_espanol}</p>
              <p className="native-word mt-3 text-lg font-semibold text-ink">{current.palabra_nativa}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink/70">Ejemplo: </span>
                {current.ejemplo_uso}
              </p>
              <p className="mt-1 text-xs text-muted">{current.ejemplo_traduccion}</p>
              <p className="mt-4 rounded-2xl bg-sand-50 p-3 text-xs leading-relaxed text-muted">
                <span className="font-semibold text-terracotta-700">Nota: </span>
                {current.nota_cultural}
              </p>
            </div>
          </div>
        </button>

        <div className="mt-6 flex w-full max-w-md gap-3">
          <Button variant="outline" size="lg" className="flex-1 border-coral-400/40 text-coral-600 hover:bg-red-50" onClick={() => rate(false)}>
            <Icon name="x" size={18} /> Aún no
          </Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={() => rate(true)}>
            <Icon name="check" size={18} /> La recordé
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

interface QuizQuestion {
  entry: VocabularyEntry
  options: string[]
}

function QuizMode({ languageId, onExit, onRestart }: { languageId: string; onExit: () => void; onRestart: () => void }) {
  const questions = useMemo<QuizQuestion[]>(
    () =>
      shuffle(getWords(languageId))
        .slice(0, 8)
        .map((entry) => ({ entry, options: buildTranslationOptions(entry, 4) })),
    [languageId],
  )
  const { addXp, recordAnswer, markWordsSeen } = useProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  if (questions.length === 0) return <NoWords onExit={onExit} />
  const question = questions[index]

  const submit = (option: string) => {
    if (answered) return
    const isCorrect = option === question.entry.traduccion_espanol
    setSelected(option)
    setAnswered(true)
    recordAnswer(isCorrect)
    markWordsSeen([question.entry.id])
    if (isCorrect) setCorrect((value) => value + 1)
  }

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((value) => value + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      addXp(Math.max(5, 5 * correct))
      setDone(true)
    }
  }

  if (done) {
    const gained = Math.max(5, 5 * correct)
    return (
      <Completion
        title={correct >= questions.length * 0.7 ? '¡Buen trabajo!' : 'Sigue practicando'}
        subtitle="Quiz"
        stats={[
          { label: 'Aciertos', value: `${correct}/${questions.length}` },
          { label: 'XP', value: `+${gained}` },
        ]}
        onExit={onExit}
        onRetry={onRestart}
      />
    )
  }

  return (
    <>
      <StepProgress current={index + (answered ? 1 : 0)} total={questions.length} onExit={onExit} label="Quiz" />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex-1 p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">¿Qué significa esta palabra?</p>
          <div className="mt-4 text-center">
            <p className="native-word font-display text-4xl font-semibold text-ink sm:text-5xl">{question.entry.palabra_nativa}</p>
            <p className="mt-2 text-sm italic text-muted">[{question.entry.guia_fonetica}]</p>
            <div className="mt-3 flex justify-center">
              <AudioButton text={question.entry.palabra_nativa} compact />
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-xl gap-3">
            {question.options.map((option) => {
              const isCorrectOption = option === question.entry.traduccion_espanol
              const isSelected = option === selected
              let state = 'border-sand-300 bg-cream hover:border-jungle-300 hover:bg-jungle-50'
              if (answered && isCorrectOption) state = 'border-jungle-500 bg-jungle-50 text-jungle-900'
              else if (answered && isSelected && !isCorrectOption) state = 'border-coral-500 bg-red-50 text-coral-600 animate-shake'
              else if (answered) state = 'border-sand-200 bg-sand-50 opacity-60'
              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => submit(option)}
                  className={cn('w-full rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-all', state)}
                >
                  <span className="flex items-center justify-between gap-3">
                    {option}
                    {answered && isCorrectOption && <Icon name="check-circle" size={20} className="text-jungle-600" />}
                    {answered && isSelected && !isCorrectOption && <Icon name="x-circle" size={20} className="text-coral-500" />}
                  </span>
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={cn('mx-auto mt-6 max-w-xl rounded-2xl border p-4 animate-fade-up', selected === question.entry.traduccion_espanol ? 'border-jungle-200 bg-jungle-50' : 'border-coral-400/30 bg-red-50/70')}>
              <p className={cn('font-semibold', selected === question.entry.traduccion_espanol ? 'text-jungle-800' : 'text-coral-600')}>
                {selected === question.entry.traduccion_espanol ? '¡Correcto!' : `La respuesta correcta es: ${question.entry.traduccion_espanol}`}
              </p>
              <p className="mt-2 text-sm text-muted">
                <span className="native-word font-semibold text-ink">{question.entry.ejemplo_uso}</span>
                {' — '}{question.entry.ejemplo_traduccion}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{question.entry.nota_cultural}</p>
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-end">
          <Button size="lg" onClick={next} disabled={!answered}>
            {index < questions.length - 1 ? 'Siguiente' : 'Ver resultado'} <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Match                                                               */
/* ------------------------------------------------------------------ */

interface MatchCard {
  key: string
  entryId: string
  kind: 'native' | 'translation'
  text: string
}

function MatchMode({ languageId, onExit, onRestart }: { languageId: string; onExit: () => void; onRestart: () => void }) {
  const entries = useMemo(() => buildMatchPairs(languageId, 6), [languageId])
  const cards = useMemo<MatchCard[]>(() => {
    const native: MatchCard[] = entries.map((entry) => ({ key: `n-${entry.id}`, entryId: entry.id, kind: 'native', text: entry.palabra_nativa }))
    const trans: MatchCard[] = entries.map((entry) => ({ key: `t-${entry.id}`, entryId: entry.id, kind: 'translation', text: entry.traduccion_espanol }))
    return shuffle([...native, ...trans])
  }, [entries])

  const { addXp, markWordsSeen } = useProgress()
  const [selected, setSelected] = useState<MatchCard | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)

  if (entries.length < 3) return <NoWords onExit={onExit} message="Se necesitan al menos 3 palabras para jugar a emparejar." />

  const pick = (card: MatchCard) => {
    if (matched.includes(card.entryId) || wrongPair.length > 0) return
    if (selected?.key === card.key) {
      setSelected(null)
      return
    }
    if (!selected) {
      setSelected(card)
      return
    }
    if (selected.kind === card.kind) {
      setSelected(card)
      return
    }
    setMoves((value) => value + 1)
    if (selected.entryId === card.entryId) {
      const nextMatched = [...matched, card.entryId]
      setMatched(nextMatched)
      markWordsSeen([card.entryId])
      setSelected(null)
      if (nextMatched.length === entries.length) {
        addXp(20)
        setDone(true)
      }
    } else {
      setWrongPair([selected.key, card.key])
      window.setTimeout(() => {
        setWrongPair([])
        setSelected(null)
      }, 650)
    }
  }

  if (done) {
    return (
      <Completion
        title="¡Emparejaste todo!"
        subtitle="Emparejar"
        stats={[
          { label: 'Parejas', value: `${entries.length}` },
          { label: 'Intentos', value: `${moves}` },
          { label: 'XP', value: '+20' },
        ]}
        onExit={onExit}
        onRetry={onRestart}
      />
    )
  }

  return (
    <>
      <StepProgress current={matched.length} total={entries.length} onExit={onExit} label="Parejas" />
      <div className="flex flex-1 flex-col py-6">
        <p className="mb-4 text-center text-sm text-muted">Toca una palabra nativa y su traducción correspondiente.</p>
        <div className="grid flex-1 grid-cols-2 gap-2.5 sm:gap-3">
          {cards.map((card) => {
            const isMatched = matched.includes(card.entryId)
            const isSelected = selected?.key === card.key
            const isWrong = wrongPair.includes(card.key)
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => pick(card)}
                disabled={isMatched}
                className={cn(
                  'native-word flex min-h-[72px] items-center justify-center rounded-2xl border-2 px-3 py-3 text-center text-sm font-semibold transition-all duration-200 sm:text-base',
                  isMatched && 'border-jungle-400 bg-jungle-50 text-jungle-800 opacity-70',
                  isWrong && 'border-coral-500 bg-red-50 text-coral-600 animate-shake',
                  isSelected && !isWrong && 'border-jungle-500 bg-jungle-100 text-jungle-900 shadow-glow',
                  !isMatched && !isSelected && !isWrong && 'border-sand-300 bg-cream hover:border-jungle-300 hover:bg-sand-50',
                  card.kind === 'native' && !isMatched && !isSelected && !isWrong && 'font-display',
                )}
              >
                {card.text}
                {isMatched && <Icon name="check" size={16} className="ml-2 shrink-0 text-jungle-600" />}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-center text-xs font-semibold text-muted">Intentos: {moves} · Parejas: {matched.length}/{entries.length}</p>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Sentence builder                                                    */
/* ------------------------------------------------------------------ */

function SentenceMode({ languageId, onExit, onRestart }: { languageId: string; onExit: () => void; onRestart: () => void }) {
  const sentences = useMemo(() => shuffle(getSentences(languageId)).slice(0, 5), [languageId])
  const { addXp } = useProgress()
  const [index, setIndex] = useState(0)
  const [pool, setPool] = useState<string[]>(() => shuffle(sentences[0]?.tokens ?? []))
  const [picked, setPicked] = useState<string[]>([])
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  if (sentences.length === 0) {
    return (
      <EmptyState
        icon="pen"
        title="Aún no hay oraciones"
        description="Este modo necesita frases preparadas para esta lengua. Prueba con tarjetas, quiz o emparejar."
        action={<Button variant="outline" onClick={onExit}>Volver</Button>}
      />
    )
  }

  const current = sentences[index]

  const resetFor = (nextIndex: number) => {
    setIndex(nextIndex)
    setPool(shuffle(sentences[nextIndex].tokens))
    setPicked([])
    setChecked(null)
  }

  const pickToken = (token: string, tokenIndex: number) => {
    if (checked) return
    setPool((currentPool) => currentPool.filter((_, idx) => idx !== tokenIndex))
    setPicked((currentPicked) => [...currentPicked, token])
  }

  const unpickToken = (token: string, tokenIndex: number) => {
    if (checked) return
    setPicked((currentPicked) => currentPicked.filter((_, idx) => idx !== tokenIndex))
    setPool((currentPool) => [...currentPool, token])
  }

  const check = () => {
    if (picked.length !== current.tokens.length) return
    const isCorrect = picked.join(' ') === current.tokens.join(' ')
    setChecked(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setCorrect((value) => value + 1)
  }

  const next = () => {
    if (index < sentences.length - 1) {
      resetFor(index + 1)
    } else {
      addXp(Math.max(6, correct * 6))
      setDone(true)
    }
  }

  if (done) {
    const gained = Math.max(6, correct * 6)
    return (
      <Completion
        title={correct === sentences.length ? '¡Perfecto!' : 'Buen intento'}
        subtitle="Oraciones"
        stats={[
          { label: 'Correctas', value: `${correct}/${sentences.length}` },
          { label: 'XP', value: `+${gained}` },
        ]}
        onExit={onExit}
        onRetry={onRestart}
      />
    )
  }

  return (
    <>
      <StepProgress current={index + (checked ? 1 : 0)} total={sentences.length} onExit={onExit} label="Oraciones" />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex-1 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Ordena la frase en la lengua nativa</p>
          <p className="mt-3 font-display text-2xl font-semibold text-ink">{current.translation}</p>
          <p className="mt-2 text-sm text-muted">
            <Icon name="lightbulb" size={14} className="mr-1 inline text-ochre-600" />
            {current.hint}
          </p>

          <div className="mt-6 min-h-[84px] rounded-3xl border-2 border-dashed border-sand-300 bg-sand-50 p-3">
            {picked.length === 0 ? (
              <p className="flex h-full min-h-[56px] items-center justify-center text-sm text-muted">Toca las palabras para formar la frase</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {picked.map((token, tokenIndex) => (
                  <button
                    key={`${token}-${tokenIndex}`}
                    type="button"
                    onClick={() => unpickToken(token, tokenIndex)}
                    className="native-word rounded-xl border border-jungle-200 bg-jungle-50 px-4 py-2 text-sm font-semibold text-jungle-800 transition-colors hover:bg-jungle-100"
                  >
                    {token}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {pool.map((token, tokenIndex) => (
              <button
                key={`${token}-${tokenIndex}`}
                type="button"
                onClick={() => pickToken(token, tokenIndex)}
                className="native-word rounded-xl border border-sand-300 bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-jungle-300 hover:bg-jungle-50"
              >
                {token}
              </button>
            ))}
          </div>

          {checked && (
            <div className={cn('mt-6 rounded-2xl border p-4 animate-fade-up', checked === 'correct' ? 'border-jungle-200 bg-jungle-50' : 'border-coral-400/30 bg-red-50/70')}>
              <p className={cn('font-semibold', checked === 'correct' ? 'text-jungle-800' : 'text-coral-600')}>
                {checked === 'correct' ? '¡Bien formado!' : 'La frase correcta es:'}
              </p>
              <p className="native-word mt-1 font-display text-lg font-semibold text-ink">{current.tokens.join(' ')}</p>
              <p className="mt-1 text-sm text-muted">{current.translation}</p>
              <p className="mt-2 text-xs text-muted">Fuente: {current.source}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              setPool(shuffle(current.tokens))
              setPicked([])
              setChecked(null)
            }}
            disabled={checked !== null}
          >
            <Icon name="reset" size={16} /> Reiniciar
          </Button>
          {!checked ? (
            <Button size="lg" onClick={check} disabled={picked.length !== current.tokens.length}>
              Comprobar <Icon name="check" size={16} />
            </Button>
          ) : (
            <Button size="lg" onClick={next}>
              {index < sentences.length - 1 ? 'Siguiente' : 'Ver resultado'} <Icon name="arrow-right" size={16} />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Shared completion and empty states                                  */
/* ------------------------------------------------------------------ */

function Completion({
  title,
  subtitle,
  stats,
  onExit,
  onRetry,
}: {
  title: string
  subtitle: string
  stats: Array<{ label: string; value: string }>
  onExit: () => void
  onRetry: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center animate-pop-in">
      <div className="surface w-full max-w-lg overflow-hidden">
        <TextileBorder tone="gold" />
        <div className="p-8 sm:p-10">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-4xl bg-ochre-100 text-ochre-600 shadow-soft">
            <Icon name="trophy" size={38} />
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{subtitle}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{title}</h1>
          <div className={cn('mt-6 grid gap-3', stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-sand-50 p-4">
                <p className="font-display text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={onExit}>Volver</Button>
            <Button variant="outline" size="lg" onClick={onRetry}><Icon name="refresh" size={16} /> Repetir</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NoWords({ onExit, message }: { onExit: () => void; message?: string }) {
  return (
    <EmptyState
      icon="book"
      title="No hay palabras suficientes"
      description={message ?? 'Necesitas más palabras en esta lengua para practicar este modo.'}
      action={<Button variant="outline" onClick={onExit}>Volver</Button>}
    />
  )
}
