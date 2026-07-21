// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');

/**
 * RPIX Creative OS — Astro Configuration
 * Architecture optimized for Cloudflare Pages + Workers edge deployment.
 */
export default defineConfig({
  site: 'https://rpix.studio',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_rpix',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': src,
        '@components': path.join(src, 'components'),
        '@layouts': path.join(src, 'layouts'),
        '@lib': path.join(src, 'lib'),
        '@styles': path.join(src, 'styles'),
        '@data': path.join(src, 'data'),
        '@hooks': path.join(src, 'hooks'),
        '@content': path.join(src, 'content'),
      },
    },
    build: {
      cssMinify: true,
    },
    ssr: {
      noExternal: ['gsap', 'lenis'],
    },
  },
  integrations: [
    react({
      include: ['**/components/admin/**', '**/components/**/*.tsx'],
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
  image: {
    domains: ['imagedelivery.net', 'cloudflarestream.com'],
  },
});
