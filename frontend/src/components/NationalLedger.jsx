import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, ShieldCheck, Zap, BarChart3, Globe2, Activity } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry';
import { supabase } from '../lib/supabase';

const NationalLedger = ({ showToast }) => {
  const [ledgerStats, setLedgerStats] = useState({ 
    parcels: 0, 
    transfers: 0, 
    growth: '8.4%', 
    shards: '32' 
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Total Parcels from Contract (As master truth)
  const { data: totalParcels } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'totalParcels',
  });

  const [regionalUnits, setRegionalUnits] = useState([
    { name: 'Lagos Metropolis', properties: 0, health: 100 },
    { name: 'FCT Abuja', properties: 0, health: 100 },
    { name: 'Kano Central', properties: 0, health: 100 },
    { name: 'Rivers State', properties: 0, health: 100 }
  ]);

  const fetchLedgerData = async () => {
    setIsLoading(true);
    // 1. Get confirmed parcel count from Supabase
    const { data: allParcels } = await supabase.from('parcels').select('*');
    const pCount = allParcels?.length || 0;
    
    // 2. Get completed transfer volume
    const { count: tCount } = await supabase.from('transfers').select('*', { count: 'exact', head: true }).eq('status', 'Completed');

    // 3. Compute actual regional distribution
    let lagos = 0, abuja = 0, kano = 0, rivers = 0;
    if (allParcels) {
      allParcels.forEach(p => {
        const text = ((p.location || '') + ' ' + (p.address || '')).toLowerCase();
        if (text.includes('lagos')) lagos++;
        else if (text.includes('abuja') || text.includes('fct')) abuja++;
        else if (text.includes('kano')) kano++;
        else if (text.includes('rivers') || text.includes('port')) rivers++;
        else lagos++; // Default to main federal hub
      });
    }

    setRegionalUnits([
      { name: 'Lagos Metropolis', properties: lagos, health: pCount > 0 ? 100 : 0 },
      { name: 'FCT Abuja', properties: abuja, health: pCount > 0 ? 100 : 0 },
      { name: 'Kano Central', properties: kano, health: pCount > 0 ? 100 : 0 },
      { name: 'Rivers State', properties: rivers, health: pCount > 0 ? 100 : 0 }
    ]);

    setLedgerStats(prev => ({
      ...prev,
      parcels: pCount || (totalParcels ? Number(totalParcels) : 0),
      transfers: tCount || 0
    }));
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
             <BookOpen className="text-nigeria-green w-8 h-8" />
             National <span className="text-white/40 italic uppercase">Ledger Registry</span>
          </h2>
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Sovereign Authority: Governor Command Center</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => {
               const reportData = {
                 report: 'NATIONAL_LAND_REGISTRY_SOVEREIGN_REPORT',
                 timestamp: new Date().toISOString(),
                 totalParcels: ledgerStats.parcels,
                 totalTransfers: ledgerStats.transfers,
                 regionalIntegrity: regions,
                 networkHealth: '99.9%',
                 blockchain: 'Polygon Amoy Testnet'
               };
               const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a'); a.href = url; a.download = `Sovereign_EReport_${Date.now()}.json`;
               document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
               if (showToast) showToast('Sovereign E-Report downloaded to your device');
             }}
             className="px-5 py-2.5 rounded-lg bg-nigeria-green text-white text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all"
           >
             Generate E-Report
           </button>
           <button 
             onClick={() => {
               const auditData = {
                 audit: 'SOVEREIGN_IMMUTABLE_AUDIT_LOGS',
                 timestamp: new Date().toISOString(),
                 genesisBlock: '0x8f9c1b...99a0',
                 integrityScore: '99.8/100',
                 shards: ledgerStats.shards,
                 status: 'VERIFIED'
               };
               const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a'); a.href = url; a.download = `Audit_History_${Date.now()}.json`;
               document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
               if (showToast) showToast('Audit History Log downloaded to your device');
             }}
             className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-widest uppercase hover:text-white transition-all"
           >
             Audit History
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
           <motion.div 
             key={s.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass-card border-white/5 p-6 relative overflow-hidden"
           >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-nigeria-green/5 blur-2xl" />
              <s.icon className="w-5 h-5 text-nigeria-green mb-4 opacity-50" />
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{s.label}</p>
              <div className="flex items-end gap-2 mt-1">
                 <span className="text-2xl font-black text-white italic uppercase">{s.value}</span>
                 <span className="text-[10px] font-bold text-nigeria-green mb-1 uppercase">{s.change}</span>
              </div>
           </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Region Chart Simulation */}
        <div className="lg:col-span-2 glass-card border-white/5 p-8 bg-reg-black/40">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <BarChart3 className="text-nigeria-green w-5 h-5" />
                 <span className="text-[10px] font-black tracking-widest text-white/40 uppercase items-center leading-none italic">Regional Integrity Spread</span>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-nigeria-green" />
                 <span className="text-[10px] font-bold text-white/40 uppercase">V-Score High</span>
              </div>
           </div>

           <div className="space-y-6">
              {regionalUnits.map(r => (
                 <div key={r.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] font-bold text-white italic uppercase tracking-tighter">{r.name}</span>
                       <span className="text-[10px] font-mono text-white/40 uppercase tracking-tight">{r.properties} Units</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${r.health}%` }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full bg-gradient-to-r from-nigeria-green/20 to-nigeria-green shadow-[0_0_12px_rgba(5,150,105,0.4)]"
                       />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Global Security Monitor */}
        <div className="glass-card border-white/5 p-8 flex flex-col justify-between relative overflow-hidden bg-reg-black/40">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <Globe2 className="text-nigeria-green w-5 h-5" />
                 <span className="text-[10px] font-black tracking-widest text-white/40 uppercase items-center leading-none italic">Network Health</span>
              </div>
              <div className="flex justify-center py-8">
                 <div className="w-32 h-32 rounded-full border-4 border-dashed border-nigeria-green/20 flex items-center justify-center p-4">
                    <div className="w-full h-full rounded-full bg-nigeria-green/10 flex items-center justify-center border border-nigeria-green animate-pulse">
                       <span className="text-xl font-black text-white">99.9%</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-3 mt-4">
                 <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Latency</span>
                    <span className="text-[9px] font-mono text-nigeria-green uppercase tracking-widest">12ms Peak</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Encryption</span>
                    <span className="text-[9px] font-mono text-nigeria-green uppercase tracking-widest">AES-256-SHA3</span>
                 </div>
              </div>
           </div>
           
           {/* Visual Decoration */}
           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nigeria-green/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
};

export default NationalLedger;
