import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import path from 'path';

const projectRoot = __dirname; // /usr/src/app/apps/portal
const srcRoot = path.resolve(projectRoot, 'src');
const distRoot = path.resolve(projectRoot, 'dist');

export default defineConfig({
  cacheDir: path.resolve(projectRoot, '../../node_modules/.vite/portal'),
  root: srcRoot,
  publicDir: path.resolve(srcRoot, 'assets'),
  build: {
    outDir: distRoot,
    target: 'esnext',
    emptyOutDir: true
  },
  plugins: [nxViteTsPaths()],
  server: {
    port: 4200,
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      allow: [projectRoot, path.resolve(projectRoot, '../..')]
    }
  },
  preview: {
    port: 4300,
    host: '0.0.0.0'
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
        target: 'ES2020'
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true
        }
      }
    }
  }
});
