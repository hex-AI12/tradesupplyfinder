import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f0f4ff', 100: '#dbe4ff', 200: '#b5c9ff', 300: '#8aa8ff', 400: '#5c82ff', 500: '#3b5bdb', 600: '#2b44b0', 700: '#1e3385', 800: '#14255e', 900: '#0c1636' },
        accent: '#f59e0b',
      },
    },
  },
  plugins: [],
};
export default config;
