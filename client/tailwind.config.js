/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FAF9F6',
          warmWhite: '#FFFDF9',
          card: '#FFFFFF',
          navy: '#0F172A',
          navyMuted: '#334155',
          navyLight: '#64748B',
          violet: '#6366F1',
          violetDark: '#4F46E5',
          violetLight: '#EEF2FF',
          coral: '#F43F5E',
          coralHover: '#E11D48',
          coralLight: '#FFF1F2',
          gold: '#D97706',
          goldLight: '#FEF3C7',
          emerald: '#10B981',
          emeraldLight: '#ECFDF5',
          border: '#E2E8F0',
          borderMuted: '#F1F5F9',
        }
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'premium': '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 20px 40px -15px rgba(99, 102, 241, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
