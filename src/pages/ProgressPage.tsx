import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress'
import { useBrand } from '../lib/brand'
import { MEDALS } from '../data/medals'
import { AVAILABLE_LANGUAGES } from '../data/languages'
import { getCurriculum } from '../data/curriculum'
import { SectionHeading, StatCard, ProgressBar, Badge, Button } from '../components/ui'
import { Icon } from '../components/Icon'
import { cn, dateKey, formatNumber } from '../lib/utils'

export function ProgressPage() {
  const { progress, level, dailyGoal, earnedMedals, resetProgress } = useProgress()
  const { brand } = useBrand()
  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const dailyPercent = Math.min(100, (todayXp / dailyGoal) * 100)
  const totalCompleted = Object.values(progress.completedLessons).flat().length
  const accuracy = progress.totalAnswers === 0 ? 0 : Math.round((progress.correctAnswers / progress.totalAnswers) * 100)

  return (
    <div className="space-y-8 sm:space-y-10">
      <SectionHeading
        eyebrow="Mi progreso"
        title={`Tu camino en ${brand.name}`}
        description="Racha, experiencia, lecciones completadas y medallas. Todo se guarda en este dispositivo."
      />

      {/* Resumen */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="zap" label="Experiencia total" value={`${formatNumber(progress.xp)} XP`} hint={`Nivel: ${level.title}`} tone="ochre" />
        <StatCard icon="flame" label="Racha" value={`${progress.streak} ${progress.streak === 1 ? 'día' : 'días'}`} hint="Vuelve mañana para mantenerla" tone="terracotta" />
        <StatCard icon="graduation" label="Lecciones" value={totalCompleted} hint="completadas en total" tone="jungle" />
        <StatCard icon="target" label="Precisión" value={`${accuracy}%`} hint={`${progress.correctAnswers} de ${progress.totalAnswers} respuestas`} tone="sand" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Meta diaria y nivel */}
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Meta diaria</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {todayXp} <span className="text-lg text-muted">/ {dailyGoal} XP hoy</span>
                </h3>
              </div>
              <span className={cn('flex h-14 w-14 items-center justify-center rounded-3xl', dailyPercent >= 100 ? 'bg-jungle-100 text-jungle-700' : 'bg-ochre-100 text-ochre-700')}>
                <Icon name={dailyPercent >= 100 ? 'check-circle' : 'target'} size={26} />
              </span>
            </div>
            <ProgressBar value={dailyPercent} tone="ochre" className="mt-4" height="h-3" />
            <p className="mt-2 text-sm text-muted">
              {dailyPercent >= 100
                ? '¡Cumpliste tu meta de hoy! Cada palabra suma.'
                : `Te faltan ${Math.max(0, dailyGoal - todayXp)} XP para tu meta de hoy.`}
            </p>
          </div>

          <div className="surface p-6">
            <p className="eyebrow">Nivel</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink">{level.title}</h3>
                <p className="text-sm text-muted">Nivel {level.index + 1} · {formatNumber(progress.xp)} XP acumulados</p>
              </div>
              {level.nextXp !== null && (
                <Badge tone="sand">Próximo: {level.nextXp} XP</Badge>
              )}
            </div>
            <ProgressBar value={level.progress * 100} tone="jungle" className="mt-4" />
            <p className="mt-2 text-sm text-muted">
              {level.nextXp === null
                ? 'Has alcanzado el nivel más alto. ¡Gracias por cuidar estas voces!'
                : `${level.nextXp - progress.xp} XP para alcanzar el siguiente nivel.`}
            </p>
          </div>

          {/* Progreso por lengua */}
          <div className="surface p-6">
            <p className="eyebrow">Por lengua</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">Avance en cada camino</h3>
            <div className="mt-5 space-y-5">
              {AVAILABLE_LANGUAGES.map((language) => {
                const curriculum = getCurriculum(language.id)
                const total = curriculum?.lessons.length ?? 0
                const done = progress.completedLessons[language.id]?.length ?? 0
                const percent = total === 0 ? 0 : (done / total) * 100
                return (
                  <div key={language.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-semibold text-ink">{language.name}</p>
                        <p className="text-xs text-muted">{done} de {total} lecciones · {progress.seenWords.length > 0 ? '' : ''}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-muted">{Math.round(percent)}%</span>
                    </div>
                    <ProgressBar value={percent} tone={language.accent === 'wayuu' ? 'ochre' : 'jungle'} className="mt-2" />
                    <div className="mt-2">
                      <Link to={`/lengua/${language.id}`} className="text-xs font-semibold text-jungle-700 hover:underline">
                        Continuar →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Medallas */}
        <section className="surface p-6">
          <p className="eyebrow">Medallas</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">Tus logros</h3>
          <p className="mt-1 text-sm text-muted">{earnedMedals.length} de {MEDALS.length} medallas conseguidas</p>

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
                    <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted/80">{medal.requirement}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Zona de cuidado */}
      <section className="surface-muted p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-semibold text-ink">Datos guardados en este dispositivo</h3>
            <p className="mt-1 text-sm text-muted">
              Tu progreso, racha y medallas se guardan en localStorage. Puedes reiniciarlos si quieres empezar de cero.
            </p>
          </div>
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
            <Icon name="trash" size={15} /> Reiniciar progreso
          </Button>
        </div>
      </section>
    </div>
  )
}
