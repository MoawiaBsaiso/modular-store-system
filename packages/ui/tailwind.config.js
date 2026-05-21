const tokens = require('./src/tokens/design-tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: tokens.colors.brand,
        neutralTokens: tokens.colors.neutral
      },
      spacing: tokens.spacing,
      borderRadius: tokens.radius
    },
  },
  plugins: [],
};