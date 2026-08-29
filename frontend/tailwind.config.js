/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#527D7D',
        'primary-dark': '#3F6565',
        secondary: '#9183A0',

        background: '#F7F4EE',
        surface: '#FFFDFC',

        text: '#34383C',
        'text-muted': '#697075',
        border: '#DDD9D1',

        'risk-low': '#639922',
        'risk-low-bg': '#E5EFDF',

        'risk-moderate': '#854F0B',
        'risk-moderate-bg': '#F5E9D0',

        'risk-high': '#712B13',
        'risk-high-bg': '#F1C8B9',

        'risk-critical': '#72243E',
        'risk-critical-bg': '#E8C1CA',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}