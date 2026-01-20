

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {

      animation: {
        'spin-slow': 'spin 0.9s linear infinite', // slow forward
        'spin-reverse': 'spin-reverse 0.9s linear infinite', // slow reverse
        'morph-circle': 'morph-circle 1s ease-in-out forwards', // morph into circle
        'zoom-in-out': 'zoomInOut 1.5s ease-in-out infinite', // inner circle zooms outward
        'zoom-out-in': 'zoomOutIn 1.5s ease-in-out infinite', // outer circle zooms inward
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'morph-circle': {
          '0%, 50%': { borderRadius: '1.5rem' }, // rounded-3xl
          '100%': { borderRadius: '50%' },
        },
        zoomInOut: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        zoomOutIn: {
          '0%, 100%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1)' },
        },
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        dark: "var(--color-dark)",

        'surface-card': "var(--card-bg)",
        'surface-body': "var(--body-bg)",
        'surface-table-header': "var(-table-header-bg)",
        'surface-hover': "var(--hover-bg)",
        'surface-active': "var(--active-bg)",
        'text-main': "var(--text-primary)",
        'text-subtle': "var(--text-secondary)",
        'text-link': "var(--text-link)",
        'border-primary': "var(--border-default)",
        'border-input': "var(--border-input)",
        'border-input-hover': "var(--border-input-hover)",
        'border-input-focus': "var(--border-input-focus)",
        'action-danger': "var(--color-danger)",
        'action-danger-hover-bg': "var(--color-danger-hover-bg)",
        'badge-pending-bg': "var(--badge-warning-bg)",
        'badge-pending-text': "var(--badge-warning-text)",
        'badge-completed-bg': "var(--badge-success-bg)",
        'badge-completed-text': "var(--badge-success-text)",
        'badge-cancelled-bg': "var(--badge-danger-bg)",
        'badge-cancelled-text': "var(--badge-danger-text)",
        'badge-refunded-bg': "var(--badge-netural-bg)",
        'badge-refunded-text': "var(--badge-netural-text)",
        'checkbox-bg': 'var(--color-checkbox-bg)',
        'checkbox-border': 'var(--color-checkbox-border)',
        /* Preloader */
        'preloader-outer': "var(--preloader-outer)",
        'preloader-inner': "var(--preloader-inner)",
      },
      spacing: {
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      fontSize: {
        // New Addition
        'xxs': ['var(--font-size-base-xxs)', '1rem'],

        // Existing
        'xs': ['var(--font-size-base-xs)', 'var(--line-height-base-xs)'],
        'sm': ['var(--font-size-base-sm)', '1.25rem'],
        'md': ['var(--font-size-base-md)', 'var(--line-height-base-md)'],
        'lg': ['var(--font-size-base-lg)', '1.75rem'],

        // New Additions
        'xl': ['var(--font-size-base-xl)', 'var(--line-height-base-xl)'],
        '2xl': ['var(--font-size-base-2xl)', 'var(--line-height-base-2xl)'],
      },

      fontWeight: {
        'hairline': '100',
        'thin': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',

      },


      transitionDuration: {
        300: "300ms",
      },

    },

  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
