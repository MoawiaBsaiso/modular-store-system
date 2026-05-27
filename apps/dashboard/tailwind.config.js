/** @type {import('tailwindcss').Config} */
import designTokens from '../../packages/ui/src/tokens/design-tokens.json' with { type: 'json' };

const tokens = designTokens.global || designTokens;

export default {
  // 🔥 تأكد أن هذا السطر في الأعلى تماماً وخارج كائن الـ theme
  darkMode: 'class', 
  
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
        neutralTokens: {
          text: {
            main: tokens.colors?.neutral?.text?.main?.value || '#111827',
          }
        }
      },
      spacing: {
        sm: tokens.spacing?.sm?.value || '8px',
        md: tokens.spacing?.md?.value || '16px',
        lg: tokens.spacing?.lg?.value || '24px',
      },
      borderRadius: {
        button: tokens.borderRadius?.button?.value || '8px',
      }
    },
  },
  plugins: [],
}