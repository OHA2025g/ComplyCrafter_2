import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/portal',
  root: __dirname + '/src',
  publicDir: __dirname + '/src/assets',
  build: {
    outDir: '../../dist/apps/portal',  // ✅ FIXED
    emptyOutDir: true,                 // ✅ Ensures clean builds
    target: 'esnext'
  },
  plugins: [nxViteTsPaths()],
  server: {
    port: 4200,
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      allow: [__dirname, __dirname + '/../..']
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
