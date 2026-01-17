/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#ff6b00',
          secondary: '#0066ff',
          accent: '#ff9800'
        }
      }
    }
  },
  plugins: [],
};
