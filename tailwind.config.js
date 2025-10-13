/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd6b3',
          300: '#f9b680',
          400: '#f58d4c',
          500: '#5C4033', // Deep earthy brown (brand color)
          600: '#e04e1a',
          700: '#bb3a18',
          800: '#942f1a',
          900: '#762718',
          950: '#3f110a',
        },
        accent: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#FFD54F', // Mustard gold (brand color)
          500: '#14b8a6', // Teal color
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
    },
  },
  plugins: [],
}