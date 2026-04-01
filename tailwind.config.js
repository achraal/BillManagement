/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Identity (The Ledger)
        "primary": "#000666",
        "primary-container": "#1a237e",
        "secondary": "#4158D0", // Ajouté pour tes dégradés/badges
        
        // Couleurs de Surface (Material Design 3 style)
        "background": "#f8f9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f1f2",
        "surface-container-high": "#e7e8e9",
        
        // Couleurs de texte et contrastes
        "on-surface": "#191c1d",
        "on-surface-variant": "#454652",
        "outline": "#767683",
        
        // États d'erreur
        "error-container": "#ffdad6",
        "on-error-container": "#410002",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"], // Pour les titres h1, h2, h3
        "body": ["Inter", "sans-serif"],     // Pour les textes, tableaux et inputs
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}