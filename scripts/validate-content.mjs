import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const vocabPath = path.join(root, 'src', 'data', 'vocabulary.json')
const publicDir = path.join(root, 'public')

const raw = fs.readFileSync(vocabPath, 'utf8')
const data = JSON.parse(raw)
const entries = Array.isArray(data.entries) ? data.entries : []

const ids = new Set()
let errors = 0
let audioCount = 0

for (const entry of entries) {
  if (!entry.id || typeof entry.id !== 'string') {
    console.error('✗ Entrada sin ID válido:', entry)
    errors += 1
    continue
  }
  if (ids.has(entry.id)) {
    console.error(`✗ ID duplicado: ${entry.id}`)
    errors += 1
  }
  ids.add(entry.id)

  for (const field of ['language', 'category', 'palabra_nativa', 'traduccion_espanol', 'guia_fonetica']) {
    if (!entry[field] || typeof entry[field] !== 'string' || !entry[field].trim()) {
      console.error(`✗ Falta campo obligatorio "${field}" en ${entry.id}`)
      errors += 1
    }
  }

  if (entry.audio_url) {
    audioCount += 1
    const cleanRel = entry.audio_url.replace(/^\.?\//, '')
    const fullAudioPath = path.join(publicDir, cleanRel)
    if (!fs.existsSync(fullAudioPath)) {
      console.error(`✗ Archivo de audio no encontrado para ${entry.id}: ${entry.audio_url}`)
      errors += 1
    }
  }
}

if (errors > 0) {
  console.error(`\nValidación fallida con ${errors} error(es).`)
  process.exit(1)
}

console.log(
  `✓ Contenido válido: ${entries.length} entradas con IDs únicos · ${audioCount} audios nativos vinculados.`,
)
