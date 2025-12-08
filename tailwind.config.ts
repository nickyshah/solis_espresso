import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: { 
    extend: {
      colors: {
        navy: {
          DEFAULT: '#2B3A4D',
          light: '#3B4A5D',
        },
        'solis-gold': {
          DEFAULT: '#F4B942',
          light: '#F6C55C',
          dark: '#E6A429',
        },
        cream: {
          DEFAULT: '#FDF8F0',
          light: '#FFFCF7',
        },
        'warm-white': '#FAF6F0',
      },
    } 
  },
  plugins: [],
};
export default config;
