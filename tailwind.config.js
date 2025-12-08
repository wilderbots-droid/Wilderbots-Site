/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './views/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 20s linear infinite',
        'float-3d': 'float3D 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float3D: {
          '0%': { transform: 'translateY(0) rotateX(0) rotateY(0)' },
          '50%': { transform: 'translateY(-20px) rotateX(5deg) rotateY(5deg)' },
          '100%': { transform: 'translateY(0) rotateX(0) rotateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

