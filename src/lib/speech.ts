/**
 * Reproducción de audio de vocabulario.
 * 1) Si la entrada tiene `audio_url` (grabación de hablante nativo en .opus o .mp3),
 *    reproduce ese archivo primero.
 * 2) Si no hay grabación aún o falla la carga, usa Web Speech API en español lento
 *    como aproximación y lo indica en la interfaz.
 */

export type SpeechLanguage = 'embera' | 'wayuunaiki' | string

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let cachedVoices: SpeechSynthesisVoice[] = []
let activeAudio: HTMLAudioElement | null = null

function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
  return cachedVoices
}

if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices()
  }
}

export function stopSpeaking(): void {
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.currentTime = 0
    activeAudio = null
  }
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

export function speak(
  text: string,
  _language: SpeechLanguage = 'embera',
  callbacks?: { onStart?: () => void; onEnd?: () => void; audioUrl?: string | null },
): boolean {
  stopSpeaking()

  // Prioridad 1: grabación nativa (.opus / .mp3)
  if (callbacks?.audioUrl && typeof Audio !== 'undefined') {
    const audio = new Audio(callbacks.audioUrl)
    activeAudio = audio
    audio.onplay = () => callbacks.onStart?.()
    audio.onended = () => {
      activeAudio = null
      callbacks.onEnd?.()
    }
    audio.onerror = () => {
      activeAudio = null
      // Fallback silencioso a síntesis si el archivo no existe todavía
      speakSynthetic(text, callbacks)
    }
    audio.play().catch(() => {
      activeAudio = null
      speakSynthetic(text, callbacks)
    })
    return true
  }

  return speakSynthetic(text, callbacks)
}

function speakSynthetic(
  text: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void },
): boolean {
  if (!isSpeechSupported() || !text.trim()) {
    callbacks?.onEnd?.()
    return false
  }
  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const voices = getVoices()
  const spanishVoice =
    voices.find((voice) => /^es[-_]CO/i.test(voice.lang)) ??
    voices.find((voice) => /^es/i.test(voice.lang))

  if (spanishVoice) utterance.voice = spanishVoice
  utterance.lang = spanishVoice?.lang ?? 'es-CO'
  utterance.rate = 0.78
  utterance.pitch = 1
  utterance.volume = 1
  if (callbacks?.onStart) utterance.onstart = callbacks.onStart
  if (callbacks?.onEnd) {
    utterance.onend = callbacks.onEnd
    utterance.onerror = callbacks.onEnd
  }
  synth.speak(utterance)
  return true
}
