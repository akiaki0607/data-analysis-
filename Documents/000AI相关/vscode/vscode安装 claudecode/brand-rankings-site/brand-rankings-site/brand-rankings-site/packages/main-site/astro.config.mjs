import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://rankings.com',
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      rollupOptions: {
        external: [/^\/pagefind\//]
      }
    }
  }
});
