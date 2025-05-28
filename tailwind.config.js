/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/*.{js,jsx,vue}", "./src/**/*.{js,jsx,vue}", "./index.html"],
  theme: {
    screens: {
      xs: "320px",
      sm: "479px",
      md: "767px",
      lg: "991px",
      xl: "1200px",
      "2xl": "1480px",
      "3xl": "1950px",
    },
    extend: {
      fontSize: {
        base: "1.25rem", // 20px, for example (default is 1rem = 16px)
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-headings": theme("colors.white"),
            "--tw-prose-body": theme("colors.white"),
            "--tw-prose-bold": theme("colors.white"),
            "--tw-prose-quotes": theme("colors.white"),
            h2: {
              color: theme("colors.gray.300"),
            },
            a: {
              color: theme("colors.yellow.200"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            h1: {
              fontSize: "2.25em",
              fontWeight: "inherit",
              lineHeight: "1.2em",
              color: theme("colors.yellow.200"),
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: "3em",
              fontWeight: "inherit",
              lineHeight: "1.5em",
            },
          },
        },
        slate: {
          css: {
            a: {
              color: theme("colors.accent1"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        },
      }),
      colors: {
        header: "#c9aa82",
        accent1: "#146182",
        "accent1-lighter": "#C1E4F4",
        accent2: "#782d82",
      },
      fontFamily: {
        mono: ['"Courier New"', "monospace"],
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    // require('@tailwindcss/custom-forms'),
    require("@tailwindcss/forms"),
    // ...
  ],
};
