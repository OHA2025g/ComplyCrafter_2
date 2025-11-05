import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Define __dirname for ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  cacheDir: join(__dirname, '../../node_modules/.vite/portal'),
  root: join(__dirname, 'src'),
  publicDir: join(__dirname, 'src/assets'),
  build: {
    outDir: join(__dirname, 'dist'),
    target: 'esnext',
    emptyOutDir: true
  },
  plugins: [nxViteTsPaths()],
  server: {
    port: 4200,
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      allow: [__dirname, join(__dirname, '../..')]
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
