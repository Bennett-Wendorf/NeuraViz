import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import livereload from 'rollup-plugin-livereload'

const dev: boolean = process.env.DEV === 'on';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),

    dev && livereload({
      watch: 'dist',
      delay: 2000,
    }),
  ],
})
