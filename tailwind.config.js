/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',  // 珊瑚红 - 主色
        coral: '#FF6B6B',    // 珊瑚红
        orange: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD4C1',
          300: '#FFB89A',
          400: '#FF9B6E',
          500: '#FF7F50',  // 橙色
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',  // 天蓝色
          600: '#0284C7',
        },
        cream: '#FAF8F5',  // 奶油白背景
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
