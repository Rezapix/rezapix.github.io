// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rpix.top',
  output: 'static',
  compressHTML: true,
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
