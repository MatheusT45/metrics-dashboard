import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [],
    test: {
      globals: true,
      environment: 'jsdom',
      deps: {
        inline: ['vuetify'],
      },
      exclude: [...configDefaults.exclude],
    },
  })
);
