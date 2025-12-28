/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4285f4',
        secondary: '#34a853',
        danger: '#ea4335',
        warning: '#fbbc04',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
