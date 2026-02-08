/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yesGreen: {
          DEFAULT: "#16a34a",
        },
        noRed: {
          DEFAULT: "#b91c1c",
        },
      },
    },
  },
  plugins: [],
};

export default config;

