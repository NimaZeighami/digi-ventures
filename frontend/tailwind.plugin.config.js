import baseConfig from './tailwind.config.js';

export default {
  ...baseConfig,
  important: '.dv-app',
  corePlugins: { preflight: false },
  content: [
    './src/**/*.{js,css}',
    '../wordpress-plugin/digi-ventures/**/*.php',
  ],
};
