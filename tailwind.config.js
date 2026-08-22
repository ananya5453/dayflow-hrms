/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dayflow brand tokens — used consistently instead of raw Tailwind grays
        ink: '#1B2438',       // primary dark (sidebar, headings)
        ink2: '#2C3958',      // secondary dark (hover states)
        flow: '#0EA5A0',      // teal accent — primary actions, links
        flowDark: '#0B8580',
        approve: '#10B981',   // approved / positive
        reject: '#E11D48',    // rejected / destructive
        pending: '#D97706',   // pending / warning
        surface: '#F7F8FB',   // app background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
