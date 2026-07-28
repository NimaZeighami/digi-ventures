import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        team: resolve(__dirname, 'team.html'),
        contact: resolve(__dirname, 'contact.html'),
        news: resolve(__dirname, 'news.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        investmentRequest: resolve(__dirname, 'investment-request.html'),
      },
    },
  },
});
