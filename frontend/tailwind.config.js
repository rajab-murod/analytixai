/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#12163C',
          800: '#171F52',
          700: '#1E2761',
          600: '#2B3572',
        },
        teal: {
          DEFAULT: '#00A896',
          light: '#4FE0CB',
          dark: '#008577',
        },
        paper: '#F7F8FA',
        mist: '#E2E6EC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
