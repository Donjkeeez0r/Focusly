/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'rgb(var(--color-border) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        page: 'rgb(var(--color-page) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)'
      },
      boxShadow: {
        soft: '0 16px 40px rgb(15 23 42 / 0.08)'
      }
    }
  },
  plugins: []
};
