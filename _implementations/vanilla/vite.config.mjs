/** @type {import('vite').UserConfig} */
export default {
  css: {
    postcss: { plugins: [require('tailwindcss'), require('autoprefixer')] },
  },
};
