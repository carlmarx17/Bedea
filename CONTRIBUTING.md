# Cómo contribuir a Bedea

> *«Nadie podrá llevar por encima de su corazón a nadie, ni hacerle mal en su persona, aunque piense y diga diferente.»* — Jaime Garzón

**Bedea** es un proyecto educativo abierto, sin ánimo de lucro y en estado **pre-alfa**. Faltan muchísimas palabras, revisiones dialectales y grabaciones reales de hablantes. Toda ayuda hecha desde el respeto es bienvenida.

## Principios básicos

1. **Respeto y consentimiento comunitario:** las lenguas pertenecen a sus pueblos. Si aportas grabaciones o textos, incluye siempre el crédito del hablante o fuente y asegúrate de contar con su permiso explícito.
2. **Variante dialectal explícita:** aclara siempre de qué territorio o variante proviene una palabra (por ejemplo, *ẽbẽra-chamí de Jardín*, *wayuunaiki de la Alta Guajira*).
3. **Sin errores escondidos:** si una entrada necesita revisión, indícalo con honestidad.

## Formas de aportar (sin programar)

- **Proponer palabras o corregir grafías:** abre un *Issue* en GitHub indicando:
  - Lengua y variante dialectal
  - Palabra en lengua nativa
  - Traducción al español
  - Guía fonética aproximada
  - Ejemplo de uso y nota cultural (opcional pero muy valiosa)
- **Aportar grabaciones de voz:** archivos `.opus` o `.mp3` (48 kbps es suficiente para que pese poco en celulares).

## Formas de aportar (con código)

1. Haz un fork del repositorio y crea una rama desde `main`.
2. El vocabulario vive en `src/data/vocabulary.json` y los audios nativos van en `public/audio/{lang}/{wordId}.opus`.
3. Ejecuta las validaciones antes de abrir tu Pull Request:

```bash
npm install
npm run validate:content
npm run lint
npm run build
```
