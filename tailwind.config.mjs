/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdfff',
          300: '#8eccff',
          400: '#59afff',
          500: '#3290ff',
          600: '#1b73f5',
          700: '#155de1',
          800: '#184cb6',
          900: '#1a448f',
          950: '#152a57',
        },
        // Gen-Z accent palette
        lime: {
          accent: '#a3e635',
        },
        pink: {
          accent: '#ec4899',
        },
        cyan: {
          accent: '#22d3ee',
        },
        yellow: {
          accent: '#fde047',
        },
        ink: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      screens: {
        xs: '420px',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        glow: '0 0 60px -10px rgba(50, 144, 255, 0.45)',
        'glow-pink': '0 0 60px -10px rgba(236, 72, 153, 0.45)',
        'glow-lime': '0 0 60px -10px rgba(163, 230, 53, 0.5)',
        'glow-violet': '0 0 60px -10px rgba(139, 92, 246, 0.45)',
        sticker: '4px 4px 0 0 rgba(15, 23, 42, 0.9)',
        'sticker-sm': '2px 2px 0 0 rgba(15, 23, 42, 0.9)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        aurora:
          'radial-gradient(ellipse 80% 80% at 20% 20%, rgba(50,144,255,.35) 0px, transparent 50%), radial-gradient(ellipse 80% 80% at 80% 30%, rgba(236,72,153,.30) 0px, transparent 50%), radial-gradient(ellipse 80% 80% at 50% 80%, rgba(163,230,53,.30) 0px, transparent 50%)',
        mesh:
          'radial-gradient(at 27% 37%, rgba(50,144,255,.20) 0px, transparent 50%), radial-gradient(at 97% 21%, rgba(236,72,153,.18) 0px, transparent 50%), radial-gradient(at 52% 99%, rgba(163,230,53,.18) 0px, transparent 50%), radial-gradient(at 10% 29%, rgba(124,58,237,.15) 0px, transparent 50%), radial-gradient(at 97% 96%, rgba(34,211,238,.15) 0px, transparent 50%)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'aurora-shift': 'auroraShift 18s ease infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        auroraShift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -20px) rotate(2deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
};
