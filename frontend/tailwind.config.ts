import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f7',
          100: '#d8ebe9',
          500: '#3F7A80',
          600: '#35696e',
          700: '#2d5960'
        },
        secondary: {
          50: '#f3faf9',
          100: '#e6f3f1',
          500: '#9EC7C2',
          600: '#89b5af'
        },
        borderSoft: '#E5E7EB',
        pageBg: '#F7FAFA'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.05)',
        elevate: '0 14px 32px rgba(15, 23, 42, 0.08)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 280ms ease-out'
      }
    }
  },
  plugins: []
} satisfies Config;
