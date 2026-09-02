// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site (ubyjvovk.github.io) — served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://ubyjvovk.github.io',
  integrations: [sitemap()],
  build: {
    // GitHub Pages serves /foo/ and /foo equally well; directory output keeps
    // clean URLs without a trailing-slash redirect.
    format: 'directory',
  },
});
