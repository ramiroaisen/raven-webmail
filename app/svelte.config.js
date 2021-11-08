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
        prerender: { enabled: false },
        ssr: false,
        files: {
            hooks: "./src/hooks.ts",
            serviceWorker: "./src/service-worker.ts",
        },
        adapter: adapter({ precompress: false }),
    }
};

export default config;