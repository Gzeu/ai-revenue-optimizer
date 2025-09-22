import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    
    // Application configuration
    files: {
      assets: 'static',
      hooks: {
        client: 'src/hooks.client.js',
        server: 'src/hooks.server.js'
      },
      lib: 'src/lib',
      params: 'src/params',
      routes: 'src/routes',
      serviceWorker: 'src/service-worker.js',
      appTemplate: 'src/app.html'
    },
    
    // Environment variables
    env: {
      dir: './',
      publicPrefix: 'PUBLIC_'
    },
    
    // Output configuration
    output: {
      preloadStrategy: 'preload-mjs'
    },
    
    // Development server
    version: {
      name: process.env.npm_package_version
    }
  }
};

export default config;
