import { useState } from 'react'
import { AVAILABLE_LANGUAGES } from '../data/languages'
import { getWords } from '../lib/vocabulary'
import { cn } from '../lib/utils'
import { WordIllustration } from './CulturalVisuals'
import { getLangTheme } from './Woven'

/**
 * Álbum de láminas: cada palabra es una lámina numerada.
 * Se "pega" cuando la ves por primera vez en una lección o práctica.
 */
export function WordAlbum({ seenWords }: { seenWords: string[] }) {
  const [langId, setLangId] = useState(AVAILABLE_LANGUAGES[0]?.id ?? 'embera')
  const language = AVAILABLE_LANGUAGES.find((l) => l.id === langId) ?? AVAILABLE_LANGUAGES[0]
  const theme = getLangTheme(language.accent)
  const words = getWords(language.id)
  const seen = new Set(seenWords)
  const stuck = words.filter((w) => seen.has(w.id)).length

  return (
    <section className="surface overflow-hidden">
      <div aria-hidden="true" className={cn('h-3', theme.stripes)} />
      <div className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-ink">Álbum de palabras</h3>
            <p className="mt-1 text-sm text-muted">
              Cada palabra que ves en una lección se pega en el álbum. Llevas{' '}
              <span className="font-bold text-ink">
                {stuck} de {words.length}
              </span>{' '}
              láminas de {language.name.toLowerCase()}.
            </p>
          </div>
          <div className="inline-flex rounded-full border-2 border-ink/15 p-1 text-sm">
            {AVAILABLE_LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLangId(l.id)}
                className={cn(
                  'rounded-full px-3.5 py-1 font-bold transition-colors',
                  l.id === language.id ? 'bg-ink text-cream' : 'text-muted hover:text-ink',
                )}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-8">
          {words.map((word, i) => {
            const has = seen.has(word.id)
            const number = String(i + 1).padStart(3, '0')
            return (
              <li
                key={word.id}
                className={cn(
                  'relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-md p-1.5 text-center',
                  has
                    ? 'border-2 border-ink bg-cream'
                    : 'border-2 border-dashed border-ink/20 bg-sand-100',
                )}
                aria-label={has ? `${word.palabra_nativa}: ${word.traduccion_espanol}` : `Lámina ${number} sin pegar`}
              >
                {has ? (
                  <>
                    <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-1.5', theme.stripes)} />
                    <span className="absolute left-1.5 top-2.5 text-[0.6rem] font-bold tabular-nums text-muted">
                      {number}
                    </span>
                    <WordIllustration entry={word} size="sm" className="mt-2 h-9 w-9 border-0 bg-transparent p-0" />
                    <span className="native-word mt-1 line-clamp-1 font-display text-sm font-extrabold leading-tight text-ink">
                      {word.palabra_nativa}
                    </span>
                    <span className="line-clamp-1 text-[0.68rem] text-muted">{word.traduccion_espanol}</span>
                  </>
                ) : (
                  <span className="font-display text-lg font-bold tabular-nums text-ink/25">{number}</span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
