/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        bg: "#050505",
        surface: "#0a0a0a",
        "surface-muted": "#121212",
        border: "#1a1a1a",
        accent: "#10b981", // Emerald
        "accent-muted": "rgba(16, 185, 129, 0.1)",
        text: "#ffffff",
        "text-muted": "#6b7280",
        "text-dim": "#9ca3af",
      },
    },
  },
  plugins: [],
};
