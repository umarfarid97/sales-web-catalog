import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        collection: resolve(__dirname, 'collection.html'),
        bundle: resolve(__dirname, 'bundle.html'),
        product: resolve(__dirname, 'product.html'),
        diagnostic: resolve(__dirname, 'diagnostic.html'),
        admin: resolve(__dirname, 'admin.html'),
        checkout: resolve(__dirname, 'checkout.html'),
      },
    },
  },
})
