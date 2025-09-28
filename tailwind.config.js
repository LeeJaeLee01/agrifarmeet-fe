/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        red: '#d60016',
        green: '#3da35d',
        orange: '#f4a259',
        orange2: '#f3933f',
        red: '#EB5757',
        text1: '#171725',
        text2: '#4B5264',
        text3: '#808191',
        text4: '#B2B3BD',
        purple: '#6F49FD',
        'bg-secondary': '#f6f6f6',
        'secondary-green': '#E8F5E9',
        green2: '#1DC071',
        green3: '#4ACD8D',
        gray: '#f0f4f5',
        gray2: '#f9f9f9',
        'gray-secondary': '#f6f6f6',
        'gray-border': '#e5e6e7',
        border: '#d9d9d9',
        beige: '#e5e5d1',
        brown: '#615130',
      },
    },
  },
  plugins: [],
};
