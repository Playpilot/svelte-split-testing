import cloudflare from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-auto';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: isProduction ? cloudflare({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    }) : adapter()
	}
};

export default config;
