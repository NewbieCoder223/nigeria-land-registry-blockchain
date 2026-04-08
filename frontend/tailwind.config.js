/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nigeria-green': {
          DEFAULT: '#059669',
          'surface': '#68dba9',
          'dark': '#064e3b',
        },
        'gold-accent': '#d4af37',
        'reg': {
          'dark': '#0c141f',
          'black': '#020617',
          'surface': '#0c141f',
          'container': {
            'low': '#141c27',
            'lowest': '#070f19',
            'high': '#232a36',
            'highest': '#2d3541',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'luxury': '24px',
        'heavy': '40px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        'emerald-aura': '0 0 60px rgba(5, 150, 105, 0.04)',
      }
    },
  },
  plugins: [],
}
