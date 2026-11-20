import { Link } from 'react-router-dom'
import { GarzonQuote } from '../components/ProjectNotice'
import { TerritoryFlag } from '../components/CulturalVisuals'
import { Button } from '../components/ui'
import { Icon } from '../components/Icon'
import { CONTRIBUTING_URL, ISSUES_URL, PROJECT_STAGE, REPO_URL } from '../config/project'
import { AVAILABLE_LANGUAGES } from '../data/languages'
import { countWords } from '../lib/vocabulary'

export function AboutPage() {
  const totalWords = AVAILABLE_LANGUAGES.reduce((sum, lang) => sum + countWords(lang.id), 0)

  return (
    <div className="mx-auto max-w-4xl space-y-14 sm:space-y-16">
      {/* Cabecera */}
      <header className="space-y-5">
        <div className="inline-flex items-center gap-2.5">
          <TerritoryFlag territory="colombia" size="sm" />
          <p className="eyebrow">Sobre Bedea · {PROJECT_STAGE}</p>
        </div>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
          Una app hecha desde el respeto, todavía en pañales y abierta a todos.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Bedea nace con una intención sencilla: acercar a más personas al{' '}
          <strong className="font-semibold text-ink">ẽbẽra-chamí</strong> y al{' '}
          <strong className="font-semibold text-ink">wayuunaiki</strong> sin tratarlos como piezas de
          museo ni como productos comerciales. Hoy es apenas un primer borrador público.
        </p>
      </header>

      {/* Frase de Jaime Garzón */}
      <section className="border-y border-ink/12 py-12">
        <GarzonQuote />
      </section>

      {/* Estado honesto: Pre-alfa */}
      <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Dónde estamos hoy</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Faltan muchas palabras (y muchas voces)
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-ink/80 sm:text-base">
          <p>
            Ahora mismo la aplicación tiene <strong className="font-semibold text-ink">{totalWords} palabras y frases</strong>{' '}
            repartidas entre ẽbẽra-chamí y wayuunaiki. Son una fracción mínima de lenguas vivas, ricas y
            complejas que se hablan distinto según el territorio, la comunidad y la generación.
          </p>
          <p>
            Todavía estamos en <strong className="font-semibold text-ink">pre-alfa</strong>: puede haber
            erratas de escritura, traducciones que necesiten matices y pronunciaciones aproximadas con
            voz sintética mientras logramos grabar voces reales de hablantes con su consentimiento y
            crédito visible.
          </p>
          <p>
            Nada aquí pretende reemplazar a los maestros, abuelos ni autoridades indígenas. Al contrario:
            es una puerta abierta para escuchar mejor.
          </p>
        </div>
      </section>

      {/* Cómo contribuir */}
      <section className="space-y-6 border-t border-ink/12 pt-12">
        <div>
          <p className="eyebrow">Desarrollo abierto</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Cómo puedes ayudar a completarla
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            No hace falta saber programar para aportar. Todo el contenido vive en archivos abiertos para
            que hablantes, docentes, estudiantes y desarrolladores puedan mejorarlo juntos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="surface p-6">
            <h3 className="font-display text-xl font-semibold text-ink">1. Proponer o corregir palabras</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              ¿Falta una palabra importante? ¿En tu comunidad se escribe o se dice distinto? Abre un
              reporte en GitHub con la palabra, su significado, territorio y ejemplo de uso.
            </p>
          </article>

          <article className="surface p-6">
            <h3 className="font-display text-xl font-semibold text-ink">2. Sumar voces reales</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              El audio de hablantes nativos es lo más valioso del proyecto. La app ya soporta archivos{' '}
              <code className="rounded bg-sand-100 px-1 text-xs">.opus</code> y{' '}
              <code className="rounded bg-sand-100 px-1 text-xs">.mp3</code> con créditos visibles para
              quien graba.
            </p>
          </article>

          <article className="surface p-6">
            <h3 className="font-display text-xl font-semibold text-ink">3. Compartir notas culturales</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Historias cortas, explicaciones de oficios, tejidos, ríos o saludos que ayuden a entender
              el sentido real detrás de cada palabra.
            </p>
          </article>

          <article className="surface p-6">
            <h3 className="font-display text-xl font-semibold text-ink">4. Mejorar el código y la accesibilidad</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              El código es abierto y funciona 100% gratis en GitHub Pages y sin internet (PWA). Cualquier
              mejora para celulares sencillos es bienvenida.
            </p>
          </article>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a href={ISSUES_URL} target="_blank" rel="noreferrer">
            <Button variant="primary" size="lg">
              Proponer palabra o corrección
              <Icon name="arrow-up-right" size={16} />
            </Button>
          </a>
          <a href={CONTRIBUTING_URL} target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg">
              Guía para contribuir
            </Button>
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
          >
            Ver repositorio en GitHub
          </a>
        </div>
      </section>

      {/* Volver */}
      <div className="border-t border-ink/12 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
          <Icon name="arrow-left" size={15} /> Volver al inicio
        </Link>
      </div>
    </div>
  )
}
