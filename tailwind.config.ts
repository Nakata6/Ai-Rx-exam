import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] },
      colors: {
        rx: {
          bg:     'var(--rx-bg)',
          s1:     'var(--rx-s1)',
          s2:     'var(--rx-s2)',
          border: 'var(--rx-border)',
          green:  'var(--rx-green)',
          red:    'var(--rx-red)',
          gold:   'var(--rx-gold)',
          text:   'var(--rx-text)',
          muted:  'var(--rx-muted)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
