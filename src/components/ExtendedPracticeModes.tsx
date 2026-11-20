import { useEffect, useMemo, useRef, useState } from 'react'
import { getWords } from '../lib/vocabulary'
import { getDueWordIds, getMistakeWordIds } from '../lib/srs'
import { useProgress } from '../lib/progress'
import { AudioButton, Badge, Button, EmptyState, StepProgress } from './ui'
import { WordIllustration } from './CulturalVisuals'
import { SpecialKeyboard } from './SpecialKeyboard'
import { Icon } from './Icon'
import { cn, shuffle } from '../lib/utils'
import type { VocabularyEntry } from '../types'

interface ModeProps {
  languageId: string
  onExit: () => void
  onRestart: () => void
  renderCompletion: (props: {
    title: string
    subtitle: string
    stats: Array<{ label: string; value: string }>
    onExit: () => void
    onRetry: () => void
  }) => JSX.Element
}

function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
}

/* ------------------------------------------------------------------ */
/* 1. Escuchar y elegir la imagen correcta                             */
/* ------------------------------------------------------------------ */

export function ImageMatchMode({
  languageId,
  onExit,
  onRestart,
  renderCompletion,
}: ModeProps) {
  const allWords = useMemo(() => getWords(languageId), [languageId])
  const questions = useMemo(() => {
    const pool = shuffle(allWords).slice(0, 6)
    return pool.map((entry) => {
      const distractors = shuffle(
        allWords.filter((w) => w.id !== entry.id && w.traduccion_espanol !== entry.traduccion_espanol),
      ).slice(0, 3)
      return {
        entry,
        options: shuffle([entry, ...distractors]),
      }
    })
  }, [allWords])

  const { addXp, recordAnswer, markWordsSeen } = useProgress()
  const [index, setIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  if (questions.length < 2) {
    return (
      <EmptyState
        icon="image"
        title="No hay suficientes palabras"
        description="Se necesitan más palabras ilustradas para este ejercicio."
        action={<Button variant="outline" onClick={onExit}>Volver</Button>}
      />
    )
  }

  const current = questions[index]

  const pick = (option: VocabularyEntry) => {
    if (answered) return
    const isCorrect = option.id === current.entry.id
    setSelectedId(option.id)
    setAnswered(true)
    recordAnswer(isCorrect, current.entry.id)
    markWordsSeen([current.entry.id])
    if (isCorrect) setCorrect((v) => v + 1)
  }

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((v) => v + 1)
      setSelectedId(null)
      setAnswered(false)
    } else {
      addXp(Math.max(6, correct * 5))
      setDone(true)
    }
  }

  if (done) {
    return renderCompletion({
      title: correct >= questions.length * 0.7 ? '¡Buen ojo y oído!' : 'Buen repaso visual',
      subtitle: 'Escuchar e imágenes',
      stats: [
        { label: 'Aciertos', value: `${correct}/${questions.length}` },
        { label: 'Cuentas', value: `+${Math.max(6, correct * 5)}` },
      ],
      onExit,
      onRetry: onRestart,
    })
  }

  return (
    <>
      <StepProgress current={index + (answered ? 1 : 0)} total={questions.length} onExit={onExit} label="Imágenes" />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex-1 p-6 sm:p-8">
          <p className="text-center text-xs font-bold text-muted">
            Escucha y elige la imagen correcta
          </p>
          <div className="mt-4 text-center">
            <p className="native-word font-display text-3xl font-semibold text-ink sm:text-4xl">
              {current.entry.palabra_nativa}
            </p>
            <p className="mt-1 text-sm italic text-muted">/{current.entry.guia_fonetica}/</p>
            <div className="mt-4 flex justify-center">
              <AudioButton text={current.entry.palabra_nativa} audioUrl={current.entry.audio_url} />
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3.5">
            {current.options.map((opt) => {
              const isRight = opt.id === current.entry.id
              const isSelected = opt.id === selectedId
              let state = 'border-ink/12 bg-cream hover:border-ink/35 hover:-translate-y-0.5'
              if (answered && isRight) state = 'border-jungle-600 bg-jungle-50 text-jungle-900'
              else if (answered && isSelected && !isRight) state = 'border-coral-500 bg-red-50 animate-shake'
              else if (answered) state = 'border-ink/10 bg-sand-50 opacity-55'

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={answered}
                  onClick={() => pick(opt)}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all duration-200',
                    state,
                  )}
                >
                  <WordIllustration entry={opt} size="md" />
                  <span className="text-sm font-semibold text-ink">{opt.traduccion_espanol}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button size="lg" onClick={next} disabled={!answered}>
            {index < questions.length - 1 ? 'Siguiente' : 'Ver resultado'}
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Escuchar y escribir (Dictado con teclado especial)               */
/* ------------------------------------------------------------------ */

export function DictationMode({
  languageId,
  onExit,
  onRestart,
  renderCompletion,
}: ModeProps) {
  const words = useMemo(
    () =>
      shuffle(getWords(languageId))
        .filter((w) => w.palabra_nativa.length <= 24)
        .slice(0, 6),
    [languageId],
  )
  const { addXp, recordAnswer, markWordsSeen } = useProgress()
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  if (words.length === 0) {
    return (
      <EmptyState
        icon="keyboard"
        title="Sin palabras para dictado"
        description="Aún no hay palabras disponibles para practicar escritura."
        action={<Button variant="outline" onClick={onExit}>Volver</Button>}
      />
    )
  }

  const current = words[index]

  const insertChar = (char: string) => {
    if (checked) return
    setValue((prev) => prev + char)
    inputRef.current?.focus()
  }

  const check = () => {
    if (!value.trim() || checked) return
    const expected = normalizeAnswer(current.palabra_nativa)
    const given = normalizeAnswer(value)
    const isCorrect = expected === given
    setChecked(isCorrect ? 'correct' : 'wrong')
    recordAnswer(isCorrect, current.id)
    markWordsSeen([current.id])
    if (isCorrect) setCorrect((v) => v + 1)
  }

  const next = () => {
    if (index < words.length - 1) {
      setIndex((v) => v + 1)
      setValue('')
      setChecked(null)
    } else {
      addXp(Math.max(8, correct * 6))
      setDone(true)
    }
  }

  if (done) {
    return renderCompletion({
      title: correct >= words.length * 0.7 ? '¡Excelente escritura!' : 'Buen entrenamiento',
      subtitle: 'Dictado con teclado especial',
      stats: [
        { label: 'Correctas', value: `${correct}/${words.length}` },
        { label: 'Cuentas', value: `+${Math.max(8, correct * 6)}` },
      ],
      onExit,
      onRetry: onRestart,
    })
  }

  return (
    <>
      <StepProgress current={index + (checked ? 1 : 0)} total={words.length} onExit={onExit} label="Dictado" />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex-1 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <WordIllustration entry={current} size="md" />
              <div>
                <p className="text-sm font-bold text-muted">
                  Escucha y escribe en la lengua nativa
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {current.traduccion_espanol}
                </p>
                <p className="text-xs italic text-muted">Guía fonética: /{current.guia_fonetica}/</p>
              </div>
            </div>
            <AudioButton text={current.palabra_nativa} audioUrl={current.audio_url} />
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!checked) check()
              else next()
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              disabled={checked !== null}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Escribe aquí la palabra..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="field native-word py-3.5 text-lg font-medium"
            />

            <SpecialKeyboard languageId={languageId} onInsert={insertChar} />
          </form>

          {checked && (
            <div
              className={cn(
                'mt-6 rounded-2xl border p-4 animate-fade-up',
                checked === 'correct'
                  ? 'border-jungle-200 bg-jungle-50'
                  : 'border-coral-400/35 bg-red-50/75',
              )}
            >
              <p className={cn('font-semibold', checked === 'correct' ? 'text-jungle-800' : 'text-coral-600')}>
                {checked === 'correct' ? '¡Exacto!' : 'Escritura esperada:'}
              </p>
              <p className="native-word mt-1 font-display text-xl font-semibold text-ink">
                {current.palabra_nativa}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{current.nota_cultural}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          {!checked ? (
            <Button size="lg" onClick={check} disabled={!value.trim()}>
              Comprobar <Icon name="check" size={16} />
            </Button>
          ) : (
            <Button size="lg" onClick={next}>
              {index < words.length - 1 ? 'Siguiente' : 'Ver resultado'}
              <Icon name="arrow-right" size={16} />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Hablar: grabarse, comparar lado a lado y autoevaluarse           */
/* ------------------------------------------------------------------ */

export function SpeakCompareMode({
  languageId,
  onExit,
  onRestart,
  renderCompletion,
}: ModeProps) {
  const words = useMemo(() => shuffle(getWords(languageId)).slice(0, 6), [languageId])
  const { addXp, recordSrsReview, markWordsSeen } = useProgress()
  const [index, setIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [micError, setMicError] = useState<string | null>(null)
  const [confident, setConfident] = useState(0)
  const [done, setDone] = useState(false)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    }
  }, [recordedUrl])

  if (words.length === 0) {
    return (
      <EmptyState
        icon="mic"
        title="Sin palabras para practicar voz"
        action={<Button variant="outline" onClick={onExit}>Volver</Button>}
      />
    )
  }

  const current = words[index]

  const startRecording = async () => {
    setMicError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMicError('Tu navegador no permite grabar audio desde el micrófono.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (recordedUrl) URL.revokeObjectURL(recordedUrl)
        setRecordedUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      setMicError('No pudimos acceder al micrófono. Revisa el permiso en tu navegador.')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    setRecording(false)
  }

  const rate = (good: boolean) => {
    if (good) setConfident((v) => v + 1)
    recordSrsReview(current.id, good)
    markWordsSeen([current.id])
    if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    setRecordedUrl(null)
    setMicError(null)
    if (index < words.length - 1) {
      setIndex((v) => v + 1)
    } else {
      addXp(12 + confident * 3)
      setDone(true)
    }
  }

  if (done) {
    return renderCompletion({
      title: 'Práctica oral completada',
      subtitle: 'Escuchar, grabar y comparar',
      stats: [
        { label: 'Seguras', value: `${confident}/${words.length}` },
        { label: 'Cuentas', value: `+${12 + confident * 3}` },
      ],
      onExit,
      onRetry: onRestart,
    })
  }

  return (
    <>
      <StepProgress current={index} total={words.length} onExit={onExit} label="Hablar" />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex-1 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <WordIllustration entry={current} size="lg" />
            <p className="mt-4 text-sm font-bold text-muted">
              Escucha, grábate y compara lado a lado
            </p>
            <p className="native-word mt-2 font-display text-4xl font-semibold text-ink">
              {current.palabra_nativa}
            </p>
            <p className="mt-1 text-base italic text-muted">/{current.guia_fonetica}/</p>
            <p className="mt-2 text-base font-semibold text-jungle-700">{current.traduccion_espanol}</p>
          </div>

          <div className="mx-auto mt-7 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-sand-50 p-4 text-center">
              <p className="text-sm font-bold text-muted">
                1. Referencia
              </p>
              <div className="mt-3 flex justify-center">
                <AudioButton text={current.palabra_nativa} audioUrl={current.audio_url} />
              </div>
              <p className="mt-2 text-[0.7rem] text-muted">
                {current.audio_url ? 'Grabación nativa' : 'Guía aproximada'}
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-sand-50 p-4 text-center">
              <p className="text-sm font-bold text-muted">
                2. Tu voz
              </p>
              <div className="mt-3 flex justify-center">
                {!recording ? (
                  <Button variant="secondary" size="sm" onClick={startRecording}>
                    <Icon name="mic" size={14} /> Grabar
                  </Button>
                ) : (
                  <Button variant="danger" size="sm" onClick={stopRecording}>
                    <Icon name="square" size={13} /> Detener
                  </Button>
                )}
              </div>
              {recordedUrl ? (
                <audio controls src={recordedUrl} className="mt-3 h-8 w-full" />
              ) : (
                <p className="mt-2 text-[0.7rem] text-muted">
                  Tu audio queda solo en este dispositivo.
                </p>
              )}
            </div>
          </div>

          {micError && (
            <p className="mt-4 text-center text-xs font-medium text-coral-600">{micError}</p>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => rate(false)}
          >
            Seguir practicando
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => rate(true)}
          >
            <Icon name="check" size={16} /> Me salió bien
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Repaso inteligente (SM-2) y Repaso de errores                    */
/* ------------------------------------------------------------------ */

export function SrsReviewMode({
  languageId,
  variant,
  onExit,
  onRestart,
  renderCompletion,
}: ModeProps & { variant: 'srs' | 'mistakes' }) {
  const { progress, addXp, recordSrsReview, markWordsSeen } = useProgress()
  const allWords = useMemo(() => getWords(languageId), [languageId])

  const queue = useMemo(() => {
    const map = new Map(allWords.map((w) => [w.id, w]))
    const allowed = new Set(allWords.map((w) => w.id))
    const ids =
      variant === 'mistakes'
        ? getMistakeWordIds(progress.cards, allowed)
        : getDueWordIds(progress.cards, allowed)

    const resolved = ids.map((id) => map.get(id)).filter((w): w is VocabularyEntry => Boolean(w))
    if (resolved.length > 0) return resolved.slice(0, 10)
    // Si no hay vencidas en SRS, ofrece 6 palabras de práctica preventiva.
    if (variant === 'srs') return shuffle(allWords).slice(0, 6)
    return []
  }, [allWords, progress.cards, variant])

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [remembered, setRemembered] = useState(0)
  const [done, setDone] = useState(false)

  if (queue.length === 0) {
    return (
      <EmptyState
        icon="check-circle"
        title="Sin errores pendientes"
        description="¡Bien ahí! No tienes palabras falladas por repasar en esta lengua. Cuando falles una en cualquier lección o quiz, aparecerá aquí automáticamente."
        action={<Button onClick={onExit}>Volver a la lengua</Button>}
      />
    )
  }

  const current = queue[index]
  const cardState = progress.cards[current.id]

  const answer = (good: boolean) => {
    if (good) setRemembered((v) => v + 1)
    recordSrsReview(current.id, good)
    markWordsSeen([current.id])
    if (index < queue.length - 1) {
      setIndex((v) => v + 1)
      setRevealed(false)
    } else {
      addXp(10 + remembered * 2)
      setDone(true)
    }
  }

  if (done) {
    return renderCompletion({
      title: variant === 'mistakes' ? 'Errores reforzados' : 'Memoria al día',
      subtitle: variant === 'mistakes' ? 'Repaso de errores' : 'Repetición espaciada (SM-2)',
      stats: [
        { label: 'Recordadas', value: `${remembered}/${queue.length}` },
        { label: 'Cuentas', value: `+${10 + remembered * 2}` },
      ],
      onExit,
      onRetry: onRestart,
    })
  }

  return (
    <>
      <StepProgress
        current={index}
        total={queue.length}
        onExit={onExit}
        label={variant === 'mistakes' ? 'Repaso de errores' : 'Repaso SRS'}
      />
      <div className="flex flex-1 flex-col py-6">
        <div className="surface flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-10">
          <div className="mb-4 flex items-center gap-2">
            <Badge tone={variant === 'mistakes' ? 'terracotta' : 'jungle'}>
              {variant === 'mistakes' ? 'Repaso de error' : 'Repetición espaciada SM-2'}
            </Badge>
            {cardState && (
              <Badge tone="sand">
                Intervalo: {cardState.interval}d
              </Badge>
            )}
          </div>

          <WordIllustration entry={current} size="lg" />
          <p className="native-word mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
            {current.palabra_nativa}
          </p>
          <p className="mt-1.5 text-sm italic text-muted">/{current.guia_fonetica}/</p>
          <div className="mt-4">
            <AudioButton text={current.palabra_nativa} audioUrl={current.audio_url} />
          </div>

          {!revealed ? (
            <div className="mt-8">
              <Button variant="outline" size="lg" onClick={() => setRevealed(true)}>
                Mostrar significado
              </Button>
            </div>
          ) : (
            <div className="mt-7 w-full max-w-md space-y-3 border-t border-ink/10 pt-6 animate-fade-up">
              <p className="font-display text-2xl font-semibold text-jungle-800">
                {current.traduccion_espanol}
              </p>
              <p className="text-sm text-muted">
                <span className="native-word font-medium text-ink">“{current.ejemplo_uso}”</span> — {current.ejemplo_traduccion}
              </p>
              <p className="text-xs leading-relaxed text-muted">{current.nota_cultural}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-coral-400/40 text-coral-600 hover:bg-red-50"
            disabled={!revealed}
            onClick={() => answer(false)}
          >
            Repasar pronto
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!revealed}
            onClick={() => answer(true)}
          >
            <Icon name="check" size={16} /> La recordé bien
          </Button>
        </div>
      </div>
    </>
  )
}
