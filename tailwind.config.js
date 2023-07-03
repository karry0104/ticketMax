/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/*.{html,js}", "./views/*.ejs"],
  theme: {
    extend: {
      maxWidth: {
        "3/10": "30%",
      },
    },
  },
  plugins: [require("daisyui")],
};
