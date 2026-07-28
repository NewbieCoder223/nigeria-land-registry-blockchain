import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, ShieldCheck, PenTool, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';

const StampDeed = () => {
  const [isSigning, setIsSigning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSeal = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsComplete(true);
    }, 2500);
  };

  const pendingTitle = {
    id: 'TIT-2026-X99',
    owner: 'Fidelis O. Eze',
    location: 'Plot 42, Gwarinpa Estate, Abuja',
    area: '850.5 sqm',
    hash: '0x7d2f...b91a'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-5xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center justify-center gap-4">
           <PenTool className="text-nigeria-green w-10 h-10" />
           Official <span className="text-nigeria-green">Blockchain Seal</span>
        </h2>
        <p className="text-[11px] text-white/40 font-mono tracking-widest uppercase mt-1">Registrar Authorization Desk: Final Authentication Layer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         {/* Deed Information Pane */}
         <div className="glass-card border-white/5 p-8 space-y-6 bg-reg-black/40">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <FileText className="text-nigeria-green w-5 h-5" />
               <span className="text-[12px] font-black tracking-widest text-white/60 uppercase italic">Document Integrity Report</span>
            </div>

            <div className="space-y-4 pt-4">
               <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Land Title Holder</label>
                  <p className="text-xl font-black text-white italic uppercase">{pendingTitle.owner}</p>
               </div>
               <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Geospatial Domain</label>
                  <p className="text-sm font-bold text-white/60 italic uppercase">{pendingTitle.location}</p>
               </div>
               <div className="flex items-center justify-between py-4 border-t border-dashed border-white/5">
                  <div>
                     <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Survey Dimensions</label>
                     <p className="text-sm font-black text-white italic uppercase">{pendingTitle.area}</p>
                  </div>
                  <div>
                     <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Title Index</label>
                     <p className="text-sm font-black text-nigeria-green italic uppercase tracking-widest">{pendingTitle.id}</p>
                  </div>
               </div>
            </div>

            <div className="bg-nigeria-green/5 border border-nigeria-green/10 p-4 rounded-xl flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-nigeria-green mt-0.5" />
               <p className="text-[10px] text-nigeria-green/60 uppercase font-bold italic leading-relaxed">
                  Encryption Verified. This document has passed all GIS boundary audits and identity verification checks. 
                  Ready for cryptographic sealing.
               </p>
            </div>
         </div>

         {/* Interaction Pane */}
         <div className="flex flex-col gap-6">
            <div className={`p-8 rounded-2xl border transition-all duration-700 flex flex-col items-center justify-center min-h-[300px] ${
               isComplete 
                 ? 'bg-nigeria-green/10 border-nigeria-green/50 shadow-[0_0_50px_rgba(5,150,105,0.2)]' 
                 : 'bg-reg-black/60 border-white/5'
            }`}>
               <AnimatePresence mode="wait">
                  {!isComplete ? (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                       <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-8 relative transition-all duration-300 ${
                          isSigning ? 'border-nigeria-green border-t-transparent animate-spin' : 'border-white/10'
                       }`}>
                          {!isSigning && <FileSignature className="w-10 h-10 text-white/20" />}
                       </div>
                       <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-8 italic">Pending Stamping</p>
                       <button 
                         onClick={handleSeal}
                         disabled={isSigning}
                         className="px-12 py-5 bg-nigeria-green text-white rounded-2xl font-black italic uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-nigeria-green/30 disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                       >
                         {isSigning ? 'DECRYPTING...' : 'APPLY OFFICIAL SEAL'}
                         {!isSigning && <PenTool className="w-4 h-4" />}
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center space-y-6"
                    >
                       <div className="w-24 h-24 rounded-full bg-nigeria-green flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.6)]">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                       </div>
                       <div className="text-center">
                          <h3 className="text-2xl font-black italic tracking-tighter text-nigeria-green uppercase">TITLE IMMORTALIZED</h3>
                          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-2">BLOCK: #1,204,552 | HASH: {pendingTitle.hash}</p>
                       </div>
                       <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-2">
                         <Download className="w-4 h-4 text-nigeria-green" />
                         Download Sealed Deed
                       </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Audit Trail Snippet */}
            <div className="p-6 bg-black/20 border border-white/5 rounded-2xl font-mono text-[9px] space-y-1 text-white/40">
               <p className="text-nigeria-green font-bold mb-2">IMMUTABLE AUDIT TRAIL:</p>
               <p>[10:42] Survey Validation: SUCCESS (±0.002m)</p>
               <p>[10:44] Identity (NIMC): MATCH FOUND (F.O.E)</p>
               <p>[10:55] Gas Optimization: CALCULATED</p>
               <p>[11:02] Registrar Node: ACTIVE</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default StampDeed;
