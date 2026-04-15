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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group by major dependency clusters to avoid circularity
            if (id.includes('leaflet') || id.includes('cobe')) {
              return 'visualization-vendor';
            }
            if (id.includes('@walletconnect') || id.includes('@rainbow-me') || id.includes('wagmi') || id.includes('viem') || id.includes('ethers')) {
              return 'web3-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Standard vendor for everything else
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
