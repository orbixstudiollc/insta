import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dribbble: {
          pink: '#ea4c89',
          'pink-dark': '#c93d73',
          'pink-light': '#f082ac',
        },
      },
    },
  },
  plugins: [],
}
export default config
