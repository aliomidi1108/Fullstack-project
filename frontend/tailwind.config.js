export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B1E1E',
        secondary: '#D4AF37',

        'text-primary': '#1C1C1C',
        'text-secondary': '#6B6B6B',
        'text-disabled': '#828282',

        success: '#1FA971',
        'success-dark': '#17865A',
        'success-light': '#E9F7F1',

        error: '#C0392B',
        'error-dark': '#992D22',
        'error-light': '#FCEAEA',

        info: '#2980B9',
        'info-dark': '#1F5F8B',
        'info-light': '#EAF4FB',
      },

      fontSize: {
        'body-lg': '18px',
        'body-md': '16px',
        'h1': '32px',
        'section-title': '24px',
        'card-title': '20px',
        'button': '18px',
      },

      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },

      borderRadius: {
        pill: '9999px',
      },

      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          '2xl': '1400px',
        },
      },

      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
}
