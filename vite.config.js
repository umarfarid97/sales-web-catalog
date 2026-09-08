import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const mpaRewritePlugin = () => {
  const rewrite = (req, res, next) => {
    const rawUrl = req.url || '';
    const cleanPath = rawUrl.split('?')[0];
    const pages = ['product', 'men', 'women', 'collection', 'bundle', 'checkout', 'diagnostic', 'admin'];
    for (const page of pages) {
      if (cleanPath === `/${page}` || cleanPath === `/${page}/`) {
        const query = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
        req.url = `/${page}.html${query}`;
        break;
      }
    }
    next();
  };
  return {
    name: 'mpa-rewrite',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mpaRewritePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        collection: resolve(__dirname, 'collection.html'),
        men: resolve(__dirname, 'men.html'),
        women: resolve(__dirname, 'women.html'),
        bundle: resolve(__dirname, 'bundle.html'),
        product: resolve(__dirname, 'product.html'),
        diagnostic: resolve(__dirname, 'diagnostic.html'),
        admin: resolve(__dirname, 'admin.html'),
        checkout: resolve(__dirname, 'checkout.html'),
      },
    },
  },
})
