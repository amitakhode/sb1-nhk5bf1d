/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B4570', // Deep blue
          light: '#6B8CC7',
        },
        secondary: {
          DEFAULT: '#FFC107', // Warm yellow
          light: '#FFD54F',
        },
        accent: {
          red: '#E63946',    // Vibrant red
          yellow: '#FFB800', // Golden yellow
          blue: '#457B9D',   // Light blue
        },
        background: {
          light: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};