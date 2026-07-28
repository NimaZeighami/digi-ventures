import { resolve } from 'path';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

/**
 * Build CSS/JS into the WordPress theme assets/dist folder.
 */
export default defineConfig({
	base: './',
	css: {
		postcss: { plugins: [tailwindcss('./tailwind.theme.config.js'), autoprefixer()] },
	},
  build: {
    outDir: resolve(__dirname, '../wordpress-theme/digiventures-theme/assets/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: 'main.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
