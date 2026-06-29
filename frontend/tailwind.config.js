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
          dark: '#050807',
          darkSection: '#0B1110',
          light: '#F5F7F5',
          darkText: '#101413',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn Variable', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 40px rgba(0, 177, 64, 0.12)',
        panel: '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'grid-move': 'gridMove 20s linear infinite',
        'accent-line': 'accentLine 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
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
      },
    },
  },
  plugins: [],
};
