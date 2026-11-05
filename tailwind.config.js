/** Lumière: Tailwind is compiled into core/static/css/app.css (run bin/build-css.sh after template changes). */
module.exports = {
  // hover: variants only where a real hover exists (no sticky hover after a tap on phones)
  future: { hoverOnlyWhenSupported: true },
  content: ["./core/templates/**/*.html", "./core/**/*.py", "./core/static/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#f5f2ed", 2: "#ece7df", 3: "#dfd8cd" },
        ink: { DEFAULT: "#1c1b19", 2: "#4a4743", 3: "#6f6a64" },
        night: { DEFAULT: "#1c1b19", 2: "#262421", 3: "#33302c" },
        gold: { DEFAULT: "#c9a96e", deep: "#8a6a35", text: "#7a5c2c" },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { expo: "cubic-bezier(.16,1,.3,1)", quart: "cubic-bezier(.165,.84,.44,1)", wipe: "cubic-bezier(.76,0,.24,1)" },
    },
  },
  plugins: [],
};
