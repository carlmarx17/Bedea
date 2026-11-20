import { cn } from '../lib/utils'

const KEYSETS: Record<string, Array<{ char: string; hint: string }>> = {
  embera: [
    { char: 'ã', hint: 'a nasal' },
    { char: 'ẽ', hint: 'e nasal' },
    { char: 'ĩ', hint: 'i nasal' },
    { char: 'õ', hint: 'o nasal' },
    { char: 'ũ', hint: 'u nasal' },
    { char: 'ɨ', hint: 'i central' },
    { char: 'ɗ', hint: 'd implosiva' },
    { char: 'ü', hint: 'u diéresis' },
    { char: "'", hint: 'glotal' },
  ],
  wayuunaiki: [
    { char: 'ü', hint: 'vocal central alta' },
    { char: "'", hint: 'oclusión glotal' },
    { char: 'aa', hint: 'a larga' },
    { char: 'ee', hint: 'e larga' },
    { char: 'ii', hint: 'i larga' },
    { char: 'oo', hint: 'o larga' },
    { char: 'uu', hint: 'u larga' },
    { char: 'üü', hint: 'ü larga' },
  ],
}

/**
 * Teclado táctil de caracteres especiales para escribir en ẽbẽra o wayuunaiki
 * desde cualquier celular o computador.
 */
export function SpecialKeyboard({
  languageId,
  onInsert,
  className,
}: {
  languageId: string
  onInsert: (char: string) => void
  className?: string
}) {
  const keys = KEYSETS[languageId] ?? KEYSETS.embera

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
        Teclado especial · toca para insertar
      </p>
      <div className="flex flex-wrap gap-1.5">
        {keys.map((item) => (
          <button
            key={item.char}
            type="button"
            onClick={() => onInsert(item.char)}
            title={item.hint}
            className="native-word min-h-[42px] min-w-[44px] rounded-xl border border-ink/15 bg-cream px-3 py-2 text-base font-semibold text-ink transition-all hover:border-ink/40 hover:bg-sand-100 active:scale-95"
          >
            {item.char}
          </button>
        ))}
      </div>
    </div>
  )
}
