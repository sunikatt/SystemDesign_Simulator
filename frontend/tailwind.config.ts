import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#070B14',
        panel: '#0D1323',
        panel2: '#111A2E',
        line: '#22304A',
        brand: '#7C3AED',
        cyan: '#22D3EE',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
