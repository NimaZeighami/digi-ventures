import { resolve } from 'path';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: './',
  css: {
    postcss: { plugins: [tailwindcss('./tailwind.plugin.config.js'), autoprefixer()] },
  },
  build: {
    outDir: resolve(__dirname, '../wordpress-plugin/digiventures-core/assets'),
    emptyOutDir: false,
    manifest: 'manifest.json',
    rollupOptions: {
      input: resolve(__dirname, 'src/plugin.js'),
      output: {
        entryFileNames: 'application.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/application.css';
          }
          return 'css/[name][extname]';
        },
      },
    },
  },
});
