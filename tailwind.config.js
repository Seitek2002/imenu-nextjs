/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        baloo: ['"Baloo 2"', 'sans-serif'],
        benzin: ['Benzin', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
