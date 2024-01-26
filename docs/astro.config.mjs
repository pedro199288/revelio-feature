import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  vite: {
    css: {
      postcss: { plugins: [] },
    },
  },
  integrations: [
    starlight({
      title: 'Revelio Feature',
      favicon: './src/assets/revelio-feature-favicon.png',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: './src/assets/revelio-feature-favicon.ico',
            sizes: '32x32',
          },
        },
      ],
      logo: { src: './src/assets/revelio-feature-favicon.png' },
      social: {
        github: 'https://github.com/pedro199288/revelio-feature',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              link: '/guides/example/',
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
      customCss: ['./src/tailwind.css'],
    }),
    tailwind(),
  ],
});
