import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F3',
          dark: '#EDEAE3',
        },
        charcoal: {
          light: '#242424',
          DEFAULT: '#1A1A1A',
          dark: '#0F0F0F',
        },
        midgray: '#6B6B6B',
        lightgray: '#A0A0A0',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config