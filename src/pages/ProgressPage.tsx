import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress'
import { useBrand } from '../lib/brand'
import { DAILY_GOAL_OPTIONS } from '../lib/storage'
import { MEDALS } from '../data/medals'
import { AVAILABLE_LANGUAGES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { BeadMeter, LanguageProgress, getLangTheme } from '../components/Woven'
import { WordAlbum } from '../components/WordAlbum'
import { SectionHeading, StatCard, ProgressBar, Badge, Button } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey, downloadJson, formatNumber } from '../lib/utils'

export function ProgressPage() {
  const {
    progress,
    level,
    dailyGoal,
    earnedMedals,
    setDailyGoal,
    importProgressJson,
    resetProgress,
  } = useProgress()
  const { brand } = useBrand()
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const dailyPercent = Math.min(100, (todayXp / dailyGoal) * 100)
  const totalCompleted = Object.values(progress.completedLessons).flat().length
  const accuracy = progress.totalAnswers === 0 ? 0 : Math.round((progress.correctAnswers / progress.totalAnswers) * 100)

  const handleImportFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importProgressJson(String(reader.result ?? ''))
      setImportStatus(ok ? 'ok' : 'error')
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <SectionHeading
        title="Lo que llevas"
        description={`Tu mochila, tu collar y tu álbum de palabras en ${brand.name}. Todo se guarda en este dispositivo, sin cuenta.`}
      />

      {/* Resumen */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="sparkles" label="Cuentas" value={formatNumber(progress.xp)} hint={`Nivel: ${level.title}`} tone="ochre" />
        <StatCard
          icon="calendar"
          label="Días seguidos"
          value={`${progress.streak} ${progress.streak === 1 ? 'día' : 'días'}`}
          hint={`${progress.streakFreezes} ${progress.streakFreezes === 1 ? 'protector' : 'protectores'} activos`}
          tone="terracotta"
        />
        <StatCard icon="graduation" label="Lecciones" value={totalCompleted} hint="completadas en total" tone="jungle" />
        <StatCard icon="target" label="Precisión" value={`${accuracy}%`} hint={`${progress.correctAnswers} de ${progress.totalAnswers} respuestas`} tone="sand" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Meta diaria y nivel */}
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Meta de hoy</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">
                  {todayXp} <span className="text-lg font-medium text-muted">de {dailyGoal} cuentas</span>
                </h3>
              </div>
              <span className={cn('flex h-14 w-14 items-center justify-center rounded-3xl', dailyPercent >= 100 ? 'bg-jungle-100 text-jungle-700' : 'bg-ochre-100 text-ochre-700')}>
                <Icon name={dailyPercent >= 100 ? 'check-circle' : 'target'} size={26} />
              </span>
            </div>
            <BeadMeter value={todayXp} max={dailyGoal} beads={15} height={1.25} className="mt-4" />
            <p className="mt-2 text-sm text-muted">
              {dailyPercent >= 100
                ? '¡Listo por hoy! Mañana seguimos.'
                : `Te faltan ${Math.max(0, dailyGoal - todayXp)} cuentas para la meta de hoy.`}
            </p>
            <div className="mt-4 border-t border-ink/10 pt-4">
              <p className="text-sm font-bold text-muted">
                ¿Cuánto tiempo al día?
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {DAILY_GOAL_OPTIONS.map((opt) => {
                  const active = dailyGoal === opt.xp
                  return (
                    <button
                      key={opt.xp}
                      type="button"
                      onClick={() => setDailyGoal(opt.xp)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-left transition-colors',
                        active
                          ? 'border-ink bg-ink text-cream'
                          : 'border-ink/12 bg-sand-50 text-ink hover:border-ink/30',
                      )}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className={cn('text-[0.68rem]', active ? 'text-ochre-200' : 'text-muted')}>
                        {opt.minutes} ({opt.xp} cuentas)
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="surface p-6">
            <p className="eyebrow">Nivel</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink">{level.title}</h3>
                <p className="text-sm text-muted">Nivel {level.index + 1} · {formatNumber(progress.xp)} cuentas en total</p>
              </div>
              {level.nextXp !== null && (
                <Badge tone="sand">Próximo: {level.nextXp} cuentas</Badge>
              )}
            </div>
            <ProgressBar value={level.progress * 100} tone="jungle" className="mt-4" />
            <p className="mt-2 text-sm text-muted">
              {level.nextXp === null
                ? 'Llegaste al nivel más alto. ¡Gracias por cuidar estas voces!'
                : `Te faltan ${level.nextXp - progress.xp} cuentas para el siguiente nivel.`}
            </p>
          </div>

          {/* Progreso por lengua: mochila y collar */}
          <div className="surface p-6">
            <h3 className="font-display text-2xl font-extrabold text-ink">Tu mochila y tu collar</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {AVAILABLE_LANGUAGES.map((language) => {
                const curriculum = getCurriculum(language.id)
                const total = curriculum?.lessons.length ?? 0
                const done = progress.completedLessons[language.id]?.length ?? 0
                const theme = getLangTheme(language.accent)
                return (
                  <Link
                    key={language.id}
                    to={`/lengua/${language.id}`}
                    className="group flex items-center gap-4 rounded-lg border-2 border-ink/10 p-4 transition-colors hover:border-ink"
                  >
                    <LanguageProgress accent={language.accent} done={done} total={total} className="h-20 w-20" />
                    <div>
                      <p className="font-display text-xl font-extrabold text-ink">{language.name}</p>
                      <p className="text-sm text-muted">
                        {done} de {total} {theme.unit}
                      </p>
                      <p className={cn('mt-1 text-sm font-bold', theme.accentText)}>Seguir →</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Medallas */}
        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl font-extrabold text-ink">Medallas</h3>
            </div>
            <Badge tone="ochre">{earnedMedals.length}/{MEDALS.length}</Badge>
          </div>
          <ProgressBar
            value={MEDALS.length === 0 ? 0 : (earnedMedals.length / MEDALS.length) * 100}
            tone="ochre"
            height="h-2"
            className="mt-3"
          />
          <p className="mt-2 text-xs text-muted">{earnedMedals.length} de {MEDALS.length} medallas conseguidas</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {MEDALS.map((medal) => {
              const earned = earnedMedals.includes(medal.id)
              const tierClass = medal.tier === 'oro' ? 'text-ochre-600 bg-ochre-100' : medal.tier === 'plata' ? 'text-jungle-700 bg-jungle-100' : 'text-terracotta-700 bg-terracotta-100'
              return (
                <div
                  key={medal.id}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-3.5 transition-colors',
                    earned ? 'border-sand-200 bg-cream' : 'border-sand-200/60 bg-sand-50/60 opacity-60',
                  )}
                >
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', earned ? tierClass : 'bg-sand-200 text-muted')}>
                    <Icon name={earned ? medal.icon : 'lock'} size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-ink">{medal.name}</p>
                    <p className="text-xs leading-snug text-muted">{medal.description}</p>
                    <p className="mt-1 text-xs font-bold text-muted/80">{medal.requirement}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <WordAlbum seenWords={progress.seenWords} />

      {/* Respaldo, transferencia y reinicio */}
      <section className="surface-muted p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="font-display text-base font-semibold text-ink">
              Tu progreso en este dispositivo (sin cuenta, 100% offline)
            </h3>
            <p className="mt-1 text-sm text-muted">
              Exporta tu progreso como archivo JSON para pasarlo a otro celular o guardarlo como respaldo.
              Esquema v{progress.schemaVersion}.
            </p>
            {importStatus === 'ok' && (
              <p className="mt-2 text-xs font-semibold text-jungle-700">
                ✓ Progreso importado correctamente.
              </p>
            )}
            {importStatus === 'error' && (
              <p className="mt-2 text-xs font-semibold text-coral-600">
                No pudimos leer ese archivo. Asegúrate de usar un respaldo JSON de Bedea.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadJson(`bedea-progreso-${dateKey()}.json`, progress)}
            >
              <Icon name="download" size={15} /> Exportar respaldo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="upload" size={15} /> Importar
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => handleImportFile(e.target.files?.[0])}
            />
            <Button
              variant="outline"
              size="sm"
              className="border-coral-400/40 text-coral-600 hover:bg-red-50"
              onClick={() => {
                if (window.confirm('¿Seguro que quieres borrar tu progreso? Esta acción no se puede deshacer.')) {
                  resetProgress()
                }
              }}
            >
              <Icon name="trash" size={15} /> Reiniciar
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
