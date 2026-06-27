import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#15151b',
          800: '#24242e',
          700: '#3a3a47',
          500: '#6a6a78',
          300: '#a8a39a',
        },
        paper: {
          0:   '#fbf6ea',
          50:  '#f5edd9',
          100: '#efe4cc',
          200: '#e6d8b9',
        },
        cobalt: {
          700: '#1b27a3',
          600: '#2536ce',
          500: '#3a4be0',
          200: '#9aa6ef',
          100: '#c9d0f6',
        },
        marigold: {
          600: '#f5b115',
          500: '#ffc833',
          200: '#ffe39a',
        },
        peach: {
          500: '#ef9f63',
          200: '#f7cfa8',
        },
        brand: {
          green: '#2f9457',
          'green-light': '#cfe8d8',
          red: '#e24a31',
          'red-light': '#f8d3ca',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body:    ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hard-sm': '2px 2px 0 0 #15151b',
        'hard':    '4px 4px 0 0 #15151b',
        'hard-lg': '6px 6px 0 0 #15151b',
        'hard-cobalt': '4px 4px 0 0 #2536ce',
        'hard-marigold': '4px 4px 0 0 #f5b115',
        'soft':    '0 4px 14px -2px rgba(21,21,27,0.18)',
        'soft-lg': '0 16px 40px -8px rgba(21,21,27,0.28)',
      },
      borderRadius: {
        xs:  '4px',
        sm:  '8px',
        md:  '14px',
        lg:  '20px',
        xl:  '28px',
        pill:'999px',
      },
      keyframes: {
        slidein: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadein: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pop: {
          '0%':   { transform: 'scale(.7)', opacity: '0' },
          '60%':  { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        slidein: 'slidein 240ms cubic-bezier(0.22,1,0.36,1) both',
        fadein:  'fadein 200ms ease both',
        pop:     'pop 380ms cubic-bezier(0.2,0.9,0.25,1.4) both',
      },
    },
  },
  plugins: [],
}

export default config
