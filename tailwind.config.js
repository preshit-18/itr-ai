/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9a35',
          500: '#ff7c0a',
          600: '#f06000',
          700: '#c74700',
          800: '#9e3900',
          900: '#7f3000',
        },
        ink: {
          50: '#f5f4f0',
          100: '#e8e6df',
          200: '#d4d0c6',
          300: '#b5b0a0',
          400: '#928c7a',
          500: '#776f5c',
          600: '#60594a',
          700: '#4e483d',
          800: '#423d35',
          900: '#1a1814',
          950: '#0e0d0a',
        },
        jade: {
          400: '#2ecc8a',
          500: '#20b877',
          600: '#169c63',
        },
        crimson: {
          400: '#f05a6a',
          500: '#e63d50',
          600: '#c72d40',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
