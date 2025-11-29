import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: './', // Use relative base path for GitHub Pages compatibility
    define: {
      // Polyfill process.env for the existing code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});