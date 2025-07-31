import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: isProduction, // false - dev, true - production
        }
      }
    }
  }
});
