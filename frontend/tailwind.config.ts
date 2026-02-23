import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        super: '1.25rem',
        luxury: '2rem'
      },
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
        cobalt: '#2563EB',
        onyx: '#050505',
        borderSoft: '#E5E7EB',
        pageBg: '#F7FAFA'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.05)',
        elevate: '0 14px 32px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 1px rgba(159, 199, 194, 0.35), 0 16px 40px rgba(63, 122, 128, 0.22)',
        depth1: '0 10px 30px rgba(0,0,0,0.2)',
        depth2: '0 20px 60px rgba(0,0,0,0.25)',
        depth3: '0 40px 100px rgba(0,0,0,0.3)'
      },
      backgroundImage: {
        'mesh-calm':
          'radial-gradient(1200px 600px at -10% -10%, rgba(63,122,128,0.12), transparent 52%), radial-gradient(900px 520px at 105% -15%, rgba(158,199,194,0.24), transparent 50%), radial-gradient(900px 620px at 45% 120%, rgba(63,122,128,0.1), transparent 58%)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' }
        },
        meshShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        floating: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 280ms ease-out',
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
        meshShift: 'meshShift 20s ease-in-out infinite',
        floating: 'floating 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
