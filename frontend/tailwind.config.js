/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5FEF',
        secondary: '#7B61FF',
        accent: '#00D4FF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        light: {
          50: '#F8FAFC',
          100: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
