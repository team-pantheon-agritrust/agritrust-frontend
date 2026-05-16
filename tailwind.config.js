/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        'cream-dark': '#F5F1EA',
        sand: '#EDE4D5',
        'sand-dark': '#DDD0BC',
        brand: '#E0185B',
        'brand-dark': '#c8144f',
        'brand-light': '#fdf0f5',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        brand: '0 4px 14px rgba(224, 24, 91, 0.25)',
        xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
      },
      borderColor: {
        subtle: 'rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
