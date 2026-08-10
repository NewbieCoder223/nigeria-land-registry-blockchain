import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, 
  Terminal, 
  Wallet, 
  Shield, 
  Zap, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  X
} from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { useNavigate } from 'react-router-dom';

const DebugOverlay = ({ role, setRole, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const handleRoleShift = (r) => {
    setRole(r);
    localStorage.setItem('user_role', r);
    if (showToast) showToast(`Identity Shifted to ${r}`);

    switch (r) {
      case 'GOVERNOR': navigate('/governor'); break;
      case 'SURVEYOR': navigate('/surveyor'); break;
      case 'VERIFIER': navigate('/verifier'); break;
      case 'REGISTRAR': navigate('/registrar'); break;
      default: navigate('/dashboard'); break;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] p-4 bg-rose-600 text-white rounded-full shadow-2xl hover:bg-rose-700 transition-colors border-2 border-white/20"
      >
        <Bug className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        className="fixed bottom-6 right-6 z-[9999] w-80 glass-card border-white/20 shadow-2xl overflow-hidden bg-reg-black/95 backdrop-blur-3xl"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-rose-600/10">
          <div className="flex items-center gap-2 text-rose-500">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Debug Console</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* RPC Status */}
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
             <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Network Status</span>
             </div>
             <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Polygon Amoy ({chainId || 80002})</span>
          </div>

          {/* Wallet Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/40">
              <Wallet className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Active Address</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden">
               <span className="text-[11px] font-mono text-white/80 block break-all leading-tight">
                 {address || 'NOT_CONNECTED'}
               </span>
            </div>
          </div>

          {/* Role Switcher (QA Tool) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/40">
              <Shield className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Sovereign Identity Override</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['LANDOWNER', 'SURVEYOR', 'VERIFIER', 'GOVERNOR', 'REGISTRAR'].map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleShift(r)}
                  className={`px-2 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                    role === r 
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
             <button 
               onClick={clearAuth}
               className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all group"
             >
                <Trash2 className="w-3 h-3 group-hover:text-rose-500" />
                <span className="text-[9px] font-bold uppercase">Clear JWT</span>
             </button>
             <button 
               onClick={() => window.location.reload()}
               className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all group"
             >
                <RefreshCw className="w-3 h-3 group-hover:text-emerald-500" />
                <span className="text-[9px] font-bold uppercase">Reload UI</span>
             </button>
          </div>

          <div className="pt-2 border-t border-white/5">
             <a 
               href="https://amoy.polygonscan.com/" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center justify-between p-2 text-white/20 hover:text-white/60 transition-all"
             >
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Open PolygonScan</span>
                <ExternalLink className="w-3 h-3" />
             </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DebugOverlay;
