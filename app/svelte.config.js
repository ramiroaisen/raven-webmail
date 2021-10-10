import preprocess from 'svelte-preprocess';
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		sourceMap: true
	}),

	kit: {
		trailingSlash: "never",
		target: '#svelte',
		files: {
			hooks: "./src/hooks.ts",
			serviceWorker: "./src/service-worker.ts",
		},
		adapter: adapter({ precompress: false }),
		vite: {
			sourceMap: true,
		}
	}
};

export default config;
