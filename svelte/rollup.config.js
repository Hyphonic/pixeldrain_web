import svelte from 'rollup-plugin-svelte';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { sveltePreprocess } from 'svelte-preprocess';
import * as html from '@rollup/plugin-html';

const production = !process.env.ROLLUP_WATCH;

const builddir = "../res/static/svelte";
export default [
	"file_viewer",
	"filesystem",
	"user_home",
	"user_file_manager",
	"admin_panel",
	"home_page",
	"text_upload",
	"speedtest",
	"upload_history",
].map((name, index) => ({
	input: `src/${name}.js`,
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `${builddir}/${name}.js`,
	},
	plugins: [
		sveltePreprocess(),
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				dev: !production,
			},
			emitCss: false,
		}),
		babel({
			extensions: [".js", ".ts", ".svelte"],
			babelHelpers: "bundled",
		}),
		resolve({
			browser: true,
			exportConditions: ['svelte'],
			extensions: ['.svelte'],
		}),
		commonjs(),
		nodeResolve(),
		typescript({
			compilerOptions: { lib: ["es2015", "dom"] },
			verbatimModuleSyntax: true,
		}),
		!production && livereload({
			watch: `${builddir}/${name}.*`,
			port: 5000 + index,
		}),
		production && terser(),

		// Add the HTML plugin to generate index.html files
		html({
			title: `${name} - PixelDrain`, // Use a more descriptive title
			template: ({ attributes, files, publicPath, title }) => {
				// Generate a basic HTML template with the bundled JS
				return `
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<title>${title}</title>
					</head>
					<body>
						<div id="app"></div>
						<script src="${files.js[0].fileName}"></script> <!-- Adjust to point to your JS bundle -->
					</body>
					</html>
				`;
			},
			fileName: `${builddir}/${name}.html`, // Ensure the HTML files are written to the correct location
			publicPath: './', // This should point to the root of the server
		}),
	],
	watch: {
		clearScreen: false,
	},
}));
