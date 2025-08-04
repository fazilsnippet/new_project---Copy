/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // important for React
  ],
  theme: {
    extend: {},
  },
plugins: [require('@tailwindcss/line-clamp')],
};
