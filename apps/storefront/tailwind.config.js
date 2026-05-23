/** @type {import('tailwindcss').Config} */
import designTokens from '../../packages/ui/src/tokens/design-tokens.json' with { type: 'json' };

const tokens = designTokens.global || designTokens;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: tokens.colors?.brand?.primary?.value || '#000000',
          'primary-hover': tokens.colors?.brand?.['primary-hover']?.value || '#333333',
          accent: tokens.colors?.brand?.accent?.value || '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}