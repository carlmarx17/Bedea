import { cn } from '../lib/utils'
import type { CategoryId, VocabularyEntry } from '../types'

/* ------------------------------------------------------------------ */
/* Banderas y emblemas territoriales (SVG ligeros, 100% offline)       */
/* ------------------------------------------------------------------ */

export function TerritoryFlag({
  territory,
  size = 'md',
  className,
}: {
  territory: 'colombia' | 'embera' | 'wayuunaiki' | 'nasayuwe' | 'kogui' | 'tikuna' | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims =
    size === 'sm' ? 'h-4 w-6 rounded-[3px]' : size === 'lg' ? 'h-7 w-11 rounded-md' : 'h-5 w-8 rounded-[4px]'

  return (
    <svg
      viewBox="0 0 48 32"
      className={cn('shrink-0 border border-ink/20', dims, className)}
      role="img"
      aria-label={territory === 'colombia' ? 'Colombia' : `Colores de la sección ${territory}`}
    >
      {territory === 'colombia' && (
        <>
          <rect width="48" height="16" fill="#F8BC0B" />
          <rect y="16" width="48" height="8" fill="#1E4FB0" />
          <rect y="24" width="48" height="8" fill="#D7261E" />
        </>
      )}

      {/* Franjas de color de cada sección de la app. No son banderas ni emblemas de los pueblos. */}
      {territory === 'embera' && (
        <>
          <rect width="48" height="32" fill="#15110E" />
          <rect y="4" width="48" height="6" fill="#D7261E" />
          <rect y="13" width="48" height="6" fill="#F8BC0B" />
          <rect y="22" width="48" height="6" fill="#1E4FB0" />
        </>
      )}

      {territory === 'wayuunaiki' && (
        <>
          <rect width="48" height="7" fill="#D92A63" />
          <rect y="7" width="48" height="6" fill="#F26B1D" />
          <rect y="13" width="48" height="6" fill="#F8BC0B" />
          <rect y="19" width="48" height="6" fill="#0B9AA6" />
          <rect y="25" width="48" height="7" fill="#0A5E73" />
        </>
      )}

      {territory !== 'colombia' && territory !== 'embera' && territory !== 'wayuunaiki' && (
        <>
          <rect width="48" height="32" fill="#F1DEBB" />
          <rect y="12" width="48" height="8" fill="#62574F" opacity="0.35" />
        </>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Ilustraciones editoriales SVG para palabras y conceptos             */
/* ------------------------------------------------------------------ */

type MotifKey =
  | 'water'
  | 'sun'
  | 'moon'
  | 'mountain'
  | 'tree'
  | 'fire'
  | 'rain'
  | 'path'
  | 'house'
  | 'bird'
  | 'fish'
  | 'dog'
  | 'jaguar'
  | 'snake'
  | 'monkey'
  | 'family'
  | 'person'
  | 'hand'
  | 'eye'
  | 'heart'
  | 'food'
  | 'basket'
  | 'greeting'
  | 'number'
  | 'speech'
  | 'action'
  | 'spark'

function detectMotif(entry: Pick<VocabularyEntry, 'traduccion_espanol' | 'category' | 'tags'>): {
  motif: MotifKey
  numberValue?: string
} {
  const text = `${entry.traduccion_espanol} ${(entry.tags ?? []).join(' ')}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Números explícitos
  const numMap: Array<[RegExp, string]> = [
    [/\b(uno|una|1)\b/, '1'],
    [/\b(dos|2)\b/, '2'],
    [/\b(tres|3)\b/, '3'],
    [/\b(cuatro|4)\b/, '4'],
    [/\b(cinco|5)\b/, '5'],
    [/\b(seis|6)\b/, '6'],
    [/\b(siete|7)\b/, '7'],
    [/\b(ocho|8)\b/, '8'],
    [/\b(nueve|9)\b/, '9'],
    [/\b(diez|10)\b/, '10'],
  ]
  if (entry.category === 'numeros') {
    for (const [re, val] of numMap) {
      if (re.test(text)) return { motif: 'number', numberValue: val }
    }
    return { motif: 'number', numberValue: '·' }
  }

  if (/\b(agua|rio|mar|quebrada|lluvia|beber|nadar)\b/.test(text)) {
    return { motif: /lluvia/.test(text) ? 'rain' : 'water' }
  }
  if (/\b(sol|dia|calor|amanecer|manana)\b/.test(text)) return { motif: 'sun' }
  if (/\b(luna|noche|estrella|tarde)\b/.test(text)) return { motif: 'moon' }
  if (/\b(fuego|candela|ceniza|cocinar|fogata)\b/.test(text)) return { motif: 'fire' }
  if (/\b(montana|tierra|cerro|piedra|territorio|mundo)\b/.test(text)) return { motif: 'mountain' }
  if (/\b(arbol|selva|bosque|hoja|flor|planta|monte)\b/.test(text)) return { motif: 'tree' }
  if (/\b(camino|sendero|ir|caminar|llegar|venir)\b/.test(text)) return { motif: 'path' }
  if (/\b(casa|tambo|hogar|rancheria|puerta|techo)\b/.test(text)) return { motif: 'house' }
  if (/\b(pajaro|ave|aguila|loro|gallina|tucan|pluma|volar)\b/.test(text)) return { motif: 'bird' }
  if (/\b(pez|pescado|bocachico|pescar)\b/.test(text)) return { motif: 'fish' }
  if (/\b(perro|zorro)\b/.test(text)) return { motif: 'dog' }
  if (/\b(jaguar|tigre|gato|puma|tigrillo)\b/.test(text)) return { motif: 'jaguar' }
  if (/\b(serpiente|culebra|vibora)\b/.test(text)) return { motif: 'snake' }
  if (/\b(mono|mico|chivo|cabra|animal)\b/.test(text)) return { motif: 'monkey' }
  if (/\b(mama|madre|papa|padre|abuel|herman|hij|familia|tio|tia|espos|nino|nina|persona|gente|amigo)\b/.test(text)) {
    return { motif: /\b(familia|herman|abuel|gente)\b/.test(text) ? 'family' : 'person' }
  }
  if (/\b(mano|dedo|brazo|saludo|hola|adios|gracias)\b/.test(text)) {
    return { motif: entry.category === 'cuerpo' ? 'hand' : 'greeting' }
  }
  if (/\b(ojo|ver|mirar|cara|cabeza|oreja|boca)\b/.test(text)) return { motif: 'eye' }
  if (/\b(corazon|amor|querer|sentir|sangre|vida)\b/.test(text)) return { motif: 'heart' }
  if (/\b(comida|comer|maiz|platano|yuca|fruta|chicha|carne|sal|hambre|pan)\b/.test(text)) return { motif: 'food' }
  if (/\b(canasta|mochila|tejido|hamaca|chinchorro|olla|vasija|ropa|sombrero)\b/.test(text)) return { motif: 'basket' }
  if (/\b(hablar|palabra|lengua|nombre|preguntar|decir|escuchar|cantar)\b/.test(text)) return { motif: 'speech' }

  const byCategory: Record<CategoryId, MotifKey> = {
    saludos: 'greeting',
    familia: 'family',
    numeros: 'number',
    naturaleza: 'mountain',
    animales: 'bird',
    casa: 'house',
    cuerpo: 'hand',
    verbos: 'action',
    frases: 'speech',
    cualidades: 'spark',
  }
  return { motif: byCategory[entry.category] ?? 'spark' }
}

export function WordIllustration({
  entry,
  size = 'md',
  className,
}: {
  entry: Pick<VocabularyEntry, 'traduccion_espanol' | 'category' | 'tags'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { motif, numberValue } = detectMotif(entry)
  const dims =
    size === 'sm' ? 'h-12 w-12' : size === 'lg' ? 'h-24 w-24' : 'h-16 w-16'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-sand-100/80 p-2',
        dims,
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        {motif === 'water' && (
          <>
            <path d="M32 10 C22 24 16 32 16 40 a16 16 0 0 0 32 0 c0-8-6-16-16-30Z" fill="#0B9AA6" opacity="0.2" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M12 48 Q22 43 32 48 T52 48" fill="none" stroke="#0B9AA6" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M16 55 Q24 51 32 55 T48 55" fill="none" stroke="#1A1512" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          </>
        )}

        {motif === 'rain' && (
          <>
            <path d="M18 33 H47 a9 9 0 0 0 0-18 a12 12 0 0 0-23-2 a8 8 0 0 0-6 20Z" fill="#F1DEBB" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M22 40 L19 50 M32 40 L29 52 M42 40 L39 50" stroke="#0B9AA6" strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}

        {motif === 'sun' && (
          <>
            <circle cx="32" cy="32" r="12" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" />
            <path
              d="M32 8 V14 M32 50 V56 M8 32 H14 M50 32 H56 M15 15 L19 19 M45 45 L49 49 M49 15 L45 19 M19 45 L15 49"
              stroke="#E2401C"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        )}

        {motif === 'moon' && (
          <>
            <path d="M40 14 a18 18 0 1 0 10 32 a14 14 0 1 1-10-32Z" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="46" cy="20" r="2.2" fill="#E2401C" />
            <circle cx="51" cy="28" r="1.6" fill="#1A1512" />
          </>
        )}

        {motif === 'mountain' && (
          <>
            <path d="M8 50 L26 18 L40 42 L48 28 L58 50 Z" fill="#0A713D" opacity="0.22" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M20 29 L26 18 L32 29" fill="none" stroke="#E2401C" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="48" cy="15" r="4.5" fill="#FFD23F" stroke="#1A1512" strokeWidth="1.8" />
          </>
        )}

        {motif === 'tree' && (
          <>
            <rect x="29" y="38" width="6" height="16" rx="2" fill="#E2401C" stroke="#1A1512" strokeWidth="2" />
            <circle cx="32" cy="25" r="14" fill="#0A713D" opacity="0.26" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M32 39 V22 M32 30 L25 25 M32 27 L39 22" stroke="#1A1512" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {motif === 'fire' && (
          <>
            <path d="M32 10 C42 22 48 30 46 41 a14 14 0 0 1-28 0 c0-9 5-16 8-20 c1 5 4 7 6 7 c-1-6 0-12 0-18Z" fill="#E2401C" opacity="0.85" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M32 30 C37 36 38 42 32 48 C26 42 27 36 32 30Z" fill="#FFD23F" />
          </>
        )}

        {motif === 'path' && (
          <>
            <path d="M12 52 C24 44 20 34 34 28 C44 24 42 16 52 12" fill="none" stroke="#1A1512" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M18 52 C30 46 28 38 40 32" fill="none" stroke="#E2401C" strokeWidth="2.2" strokeDasharray="4 4" strokeLinecap="round" />
            <circle cx="52" cy="12" r="4" fill="#FFD23F" stroke="#1A1512" strokeWidth="2" />
          </>
        )}

        {motif === 'house' && (
          <>
            {/* Tambo / casa tradicional con techo inclinado */}
            <path d="M10 31 L32 12 L54 31 Z" fill="#E2401C" opacity="0.82" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <rect x="17" y="31" width="30" height="21" fill="#FFFDF7" stroke="#1A1512" strokeWidth="2.2" />
            <rect x="27" y="39" width="10" height="13" fill="#FFD23F" stroke="#1A1512" strokeWidth="2" />
          </>
        )}

        {motif === 'bird' && (
          <>
            <path d="M14 40 C16 24 30 16 44 20 C48 21 52 19 54 17 C53 24 48 28 43 30 C41 40 31 46 20 44 L12 49 Z" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M24 32 C30 28 36 28 40 31" fill="none" stroke="#E2401C" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="43" cy="24" r="1.8" fill="#1A1512" />
          </>
        )}

        {motif === 'fish' && (
          <>
            <path d="M14 32 C22 20 38 20 46 32 C38 44 22 44 14 32 Z" fill="#0B9AA6" opacity="0.28" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M46 32 L55 24 V40 Z" fill="#E2401C" stroke="#1A1512" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="24" cy="30" r="2" fill="#1A1512" />
            <path d="M31 27 Q34 32 31 37" fill="none" stroke="#1A1512" strokeWidth="1.8" />
          </>
        )}

        {motif === 'dog' && (
          <>
            <circle cx="32" cy="34" r="14" fill="#FFD23F" opacity="0.45" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M19 26 L14 14 L26 20 M45 26 L50 14 L38 20" fill="#E2401C" stroke="#1A1512" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="27" cy="32" r="2" fill="#1A1512" />
            <circle cx="37" cy="32" r="2" fill="#1A1512" />
            <ellipse cx="32" cy="38" rx="3.2" ry="2.2" fill="#1A1512" />
          </>
        )}

        {motif === 'jaguar' && (
          <>
            <circle cx="32" cy="34" r="15" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" />
            <circle cx="20" cy="20" r="5" fill="#FFD23F" stroke="#1A1512" strokeWidth="2" />
            <circle cx="44" cy="20" r="5" fill="#FFD23F" stroke="#1A1512" strokeWidth="2" />
            <circle cx="26" cy="31" r="2" fill="#1A1512" />
            <circle cx="38" cy="31" r="2" fill="#1A1512" />
            <path d="M29 38 L32 41 L35 38" fill="none" stroke="#1A1512" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="38" r="1.5" fill="#E2401C" />
            <circle cx="42" cy="38" r="1.5" fill="#E2401C" />
          </>
        )}

        {motif === 'snake' && (
          <>
            <path d="M16 48 C16 38 46 42 46 31 C46 21 22 25 22 16 C22 12 28 11 35 13" fill="none" stroke="#0A713D" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M16 48 C16 38 46 42 46 31 C46 21 22 25 22 16 C22 12 28 11 35 13" fill="none" stroke="#1A1512" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M36 13 L43 11 M36 13 L42 16" stroke="#E2401C" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {motif === 'monkey' && (
          <>
            <circle cx="17" cy="31" r="5" fill="#E2401C" opacity="0.65" stroke="#1A1512" strokeWidth="2" />
            <circle cx="47" cy="31" r="5" fill="#E2401C" opacity="0.65" stroke="#1A1512" strokeWidth="2" />
            <circle cx="32" cy="32" r="14" fill="#E2401C" opacity="0.75" stroke="#1A1512" strokeWidth="2.2" />
            <ellipse cx="32" cy="36" rx="9" ry="7" fill="#FFFDF7" stroke="#1A1512" strokeWidth="1.8" />
            <circle cx="28" cy="29" r="1.8" fill="#1A1512" />
            <circle cx="36" cy="29" r="1.8" fill="#1A1512" />
          </>
        )}

        {motif === 'family' && (
          <>
            <circle cx="22" cy="23" r="6" fill="#FFD23F" stroke="#1A1512" strokeWidth="2" />
            <circle cx="42" cy="23" r="6" fill="#E2401C" opacity="0.8" stroke="#1A1512" strokeWidth="2" />
            <path d="M12 49 C12 38 32 38 32 49" fill="#0A713D" opacity="0.25" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M32 49 C32 38 52 38 52 49" fill="#E2401C" opacity="0.25" stroke="#1A1512" strokeWidth="2.2" />
          </>
        )}

        {motif === 'person' && (
          <>
            <circle cx="32" cy="22" r="8" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M16 51 C16 37 48 37 48 51" fill="#0A713D" opacity="0.25" stroke="#1A1512" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {motif === 'hand' && (
          <>
            <path d="M22 48 V24 a2.5 2.5 0 0 1 5 0 V31 M27 31 V18 a2.5 2.5 0 0 1 5 0 V31 M32 31 V19 a2.5 2.5 0 0 1 5 0 V32 M37 32 V24 a2.5 2.5 0 0 1 5 0 V42 C42 49 36 53 29 53 C24 53 22 50 22 48Z" fill="#FFD23F" opacity="0.5" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
          </>
        )}

        {motif === 'eye' && (
          <>
            <path d="M10 32 C18 20 46 20 54 32 C46 44 18 44 10 32 Z" fill="#FFFDF7" stroke="#1A1512" strokeWidth="2.2" />
            <circle cx="32" cy="32" r="8" fill="#0A713D" stroke="#1A1512" strokeWidth="2" />
            <circle cx="32" cy="32" r="3.2" fill="#1A1512" />
          </>
        )}

        {motif === 'heart' && (
          <path d="M32 51 C16 40 12 29 15 21 C18 14 27 14 32 21 C37 14 46 14 49 21 C52 29 48 40 32 51 Z" fill="#E2401C" opacity="0.85" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
        )}

        {motif === 'food' && (
          <>
            <path d="M14 34 H50 C49 45 41 51 32 51 C23 51 15 45 14 34 Z" fill="#E2401C" opacity="0.82" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M22 34 C22 25 28 21 32 21 C36 21 42 25 42 34" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M27 15 Q29 12 27 9 M37 15 Q39 12 37 9" fill="none" stroke="#1A1512" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {motif === 'basket' && (
          <>
            <path d="M20 26 C20 14 44 14 44 26" fill="none" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M15 26 H49 L45 50 H19 Z" fill="#FFD23F" opacity="0.7" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M22 36 L32 29 L42 36 L32 43 Z" fill="#E2401C" stroke="#1A1512" strokeWidth="1.6" />
          </>
        )}

        {motif === 'greeting' && (
          <>
            <rect x="11" y="16" width="28" height="20" rx="8" fill="#FFD23F" opacity="0.75" stroke="#1A1512" strokeWidth="2.2" />
            <rect x="25" y="29" width="28" height="20" rx="8" fill="#FFFDF7" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M32 39 H46" stroke="#E2401C" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {motif === 'number' && (
          <>
            <path d="M32 8 L56 32 L32 56 L8 32 Z" fill="#FFD23F" opacity="0.35" stroke="#1A1512" strokeWidth="2" />
            <text
              x="32"
              y="40"
              textAnchor="middle"
              fill="#1A1512"
              fontSize="24"
              fontWeight="700"
              fontFamily="Alegreya, Georgia, serif"
            >
              {numberValue}
            </text>
          </>
        )}

        {motif === 'speech' && (
          <>
            <path d="M14 18 H50 V40 H28 L18 49 V40 H14 Z" fill="#FFFDF7" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M23 26 H41 M23 33 H35" stroke="#E2401C" strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}

        {motif === 'action' && (
          <>
            <circle cx="32" cy="32" r="18" fill="#0A713D" opacity="0.18" stroke="#1A1512" strokeWidth="2.2" />
            <path d="M26 24 L42 32 L26 40 Z" fill="#E2401C" stroke="#1A1512" strokeWidth="2" strokeLinejoin="round" />
          </>
        )}

        {motif === 'spark' && (
          <>
            <path d="M32 10 L37 27 L54 32 L37 37 L32 54 L27 37 L10 32 L27 27 Z" fill="#FFD23F" stroke="#1A1512" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="4" fill="#E2401C" />
          </>
        )}
      </svg>
    </div>
  )
}
