import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/portal',
  plugins: [nxViteTsPaths()],
  server: {
    port: 4200,
    host: '0.0.0.0'
  },
  preview: {
    port: 4300,
    host: '0.0.0.0'
  }
});
