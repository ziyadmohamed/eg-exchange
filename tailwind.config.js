/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      colors: {
        egx: {
          green: '#10B981',
          red: '#EF4444',
          gold: '#F59E0B',
          dark: '#0F172A',
          card: '#1E293B',
          blue: '#3B82F6'
        }
      }
    },
  },
  plugins: [],
}
