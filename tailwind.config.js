/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7e0',
          100: '#fdecc8',
          200: '#fbd38d',
          300: '#f9a825',
          400: '#f57f17',
          500: '#e65100',
          600: '#d84315',
          700: '#bf360c',
          800: '#8d2f0a',
          900: '#5d1f07',
        }
      }
    },
  },
  plugins: [],
}