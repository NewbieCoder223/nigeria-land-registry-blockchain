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

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'e19f393653ec729821aeba6d5395f9e3';

if (PROJECT_ID) {
  console.log('🛡️ Sovereign Ledger: WalletConnect ID linked successfully (' + PROJECT_ID.slice(0,4) + '...)');
} else {
  console.warn('⚠️ Sovereign Ledger: VITE_WALLET_CONNECT_PROJECT_ID is missing in .env');
}

const config = getDefaultConfig({
  appName: 'Sovereign Ledger',
  appDescription: 'Sovereign Ledger — Secure. Immutable. National.',
  appUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  appIcon: 'https://img.icons8.com/3d-fluency/100/shield.png',
  projectId: PROJECT_ID,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http('https://polygon-amoy.drpc.org'),
  },
})

const queryClient = new QueryClient()

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-8 text-white text-center font-sans space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
             <span className="text-2xl text-rose-500">⚠️</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight italic">System Synchronization Exception</h2>
          <p className="text-xs text-white/50 max-w-md uppercase tracking-wider font-mono">
            {this.state.error?.toString() || 'An unexpected state error occurred during wallet connection.'}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-6 py-3 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-all"
            >
              Reset Session & Cache
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalErrorBoundary>
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
  </GlobalErrorBoundary>
)
