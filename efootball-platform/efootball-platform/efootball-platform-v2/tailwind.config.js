/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pitch: '#0A0E1A',
        'pitch-mid': '#111827',
        'pitch-card': '#1A2235',
        'pitch-border': '#1E2D45',
        volt: '#C8FF00',
        'volt-dim': '#9FCC00',
        ash: '#8A9BBF',
        chalk: '#E8EEF7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
