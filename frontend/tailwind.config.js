/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{js,css}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00B140',
          greenHover: '#009636',
          greenLight: '#F0FDF4',
          dark: '#FFFFFF',
          darkSection: '#F8FAFC',
          light: '#F8FAFC',
          darkText: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Yekan Bakh', 'Tahoma', 'sans-serif'],
        brand: ['Gilroy', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 20px 40px -15px rgba(0, 177, 64, 0.15)',
        panel: '0 20px 50px -10px rgba(15, 23, 42, 0.08)',
        glow: '0 0 25px rgba(0, 177, 64, 0.2)',
      },
      animation: {
        'grid-move': 'gridMove 20s linear infinite',
        'accent-line': 'accentLine 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(40px, 40px)' },
        },
        accentLine: {
          '0%, 100%': { opacity: '0.4', transform: 'scaleX(0.6)' },
          '50%': { opacity: '1', transform: 'scaleX(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
