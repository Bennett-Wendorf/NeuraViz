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

        background: { "200": "#ffffff", "800": "#262626" },

        secondarybackground: { "200": "#d9d9d9", "800": "#353535" },

        success: { "200": "#22c55e", "800": "#16833e" },
        error: { "200": "#ef4444", "800": "#d31212" },
      },
    },
  },
};

module.exports = config;
