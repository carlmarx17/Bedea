import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { Icon } from '../components/Icon'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-4xl bg-sand-100 text-muted">
        <Icon name="compass" size={36} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Camino no encontrado</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        La página que buscas no existe o se movió. Puedes volver al inicio o explorar las lenguas disponibles.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/"><Button variant="primary">Ir al inicio</Button></Link>
        <Link to="/diccionario"><Button variant="outline">Abrir diccionario</Button></Link>
      </div>
    </div>
  )
}
