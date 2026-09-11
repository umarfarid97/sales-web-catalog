import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const mpaRewritePlugin = () => {
  const rewrite = (req, res, next) => {
    const rawUrl = req.url || '';
    const cleanPath = rawUrl.split('?')[0];
    const pages = ['product', 'men', 'women', 'collection', 'checkout', 'diagnostic', 'admin'];
    if (cleanPath === '/bundle' || cleanPath === '/bundle/') {
      const query = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
      req.url = `/collection.html${query}`;
      next();
      return;
    }
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isSandbox = env.VITE_TOYYIBPAY_SANDBOX !== 'false';
  const toyyibTarget = isSandbox ? 'https://dev.toyyibpay.com' : 'https://toyyibpay.com';

  return {
    plugins: [react(), mpaRewritePlugin()],
    server: {
      proxy: {
        '/toyyib-api': {
          target: toyyibTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/toyyib-api/, '')
        }
      }
    },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        collection: resolve(__dirname, 'collection.html'),
        men: resolve(__dirname, 'men.html'),
        women: resolve(__dirname, 'women.html'),
        product: resolve(__dirname, 'product.html'),
        diagnostic: resolve(__dirname, 'diagnostic.html'),
        admin: resolve(__dirname, 'admin.html'),
        checkout: resolve(__dirname, 'checkout.html'),
      },
    },
  },
};
});
