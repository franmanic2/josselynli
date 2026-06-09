/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lila: {
          light: '#C8B4E3',
          medium: '#9B7EC8',
          dark: '#7B5EA7',
          hover: '#674E8E',
          tint: '#F4EFFA',
          tint2: '#E7DCF4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
