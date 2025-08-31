/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}", // add styles folder so globals.css is included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
