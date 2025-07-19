/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px #06b6d4, 0 0 40px #06b6d4' },
          '50%': { boxShadow: '0 0 50px #06b6d4, 0 0 80px #06b6d4' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 4s linear infinite',
      },
    },
  },
  plugins: [],
};
