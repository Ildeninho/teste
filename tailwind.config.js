/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas
        "bege-claro": "#EEDDC8",
        "bege-escuro": "#a24c5e",
        "verde-escuro": "#1D2B20",
        "roxo": "#FFFFFF",
        "red": "#ff494b",
        
        // Cores do sistema Tailwind
        "emerald-600": "#059669",
        "emerald-700": "#047857", // Corrigido o valor HEX
        
        // Mapeamento semântico
        primary: "#1D2B20",
        secondary: "#EEDDC8",
        accent: "#a24c5e",
        danger: "#EF4444"
      },
      backgroundImage: {
        "home": "url('/assets/img')"
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in'
      }
    },
  },
  plugins: [],
  // Adicione para garantir que as classes dinâmicas sejam incluídas
  safelist: [
    {
      pattern: /(bg|text|border)-(emerald-600|emerald-700|bege-claro|verde-escuro)/,
    }
  ]
}