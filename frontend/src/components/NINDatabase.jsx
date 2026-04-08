import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, ShieldCheck, Search, Database, Fingerprint, Lock, ShieldAlert, Zap, RefreshCcw } from 'lucide-react';

const NINDatabase = ({ showToast }) => {
  const records = [
    {
      nin: '*********241',
      name: 'Oluwaseun Adeyemi',
      status: 'VERIFIED',
      matchScore: '100%',
      lastSync: '2 minutes ago'
    },
    {
      nin: '*********892',
      name: 'Chidi Okoro',
      status: 'VERIFIED',
      matchScore: '98%',
      lastSync: '1 hour ago'
    },
    {
      nin: '*********553',
      name: 'Fatima Abubakar',
      status: 'FLAGGED',
      matchScore: '65%',
      lastSync: 'Just now'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tight uppercase flex items-center gap-3">
             <UserCircle className="text-nigeria-green w-8 h-8" />
             National <span className="text-nigeria-green italic uppercase italic">Identity Interface</span>
          </h2>
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Cross-Reference Sync with NIMC Database</p>
        </div>
        
        <div className="w-full md:w-auto relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-nigeria-green transition-colors" />
           <input 
             type="text" 
             placeholder="ENTER NIN OR BIOMETRIC ID..." 
             className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-[10px] font-black tracking-widest uppercase focus:ring-1 focus:ring-nigeria-green/50 placeholder:text-white/10 outline-none"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Database Status */}
         <div className="glass-card border-white/5 p-6 bg-reg-black/40">
            <div className="flex items-center gap-3 mb-6">
               <Database className="w-5 h-5 text-nigeria-green" />
               <span className="text-[10px] font-bold tracking-widest uppercase italic">Live Synchrony</span>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Global Records Swapped</label>
                  <p className="text-2xl font-black text-white italic mt-1 leading-none">204,120,442</p>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => showToast('Initiating Biometric Identity Refresh: Syncing with NIMC Core')}
                    className="px-6 py-3 bg-nigeria-green/10 text-nigeria-green border-0.5 border-nigeria-green/30 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-nigeria-green hover:text-white transition-all"
                  >
                     <RefreshCcw className="w-4 h-4" />
                     Refresh Identity Nodes
                  </button>
               </div>
            </div>
         </div>

         {/* Encryption Status */}
         <div className="glass-card border-white/5 p-6 bg-reg-black/40">
            <div className="flex items-center gap-3 mb-6">
               <Fingerprint className="w-5 h-5 text-nigeria-green" />
               <span className="text-[10px] font-bold tracking-widest uppercase italic">ZKP Verification</span>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Identity Proofing</label>
                  <p className="text-sm font-bold text-white uppercase italic mt-1 leading-none">Zero-Knowledge Circuit Active</p>
               </div>
               <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-white/40" />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest italic italic">Hardware Enclave Secure</span>
               </div>
            </div>
         </div>

         {/* Global Alerts */}
         <div className="glass-card border-white/5 p-6 bg-red-500/5">
            <div className="flex items-center gap-3 mb-6">
               <ShieldAlert className="w-5 h-5 text-red-500" />
               <span className="text-[10px] font-bold tracking-widest uppercase italic text-red-500">Conflict Alerts</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => showToast('Connecting to National Identity Management Commission (NIMC) Secure Bridge')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                 <RefreshCcw className="w-3.5 h-3.5" />
                 Fetch Latest Records
              </button>
              <button 
                onClick={() => showToast('Initiating Manual Identity Override: Root Authority Authentication Required')}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                 Manual Override
              </button>
            </div>
         </div>
      </div>

      <div className="glass-card border-white/5 overflow-hidden bg-reg-black/40">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-white/5">
                  <th className="p-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Identity Hash (NIN)</th>
                  <th className="p-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Legal Name</th>
                  <th className="p-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Score</th>
                  <th className="p-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right">Last Sync</th>
               </tr>
            </thead>
            <tbody>
               {records.map(r => (
                  <tr key={r.nin} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className="p-4 text-[11px] font-mono text-white/60 tracking-wider items-center leading-none italic italic italic italic uppercase italic">{r.nin}</td>
                     <td className="p-4 text-[11px] font-black text-white italic italic italic italic uppercase italic">{r.name}</td>
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${r.status === 'FLAGGED' ? 'bg-red-500' : 'bg-nigeria-green'}`} style={{ width: r.matchScore }} />
                           </div>
                           <span className="text-[10px] font-black text-white/60 italic italic uppercase italic">{r.matchScore}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase italic italic italic italic uppercase italic ${r.status === 'FLAGGED' ? 'bg-red-500/10 text-red-500' : 'bg-nigeria-green/10 text-nigeria-green'}`}>
                           {r.status}
                        </span>
                     </td>
                     <td className="p-4 text-[9px] font-bold text-white/20 text-right uppercase tracking-widest italic">{r.lastSync}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </motion.div>
  );
};

export default NINDatabase;
