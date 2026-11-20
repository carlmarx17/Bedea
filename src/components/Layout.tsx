import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BrandLockup } from './BrandMark'
import { Icon } from './Icon'
import { ProgressBar } from './ui'
import { useBrand } from '../lib/brand'
import { useProgress } from '../lib/progress'
import { cn, dateKey } from '../lib/utils'

interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: string
  match?: (pathname: string) => boolean
}

export function Layout() {
  const { brand } = useBrand()
  const { progress, dailyGoal } = useProgress()
  const location = useLocation()
  const learningHref = `/lengua/${progress.lastLanguage || 'embera'}`
  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const dailyPercent = Math.min(100, (todayXp / dailyGoal) * 100)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const primaryNav: NavItem[] = [
    { to: '/', label: 'Inicio', shortLabel: 'Inicio', icon: 'home' },
    { to: learningHref, label: 'Mi aprendizaje', shortLabel: 'Aprender', icon: 'route' },
    { to: '/diccionario', label: 'Diccionario', shortLabel: 'Diccionario', icon: 'book' },
    { to: '/cultura', label: 'Cultura', shortLabel: 'Cultura', icon: 'sparkles' },
    { to: '/progreso', label: 'Mi progreso', shortLabel: 'Progreso', icon: 'trophy' },
  ]

  const isActive = (item: NavItem) => {
    if (item.to === '/') return location.pathname === '/'
    if (item.to.startsWith('/lengua')) return location.pathname.startsWith('/lengua')
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className="min-h-dvh">
      {/* ---------------------------------------------------------- */}
      {/* Barra lateral de escritorio                                 */}
      {/* ---------------------------------------------------------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col border-r border-sand-200/80 bg-cream/80 px-5 py-7 backdrop-blur-xl lg:flex">
        <Link to="/" aria-label={`${brand.name}, ir al inicio`} className="mb-8 block">
          <BrandLockup />
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Navegación principal">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-colors',
                isActive(item)
                  ? 'bg-jungle-700 text-cream shadow-soft'
                  : 'text-muted hover:bg-sand-100 hover:text-ink',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                  isActive(item) ? 'bg-white/10 text-ochre-200' : 'bg-sand-100 text-jungle-600 group-hover:bg-cream',
                )}
              >
                <Icon name={item.icon} size={17} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="my-5 h-px bg-sand-200/80" />

        <Link
          to="/ajustes"
          className={cn(
            'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors',
            location.pathname.startsWith('/ajustes')
              ? 'bg-sand-100 text-ink'
              : 'text-muted hover:bg-sand-100 hover:text-ink',
          )}
        >
          <Icon name="settings" size={17} />
          Ajustes y marca
        </Link>

        <div className="mt-auto space-y-4 pt-6">
          <div className="rounded-3xl border border-sand-200 bg-sand-50/80 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>Meta de hoy</span>
              <span className="tabular-nums text-ink">
                {todayXp}/{dailyGoal} XP
              </span>
            </div>
            <ProgressBar value={dailyPercent} className="mt-2.5" tone="ochre" height="h-2" />
            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-ink">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="flame" size={15} className="text-terracotta-500" />
                {progress.streak} {progress.streak === 1 ? 'día' : 'días'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="zap" size={15} className="text-ochre-500" />
                {progress.xp} XP
              </span>
            </div>
          </div>

          <p className="px-1 text-[0.68rem] leading-relaxed text-muted/80">
            Voces indígenas de Colombia, aprendidas con respeto. Material en construcción junto a las
            comunidades.
          </p>
        </div>
      </aside>

      {/* ---------------------------------------------------------- */}
      {/* Cabecera móvil                                              */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-sand-200/70 bg-sand-50/85 backdrop-blur-xl lg:hidden">
        <div className="container-app flex h-16 items-center justify-between gap-3">
          <Link to="/" aria-label={`${brand.name}, ir al inicio`}>
            <BrandLockup compact />
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-terracotta-200 bg-terracotta-50 px-2.5 py-1 text-xs font-bold text-terracotta-700">
              <Icon name="flame" size={14} />
              {progress.streak}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-ochre-200 bg-ochre-50 px-2.5 py-1 text-xs font-bold text-ochre-700">
              <Icon name="zap" size={14} />
              {progress.xp}
            </span>
            <Link
              to="/ajustes"
              aria-label="Ajustes y marca"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-200 bg-cream text-muted transition-colors hover:text-ink"
            >
              <Icon name="settings" size={17} />
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Contenido                                                   */}
      {/* ---------------------------------------------------------- */}
      <div className="lg:pl-[17.5rem]">
        <main className="container-app min-h-[calc(100dvh-4rem)] pb-28 pt-6 sm:pt-8 lg:pb-14 lg:pt-10">
          <Outlet />
        </main>

        <footer className="container-app hidden pb-10 lg:block">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200/80 pt-5 text-xs text-muted">
            <p>
              {brand.name} · {brand.subtitle} · Proyecto educativo de lenguas indígenas.
            </p>
            <p>
              Fuente base: <span className="font-medium text-ink">Manual ẽbẽra-chamí (2013)</span>. El
              módulo wayuunaiki está pendiente de revisión comunitaria.
            </p>
          </div>
        </footer>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Navegación móvil inferior                                   */}
      {/* ---------------------------------------------------------- */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200/80 bg-cream/95 backdrop-blur-xl lg:hidden"
        aria-label="Navegación principal"
      >
        <div className="safe-bottom mx-auto grid max-w-lg grid-cols-5 px-2 pt-1.5">
          {primaryNav.map((item) => {
            const active = isActive(item)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[0.62rem] font-semibold transition-colors',
                  active ? 'text-jungle-800' : 'text-muted',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-11 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-jungle-100 text-jungle-800' : 'text-muted',
                  )}
                >
                  <Icon name={item.icon} size={19} />
                </span>
                {item.shortLabel}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
