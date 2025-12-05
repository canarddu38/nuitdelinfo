/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
    server: {
      proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
    host: '0.0.0.0',
    port: 3000
  },
  
  plugins: [react(), tsconfigPaths()],
})

