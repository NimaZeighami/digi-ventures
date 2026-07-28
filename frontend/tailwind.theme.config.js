import baseConfig from './tailwind.config.js';

export default {
  ...baseConfig,
  important: '.dv-site',
  corePlugins: { preflight: false },
};
