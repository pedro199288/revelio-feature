import tailwindCss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/** @type {import('vite').UserConfig} */
export default {
  css: {
    postcss: { plugins: [tailwindCss, autoprefixer] },
  },
};
