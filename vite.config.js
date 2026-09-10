import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The backend URL is not knowable at build time unless the build environment
// sets it, and a silently-missing one ships a bundle that talks to whichever
// visitor's own machine happens to be listening on localhost - no build error,
// no runtime error, just a chatbot that never gets a response. This only
// enforces the check for `vite build` (command === 'build'); `vite dev` keeps
// using the component's own localhost fallback so local development needs no
// extra setup beyond the existing .env.local.
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), '')
    const apiBaseUrl = env.VITE_API_BASE_URL

    if (!apiBaseUrl) {
      throw new Error(
        'VITE_API_BASE_URL is not set. Set it in the build environment ' +
          '(e.g. the hosting platform\'s project settings) to the deployed ' +
          'backend URL before building for production.'
      )
    }

    try {
      const parsed = new URL(apiBaseUrl)
      if (!/^https?:$/.test(parsed.protocol)) throw new Error('not http(s)')
    } catch {
      throw new Error(
        `VITE_API_BASE_URL is not a valid http(s) URL: "${apiBaseUrl}"`
      )
    }
  }

  return {
    plugins: [react()],
  }
})
