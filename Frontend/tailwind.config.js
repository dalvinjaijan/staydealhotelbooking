/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        'navbar-green':'#50B498',
        'heading-green':'#468585',
        'light-green':'#96DBA6'

     
   }, fontFamily:{
    montserrat:["montserrat","sans-serif"],
    brawler:["brawler","sans-serif"]
  }
    },
  },
  plugins: [],
}

