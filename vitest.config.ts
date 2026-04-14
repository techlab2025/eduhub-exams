import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// Stub for CSS imports that don't resolve in test environment
const cssStub = resolve(__dirname, 'src/__tests__/stubs/empty-module.ts');

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // cropperjs v2 no longer ships a CSS file at this path
            'cropperjs/dist/cropper.css': cssStub,
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.ts'],
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
    server: {
        fs: {
            strict: false
        }
    }
});
