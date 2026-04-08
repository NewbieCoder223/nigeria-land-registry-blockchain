import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 🛡️ Industry-standard Node.js polyfill injection
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'global', 'events', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    // 🛡️ Fallback for process.env (often needed even with polyfills in Vite)
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      // 🛡️ Explicitly force pre-bundling of wallet providers to prevent "Could not resolve" browser errors
      '@walletconnect/ethereum-provider',
      '@walletconnect/utils',
      'buffer',
      'process',
      'util',
    ],
  }
})
