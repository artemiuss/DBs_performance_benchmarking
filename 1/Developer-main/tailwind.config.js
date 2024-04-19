/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    fontFamily: {
      sans: ['"Open Sans"','sans-serif']
    },
    colors: {
      'white': '#ffffff',
      'sherpa-blue': {
        '50': '#ecffff',
        '100': '#bdf9ff',
        '200': '#7bf2ff',
        '300': '#31e9ff',
        '400': '#00edff',
        '500': '#00e4ed',
        '600': '#00b3bf',
        '700': '#008b97',
        '800': '#006c77',
        '900': '#004c54', // primary color from TRX style sheet
        '950': '#00353d',
      },
      'screamin-green': {
        '50': '#f1fde8',
        '100': '#defacd',
        '200': '#bff5a1',
        '300': '#87ea55', // accent color from TRX style sheet
        '400': '#70df3c',
        '500': '#51c51d',
        '600': '#3b9d13',
        '700': '#2e7813',
        '800': '#295f15',
        '900': '#245116',
        '950': '#0f2c07',
      },
      'gray': {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
      }
    },
    extend: {},
  },
  plugins: [],
}

