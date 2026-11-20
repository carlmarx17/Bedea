import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BrandProvider } from './lib/brand'
import { ProgressProvider } from './lib/progress'
import { HomePage } from './pages/HomePage'
import { LanguagePage } from './pages/LanguagePage'
import { LessonPage } from './pages/LessonPage'
import { PracticePage } from './pages/PracticePage'
import { DictionaryPage } from './pages/DictionaryPage'
import { CulturePage } from './pages/CulturePage'
import { ProgressPage } from './pages/ProgressPage'
import { SettingsPage } from './pages/SettingsPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrandProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            {/* La lección y los juegos ocupan toda la pantalla, sin barra lateral. */}
            <Route path="/lengua/:languageId/leccion/:lessonId" element={<LessonPage />} />
            <Route path="/lengua/:languageId/practica/:mode" element={<PracticePage />} />

            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/lengua/:languageId" element={<LanguagePage />} />
              <Route path="/diccionario" element={<DictionaryPage />} />
              <Route path="/cultura" element={<CulturePage />} />
              <Route path="/progreso" element={<ProgressPage />} />
              <Route path="/ajustes" element={<SettingsPage />} />
              <Route path="/acerca" element={<AboutPage />} />
              <Route path="/inicio" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </BrandProvider>
  )
}
