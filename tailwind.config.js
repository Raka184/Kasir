/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#7f1d1d",
          900: "#111111",
        },
      },
    },
  },
  plugins: [],
};
