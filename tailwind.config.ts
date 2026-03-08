import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        field: '#0A7A2F',
        turf: '#0B5D22',
        ink: '#0D1117',
        accent: '#F97316'
      }
    }
  },
  plugins: []
};

export default config;
