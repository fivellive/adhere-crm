/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f1113",
          text: "#f2f2f2",
          accent: "#f7b500",
          muted: "#8d93a1"
        }
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        'soft': '0 10px 24px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [],
}
