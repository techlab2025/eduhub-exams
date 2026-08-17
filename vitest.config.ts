import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

const cssStub = fileURLToPath(new URL('./src/__tests__/stubs/empty-module.ts', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'cropperjs/dist/cropper.css': cssStub,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      maxWorkers: 4,
      env,
      setupFiles: ['./src/__tests__/setup.ts'],
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html'],
        thresholds: {
          statements: 64,
          branches: 55,
          functions: 48,
          lines: 64,
        },
      },
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
    server: {
      fs: {
        strict: false,
      },
    },
  };
});
