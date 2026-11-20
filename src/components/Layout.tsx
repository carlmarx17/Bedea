import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BrandLockup } from './BrandMark'
import { Icon } from './Icon'
import { BeadMeter } from './Woven'
import { GarzonQuote, PreAlphaBanner } from './ProjectNotice'
import { REPO_URL } from '../config/project'
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
      <PreAlphaBanner />

      {/* Cabecera superior */}
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-sand-50/95 backdrop-blur-md">
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
                    'relative whitespace-nowrap px-3 py-2 text-[0.95rem] font-bold transition-colors',
                    active ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3.5 -bottom-[1.15rem] h-1 rounded-t bg-terracotta-500"
                    />
                  )}
                </Link>
              )
            })}
            <Link
              to="/acerca"
              className={cn(
                'relative ml-2 whitespace-nowrap border-l border-ink/12 px-3.5 py-2 text-[0.95rem] font-bold transition-colors',
                location.pathname.startsWith('/acerca') ? 'text-ink' : 'text-muted hover:text-ink',
              )}
            >
              Sobre Bedea
            </Link>
          </nav>

          {/* Cuentas de hoy, días seguidos y ajustes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/progreso"
              title={`Hoy llevas ${todayXp} de ${dailyGoal} cuentas · ${progress.streak} días seguidos`}
              className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border-2 border-ink/15 bg-cream px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
            >
              <BeadMeter value={todayXp} max={dailyGoal} beads={5} />
              <span className="tabular-nums">
                {progress.streak}
                <span className="font-medium text-muted"> {progress.streak === 1 ? 'día' : 'días'}</span>
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
        className="container-app flex-1 animate-fade-in pb-16 pt-8 sm:pt-12 lg:pb-20 lg:pt-14"
      >
        <Outlet />
      </main>

      {/* Pie de página */}
      <footer className="mt-auto bg-sand-100 pb-24 lg:pb-0">
        <div aria-hidden="true" className="stripes-colombia h-1.5" />
        <div className="container-app py-10">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
            <GarzonQuote variant="compact" />
            <div className="space-y-3 text-xs leading-relaxed text-muted">
              <p>
                <span className="font-bold text-ink">{brand.name}</span> es un proyecto sin ánimo de lucro,
                hecho en Colombia. Nos faltan palabras, grabaciones de hablantes y revisión de las comunidades.
              </p>
              <p>
                Fuente base: Manual de enseñanza y escritura ẽbẽra-chamí (2013). El módulo wayuunaiki está
                pendiente de revisión con hablantes.
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
                <Link to="/acerca" className="text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-ink">
                  Cómo contribuir
                </Link>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-ink"
                >
                  Código en GitHub
                </a>
                <Link to="/ajustes" className="hover:text-ink">Ajustes</Link>
              </p>
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
