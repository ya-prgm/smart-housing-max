/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface': '#f7f9ff',
        'on-surface': '#141c24',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#ecf4ff',
        'surface-container': '#e6effa',
        'surface-container-high': '#e0e9f4',
        'surface-container-highest': '#dae3ef',
        'surface-variant': '#dae3ef',
        'on-surface-variant': '#3e4850',
        'inverse-surface': '#29313a',
        'inverse-on-surface': '#e9f2fd',

        'primary': '#006591',
        'on-primary': '#ffffff',
        'primary-container': '#2aabee',
        'on-primary-container': '#003c58',

        'secondary': '#0056c4',
        'on-secondary': '#ffffff',
        'secondary-container': '#006df5',
        'on-secondary-container': '#fefcff',

        'tertiary': '#1a52d9',
        'tertiary-container': '#809dff',

        'outline': '#6e7881',
        'outline-variant': '#bec8d2',
        'error': '#ba1a1a',

        'brand': {
          blue: '#0D4CD3',
          hover: '#0A3DB0',
          link: '#3358D4',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};