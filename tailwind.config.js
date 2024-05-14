/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: ({ colors }) => ({
        black: "#010106",
        brand: "#2463dd",
        "brand-dark": "#092252",
      }),
    },
  },
  plugins: [],
};
