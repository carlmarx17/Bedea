import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BrandLockup } from './BrandMark'
import { Icon } from './Icon'
import { TextileBorder } from './TextilePattern'
import { useBrand } from '../lib/brand'
import { useProgress } from '../lib/progress'
import { cn, dateKey } from '../lib/utils'

interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: string
}

export function Layout() {
  const { brand } = useBrand()
  const { progress, dailyGoal } = useProgress()
  const location = useLocation()
  const learningHref = `/lengua/${progress.lastLanguage || 'embera'}`
  const todayXp = progress.dailyDate === dateKey() ? progress.dailyXp : 0
  const goalMet = todayXp >= dailyGoal

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const primaryNav: NavItem[] = [
    { to: '/', label: 'Inicio', shortLabel: 'Inicio', icon: 'home' },
    { to: learningHref, label: 'Aprender', shortLabel: 'Aprender', icon: 'route' },
    { to: '/diccionario', label: 'Diccionario', shortLabel: 'Diccionario', icon: 'book' },
    { to: '/cultura', label: 'Cultura', shortLabel: 'Cultura', icon: 'sparkles' },
    { to: '/progreso', label: 'Progreso', shortLabel: 'Progreso', icon: 'trophy' },
  ]

  const isActive = (item: NavItem) => {
    if (item.to === '/') return location.pathname === '/'
    if (item.to.startsWith('/lengua')) return location.pathname.startsWith('/lengua')
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Cabecera editorial superior */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-sand-50/90 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Link to="/" aria-label={`${brand.name}, ir al inicio`} className="shrink-0">
            <BrandLockup compact className="sm:hidden" />
            <BrandLockup className="hidden sm:flex" />
          </Link>

          {/* Navegación de escritorio: tipográfica y limpia, sin cajas de iconos */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {primaryNav.map((item) => {
              const active = isActive(item)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium transition-colors',
                    active ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3.5 -bottom-[1.15rem] h-[2px] bg-terracotta-500"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Estado discreto: racha, XP y ajustes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/progreso"
              title={`Meta diaria: ${todayXp}/${dailyGoal} XP`}
              className="inline-flex items-center gap-2.5 rounded-full border border-ink/12 bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink/30"
            >
              <span className="inline-flex items-center gap-1 tabular-nums text-terracotta-600">
                <Icon name="flame" size={14} />
                {progress.streak}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-ink/15" />
              <span className="inline-flex items-center gap-1 tabular-nums text-ink">
                <Icon name="zap" size={13} className={goalMet ? 'text-jungle-600' : 'text-ochre-500'} />
                {progress.xp}
                <span className="hidden text-muted sm:inline">XP</span>
              </span>
            </Link>

            <Link
              to="/ajustes"
              aria-label="Ajustes y marca"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                location.pathname.startsWith('/ajustes')
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/12 bg-cream text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              <Icon name="settings" size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main
        key={location.pathname}
        className="container-app flex-1 animate-fade-in pb-28 pt-8 sm:pt-12 lg:pb-20 lg:pt-14"
      >
        <Outlet />
      </main>

      {/* Colofón editorial */}
      <footer className="mt-auto hidden border-t border-ink/12 bg-sand-100/50 lg:block">
        <TextileBorder tone="terracotta" className="opacity-35" />
        <div className="container-app py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                {brand.name} <span className="font-normal italic text-muted">— {brand.subtitle}</span>
              </p>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
                Archivo vivo y espacio de aprendizaje dedicado a las lenguas indígenas de Colombia.
                Construido con respeto a las comunidades hablantes y sus territorios.
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Fuente base:{' '}
              <span className="font-medium text-ink">Manual de enseñanza y escritura ẽbẽra-chamí (2013)</span>.
              El módulo wayuunaiki se encuentra abierto a revisión comunitaria.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-muted">
              <Link to="/diccionario" className="hover:text-ink">Diccionario</Link>
              <Link to="/cultura" className="hover:text-ink">Cultura</Link>
              <Link to="/ajustes" className="hover:text-ink">Identidad</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Navegación móvil inferior */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/12 bg-cream/95 backdrop-blur-lg lg:hidden"
        aria-label="Navegación principal"
      >
        <div className="safe-bottom mx-auto grid max-w-lg grid-cols-5">
          {primaryNav.map((item) => {
            const active = isActive(item)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'relative flex flex-col items-center gap-1 py-2.5 text-[0.64rem] font-semibold transition-colors',
                  active ? 'text-ink' : 'text-muted',
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 top-0 h-[2px] bg-terracotta-500"
                  />
                )}
                <Icon name={item.icon} size={19} strokeWidth={active ? 2.2 : 1.7} />
                {item.shortLabel}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
