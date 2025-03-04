/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    extend: {
      colors: {
        main: "#09ACFB",
        point: "#0187EE",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      screens: {
        sm: "640px", //반응형 breakpoint
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
