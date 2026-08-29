/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2DD4BF',
        'primary-dark': '#14B8A6',
        secondary: '#38BDF8',

        background: '#0B1120',
        surface: '#0F172A',

        text: '#F8FAFC',
        'text-muted': '#94A3B8',
        border: '#1E293B',

        'risk-low': '#34D399',
        'risk-low-bg': '#064E3B',

        'risk-moderate': '#F59E0B',
        'risk-moderate-bg': '#78350F',

        'risk-high': '#F97316',
        'risk-high-bg': '#7C2D12',

        'risk-critical': '#F43F5E',
        'risk-critical-bg': '#881337',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },

  plugins: [],
}