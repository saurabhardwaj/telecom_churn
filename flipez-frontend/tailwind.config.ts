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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        afacad: ['Afacad', 'sans-serif'],
        abyssinica: ['Abyssinica SIL', 'serif'],
        martel: ['Martel', 'serif'],
        andika: ['Andika New Basic', 'serif'],
        Montserrat:['Montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
};
export default config;
