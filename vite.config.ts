import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'svg': ['@svgdotjs/svg.js'],
          'utils': ['lodash-es', 'nanoid']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@svgdotjs/svg.js', 'lodash-es', 'nanoid', 'file-saver']
  }
});
