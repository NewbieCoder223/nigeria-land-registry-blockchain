import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Globe2, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

const GISCalibrations = ({ showToast }) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // Handling disconnected state to prevent infinite spinner
    setIsLoading(true);
    // Simulating GIS node sync
    setTimeout(() => setIsLoading(false), 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-nigeria-green animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-nigeria-green/10 border-0.5 border-nigeria-green/30 rounded-full text-[10px] font-bold text-nigeria-green uppercase tracking-widest mb-4">
              System: SPATIAL_ORACLE_V2
           </div>
           <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
             GIS <span className="text-white/40">Calibrations</span>
           </h2>
           <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Real-time Boundary Delta Monitoring</p>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={() => showToast('Synchronizing GIS Constellation: Aligning Satellite Nodes')}
             className="px-6 py-3 bg-nigeria-green/10 text-nigeria-green border-0.5 border-nigeria-green/30 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-nigeria-green hover:text-white transition-all shadow-lg shadow-nigeria-green/20"
           >
              <Zap className="w-4 h-4" />
              Sync Satellite Nodes
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-card border-white/5 p-8 bg-black/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Globe2 className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Activity className="text-nigeria-green w-5 h-5 animate-pulse" />
                     <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Constellation Health</span>
                  </div>
                  <div className="flex gap-4 font-mono text-[10px]">
                     <span className="text-nigeria-green">[ ACTIVE: 14 ]</span>
                     <span className="text-white/20">[ OFFLINE: 0 ]</span>
                  </div>
               </div>

               <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                      className={`h-12 rounded-lg border-0.5 border-white/10 ${i % 7 === 0 ? 'bg-amber-500/20' : 'bg-white/5'}`}
                    />
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Sync Offset</p>
                     <p className="text-xl font-black text-white italic">+0.00042ms</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Protocol Version</p>
                     <p className="text-xl font-black text-white italic">v5.2.4-stable</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase italic px-1">Security Protocols</h3>
            
            <div className="glass-card border-white/5 p-6 bg-reg-black/40 space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-500">
                     <ShieldAlert className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Alert Thresholds</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        className="h-full bg-amber-500"
                     />
                  </div>
                  <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">Boundary sensitivity locked at 0.01m.</p>
               </div>

               <div className="pt-6 border-t border-white/5 space-y-3">
                  <button 
                    onClick={() => showToast('Downloading GIS Protocol Logs: Root Authentication Confirmed')}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all font-mono"
                  >
                    Download Logs
                  </button>
               </div>
            </div>

            <div className="p-6 bg-nigeria-green/5 border border-nigeria-green/10 rounded-2xl">
               <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-4 h-4 text-nigeria-green" />
                  <span className="text-[10px] font-black text-nigeria-green uppercase tracking-widest leading-none">Verified</span>
               </div>
               <p className="text-[9px] text-white/40 uppercase font-black leading-relaxed tracking-widest italic">Consistent with IPFS state.</p>
            </div>
         </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-[10px] space-y-1">
         <p className="text-nigeria-green uppercase tracking-widest mb-2">[SURVEYOR CONSOLE V1.02]</p>
         <p className="text-white/40 uppercase leading-none"><span className="text-nigeria-green">&gt;</span> AUTHENTICATING SENSOR CLUSTER... <span className="text-white">OK</span></p>
         <p className="text-white/40 uppercase leading-none"><span className="text-nigeria-green">&gt;</span> POLLING SATELLITE ARRAY... <span className="text-white">OK</span></p>
         <p className="text-white/40 uppercase leading-none animate-pulse"><span className="text-nigeria-green">&gt;</span> MONITORING SPATIAL DRIFT...</p>
      </div>
    </motion.div>
  );
};

export default GISCalibrations;
