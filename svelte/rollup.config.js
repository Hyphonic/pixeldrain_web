import html from '@rollup/plugin-html'; // Or use named import if needed
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { sveltePreprocess } from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;
const builddir = "../res/static/svelte";

export default [
  "file_viewer", "filesystem", "user_home", "user_file_manager",
  "admin_panel", "home_page", "text_upload", "speedtest", "upload_history"
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
    typescript(),
    !production && livereload({
      watch: `${builddir}/${name}.*`,
      port: 5000 + index,
    }),
    production && terser(),
    html({
      title: `${name} - PixelDrain`,
      template: ({ attributes, files, publicPath, title }) => {
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
          </head>
          <body>
            <div id="app"></div>
            <script src="${files.js[0].fileName}"></script>
          </body>
          </html>
        `;
      },
      fileName: `${builddir}/${name}.html`,
      publicPath: './',
    }),
  ],
  watch: {
    clearScreen: false,
  },
}));
