/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// Example component
export default function Example() {
  return (
    <div className="p-4 text-white bg-blue-500 rounded-lg animate-bounce">
      Animated Element
    </div>
  )
}
