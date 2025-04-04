/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita o modo escuro baseado na classe "dark"
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Inclui os arquivos dentro da pasta "app"
    './components/**/*.{js,ts,jsx,tsx}', // Inclui os arquivos dentro da pasta "components"
    './context/**/*.{js,ts,jsx,tsx}', // Inclui os arquivos dentro da pasta "context"
  ],
  theme: {
    extend: {
      // Adicione customizações aqui, se necessário
    },
  },
  plugins: [],
};