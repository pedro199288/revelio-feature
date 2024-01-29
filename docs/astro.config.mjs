import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  // for sitemap
  site: 'https://revelio-feature.monjimind.com/',
  integrations: [
    starlight({
      title: 'Revelio Feature',
      favicon: '/public/favicon.png',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/public/favicon.ico',
            sizes: '32x32',
          },
        },
      ],
      logo: { src: '/public/favicon.png' },
      social: {
        github: 'https://github.com/pedro199288/revelio-feature',
      },
      sidebar: [
        {
          label: 'Guides',
          translations: {
            es: 'Guías',
          },
          autogenerate: {
            directory: 'guides',
          },
        },
        {
          label: 'Examples',
          translations: {
            es: 'Ejemplos',
          },
          autogenerate: {
            directory: 'examples',
          },
        },
      ],
      components: {
        Footer: './src/components/Footer.astro',
      },
      editLink: {
        baseUrl:
          'https://github.com/pedro199288/revelio-feature/edit/main/docs/',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          lang: 'en',
          label: 'English',
        },
        es: {
          label: 'Español',
          lang: 'es',
        },
      },
      customCss: ['./src/tailwind.css'],
    }),
    tailwind(),
  ],
});
