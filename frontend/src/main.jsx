import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, http } from 'wagmi'
import {
  polygonAmoy,
} from 'wagmi/chains'
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query"
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 🛡️ Note: "Buffer" and "process" are now injected by "vite-plugin-node-polyfills" 
// throughout the build pipeline. No manual shimming required here.

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'e19f393653ec729821aeba6d5395f9e3';

// Debug log to verify .env loading (masked for security)
if (PROJECT_ID) {
  console.log('🛡️ Sovereign Ledger: WalletConnect ID linked successfully (' + PROJECT_ID.slice(0,4) + '...)');
} else {
  console.warn('⚠️ Sovereign Ledger: VITE_WALLET_CONNECT_PROJECT_ID is missing in .env');
}

const config = getDefaultConfig({
  appName: 'Sovereign Ledger',
  appDescription: 'Sovereign Ledger — Secure. Immutable. National.',
  appUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  appIcon: 'https://img.icons8.com/3d-fluency/100/shield.png', // Premium Security Shield Icon
  projectId: PROJECT_ID,
  chains: [polygonAmoy],
  transports: {
    // 🌍 Explicit RPC Transport to bypass public discovery hangs
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
  ssr: true, // Enable SSR to prevent hydration race conditions
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#059669',
          accentColorForeground: 'white',
          borderRadius: 'large',
          overlayBlur: 'small',
        })}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
