/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Papel de cartilla: cálido y claro, no beige apagado
        sand: {
          50: '#FFF8EC',
          100: '#FBEFD9',
          200: '#F1DEBB',
          300: '#E2C48F',
          400: '#C9A15E',
        },
        // Verde monte: vivo, de selva y potrero, no verde "premium"
        jungle: {
          50: '#E8F7EE',
          100: '#C8EDD6',
          200: '#93DAB0',
          300: '#55C184',
          400: '#22A45F',
          500: '#0E8A4C',
          600: '#0A713D',
          700: '#085A31',
          800: '#064426',
          900: '#05311C',
          950: '#031F12',
        },
        // Rojo achiote / ladrillo encendido
        terracotta: {
          50: '#FFF0EA',
          100: '#FFDCCD',
          200: '#FFB89B',
          300: '#FF8C61',
          400: '#F5623A',
          500: '#E2401C',
          600: '#C13213',
          700: '#9A270F',
          800: '#771F0E',
          900: '#5A180C',
        },
        // Amarillo totumo / sol guajiro
        ochre: {
          50: '#FFF9E0',
          100: '#FFF0B3',
          200: '#FFE27A',
          300: '#FFD23F',
          400: '#F8BC0B',
          500: '#DC9E00',
          600: '#AD7A00',
          700: '#805A00',
          800: '#5E4200',
          900: '#463100',
        },
        coral: {
          400: '#F2668B',
          500: '#D92A63',
          600: '#B01A4D',
        },
        // Wayuunaiki: los colores fuertes de la mochila, el sol y el mar Caribe
        wayuu: {
          pink: '#D92A63',
          orange: '#F26B1D',
          sun: '#F8BC0B',
          sea: '#0B9AA6',
          deep: '#0A5E73',
          dune: '#F1DEBB',
        },
        // Ẽbẽra: contraste de chaquira y el negro de la jagua
        embera: {
          red: '#D7261E',
          yellow: '#F8BC0B',
          blue: '#1E4FB0',
          green: '#0E8A4C',
          white: '#FFFDF7',
          jagua: '#15110E',
        },
        ink: '#1A1512',
        muted: '#62574F',
        cream: '#FFFDF7',
      },
      fontFamily: {
        display: ['Alegreya', 'Georgia', 'serif'],
        sans: ['"Alegreya Sans"', 'system-ui', 'sans-serif'],
        native: ['"Alegreya Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(28, 42, 36, 0.05), 0 18px 45px -24px rgba(28, 42, 36, 0.18)',
        card: '0 1px 2px rgba(28, 42, 36, 0.04), 0 12px 30px -18px rgba(28, 42, 36, 0.22)',
        lift: '0 24px 60px -28px rgba(28, 42, 36, 0.35)',
        glow: '0 0 0 6px rgba(61, 122, 94, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(61, 122, 94, 0.28)' },
          '70%': { boxShadow: '0 0 0 14px rgba(61, 122, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(61, 122, 94, 0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        shake: 'shake 0.35s ease',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
        'slide-up': 'slide-up 0.3s ease both',
      },
    },
  },
  plugins: [],
}
