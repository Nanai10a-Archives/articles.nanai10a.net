module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#567097",

        // {light,dark} shades color
        daccent: "#5c6c96",
        laccent: "#89a0a6",

        // {light,dark} accent color
        lshades: "#ebeceb",
        dshades: "#1e2333",

        // color semantics
        primary: "#566f99",
        info: "#1d2b52",
        success: "#4f9c66",
        warning: "#cc8c2e",
        danger: "#f44336",
      },
      fontFamily: { zen: ["'Zen Kaku Gothic New'", "sans-serif"] },
      screens: {
        dark: { raw: "(prefers-color-scheme: dark)" },
      },
    },
  },
  plugins: [],
};
