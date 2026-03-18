import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0ea472",
        "brand-dark": "#0b7d57",
        "brand-light": "#d1fae5",
        accent: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["Google Sans Display", "Google Sans", "sans-serif"],
        body: ["Google Sans", "sans-serif"],
        mono: ["Google Sans Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
