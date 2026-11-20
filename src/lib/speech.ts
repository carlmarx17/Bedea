/**
 * Pronunciación aproximada con la Web Speech API.
 * No existe una voz ẽbẽra ni wayuunaiki en los navegadores: usamos una voz
 * en español a velocidad lenta y avisamos siempre que es una aproximación.
 */

export type SpeechLanguage = 'embera' | 'wayuunaiki' | string

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let cachedVoices: SpeechSynthesisVoice[] = []

function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
  return cachedVoices
}

// Las voces se cargan de forma asíncrona en algunos navegadores.
if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices()
  }
}

export function speak(text: string, _language: SpeechLanguage = 'embera'): boolean {
  if (!isSpeechSupported() || !text.trim()) return false
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
  synth.speak(utterance)
  return true
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
