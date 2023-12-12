/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  plugins: [require("flowbite/plugin")],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // flowbite-svelte

        // cyan
        primary: {"50":"#ecfeff","100":"#cffafe","200":"#a5f3fc","300":"#67e8f9","400":"#22d3ee","500":"#06b6d4","600":"#0891b2","700":"#0e7490","800":"#155e75","900":"#164e63"},

        linkcolorgradientlight: { "50": "#e6f8fb", "100": "#cdf0f6", "200": "#b4e9f2", "300": "#9be2ee", "400": "#82daea", "500": "#6ad3e5", "600": "#51cce1", "700": "#38c5dd", "800": "#1fbdd8", "900": "#06b6d4" },
        linkcolorgradientdark: { "50": "#011215", "100": "#01242a", "200": "#023740", "300": "#024955", "400": "#035b6a", "500": "#046d7f", "600": "#047f94", "700": "#0592aa", "800": "#05a4bf", "900": "#06b6d4" },

        nodecolorgradientlight: { "50": "#faf0ff", "100": "#f5e0ff", "200": "#f0d1ff", "300": "#ebc2ff", "400": "#e6b2ff", "500": "#e0a3ff", "600": "#db94ff", "700": "#d685ff", "800": "#d175ff", "900": "#cc66ff" },
        nodecolorgradientdark: { "50": "#140a1a", "100": "#291433", "200": "#3d1f4c", "300": "#522966", "400": "#663380", "500": "#7a3d99", "600": "#8f47b2", "700": "#a352cc", "800": "#b85ce6", "900": "#cc66ff" },

        background: { "200": "#ffffff", "800": "#262626" },

        secondarybackground: { "200": "#d9d9d9", "800": "#353535" },

        success: { "200": "#22c55e", "800": "#16833e" },
        error: { "200": "#ef4444", "800": "#d31212" },
      },
    },
  },
};

module.exports = config;
