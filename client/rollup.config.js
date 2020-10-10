import {readFileSync} from "fs";
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pp from "svelte-preprocess";
//import paths from "rollup-plugin-ts-paths";
import resolvePaths from "rollup-plugin-paths";

const tsconfig = (new Function("", "return " + readFileSync(__dirname + "/tsconfig.json")))();
const paths = (() => {
	const helper = {};
	for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
		helper[key.replace("*", "")] = value[0].replace("*", "");
	}
	return helper;
})();

const production = !process.env.ROLLUP_WATCH;
const dev = !production;


export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public/build'
	},
	plugins: [

		resolvePaths(paths),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},

			preprocess: pp()
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// !production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
