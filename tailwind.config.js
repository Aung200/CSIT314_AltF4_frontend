/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        popover: {
          DEFAULT: "#ffffff",
          foreground: "rgb(var(--color-ink) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-sage-pale) / 0.25)",
          foreground: "rgb(var(--color-ink) / <alpha-value>)",
        },
        muted: "rgb(var(--color-sage-light) / <alpha-value>)",
        sage: {
          50: "rgb(var(--color-sage-pale) / 0.25)",
          100: "rgb(var(--color-sage-pale) / <alpha-value>)",
          200: "rgb(var(--color-sage-light) / <alpha-value>)",
          400: "rgb(var(--color-sage) / <alpha-value>)",
          700: "rgb(var(--color-sage-dark) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink) / <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
