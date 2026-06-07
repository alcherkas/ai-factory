import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages gotcha #1: a *project* page is served from
//   https://<user>.github.io/<repo>/
// so all asset URLs must be prefixed with the repo name. If you rename the
// repo, change this to match. Use '/' instead for a user/org page
// (<user>.github.io) or when you attach a custom domain.
export default defineConfig({
  base: '/ai-factory/',
  plugins: [react()],
})
