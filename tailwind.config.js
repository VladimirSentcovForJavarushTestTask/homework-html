const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [".flowbite-react/class-list.json"],
  theme: {
    extend: {},
  },
  plugins: [flowbiteReact],
}