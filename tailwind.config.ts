import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6746A3",
          blue: {
            300: "#38C3FF",
            500: "#0075A8",
            700: "#1a7dff",
          },
          green: "#278428",
          yellow: "#FFCC00",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
