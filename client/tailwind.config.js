// tailwind.config.js
module.exports = {
    darkMode: 'class', // This is crucial
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#0A4D9F',
          'primary-hover': '#083A78',
          'primary-dull': '#083A78',
          bg: '#0A0F14',
          surface: '#121A22',
          'surface-light': '#141C26',
          muted: '#8DA0BF',
          text: '#DCE7F5',
          accent: '#0C2A44',
          success: '#16A34A',
          danger: '#EF4444',
          light: '#0A0F14',
          borderColor: 'rgba(255, 255, 255, 0.04)',
          'border-subtle': 'rgba(255, 255, 255, 0.03)',
        },
        fontFamily: {
          sans: ['Inter', 'Roboto', 'sans-serif'],
        },
        letterSpacing: {
          heading: '0.2px',
        },
        boxShadow: {
          'sapphire': '0 8px 24px rgba(0, 0, 0, 0.6)',
          'sapphire-lg': '0 12px 32px rgba(0, 0, 0, 0.7)',
          'sapphire-inner': 'inset 0 2px 8px rgba(2, 8, 16, 0.6)',
        },
      },
    },
    plugins: [],
  };