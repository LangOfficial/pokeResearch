/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", 'node_modules/preline/dist/*.js'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        primary: 'Quicksand',
      },
      colors: {
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },

        black: {
          500: "#2b2b2b",
        },
        gray: {
          500: '#7d7d7d',
        },
        white: {
          100: '#ffc'
        },
      },
      keyframes: {
        'custom-bounce': {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        }, 
        "fadeIn": {
          '0%': {
            opacity: 0,
          },
          
          '100%': {
            opacity: 1,
          },
        },
      },
      animation: {
        'custom-bounce': 'custom-bounce 1s infinite',
        "fadeIn": "fadeIn 0.2s ease-in",
      },
    },    
  },
  purge: {
    content: ["./public/**/*.{html,js}"], 
    safelist: [
      'bg-green-500',      'bg-red-400',
      'bg-blue-400',       'bg-yellow-300',
      'bg-teal-300',       'bg-orange-500',
      'bg-blue-300',  'bg-neutral-300',
      'bg-purple-400',     'bg-brown-600',
      'bg-purple-300', 
      'bg-pink-300',       'bg-brown-400',
      'bg-lime-400',       'bg-indigo-400',
      'bg-purple-500',     'bg-stone-400',
      'bg-neutral-600',    'bg-pink-400',
      'border-red-400',    'border-blue-400',
      'border-green-400',  'border-yellow-300',
      'border-black-500',  'border-brown-500',
      'border-purple-400', 'border-gray-500',
      'border-white-100',  'border-pink-300'
    ],
  },
};
