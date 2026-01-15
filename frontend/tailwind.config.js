/** @type {import('tailwindcss').Config} */
const withOpacity = (cssVarName) => `hsl(var(${cssVarName}) / <alpha-value>)`;

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],

  // Importante: el tema cambia al togglear la clase "dark"
  darkMode: ["class"],

  theme: {
    extend: {
      colors: {
        // Tokens semánticos (NO "bg-white", NO "text-gray-900")
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),

        card: {
          DEFAULT: withOpacity("--card"),
          foreground: withOpacity("--card-foreground"),
        },

        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },

        muted: withOpacity("--muted"),
        border: withOpacity("--border"),
        input: withOpacity("--input"),
      },

      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
