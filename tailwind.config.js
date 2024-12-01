/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // Gestion du mode sombre via la classe 'dark'
  theme: {
    extend: { 
      colors: {
        "dark-purple": "#0881A51",
        "light-white": "rgba(255,255,255,0.18)",
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
        "dark-text": "#E0E0E0",
        "dark-accent": "#3F51B5"
      },
      backgroundColor: {
        "dark-primary": "#121212",
        "dark-secondary": "#1E1E1E"
      },
      textColor: {
        "dark-primary": "#E0E0E0",
        "dark-secondary": "#B0B0B0"
      }
    },
  },
  plugins: [],
}
