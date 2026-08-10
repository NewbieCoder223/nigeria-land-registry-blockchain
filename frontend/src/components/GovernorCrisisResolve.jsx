import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, AlertTriangle, Lock, Globe2, BarChart3, Zap, Scale } from 'lucide-react';

const GovernorCrisisResolve = ({ showToast }) => {
  const hotCases = [
    {
      id: 'CRIS-992',
      location: 'Victoria Island, Lagos',
      type: 'Industrial vs Residential',
      value: '₦2B+',
      risk: 'CRITICAL'
    },
    {
      id: 'CRIS-104',
      location: 'Asokoro, Abuja',
      type: 'Double Attribution',
      value: '₦850M',
      risk: 'HIGH'
    }
  ];

  const handleEmergencyFreeze = async () => {
    try {
      await supabase.from('parcels').update({ status: 'FROZEN' }).eq('status', 'Disputed');
      if (showToast) showToast('National Emergency Asset Freeze Activated: Disputed Parcels Locked');
    } catch (e) {
      if (showToast) showToast('Freeze protocol error');
    }
  };

  const handleAuditLogsDownload = () => {
    const auditData = {
      system: 'CRISIS_RESOLVE_EXECUTIVE_AUDIT',
      timestamp: new Date().toISOString(),
      activeInterventions: hotCases,
      vulnerabilityScore: 'Moderate',
      litigationVelocity: '+4.2%',
      frozenAssetsTotal: '₦42.8B',
      status: 'VERIFIED_ON_CHAIN'
    };
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Sovereign_Crisis_Audit_${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (showToast) showToast('Sovereign Crisis Audit Log downloaded to your device');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-8 max-w-[1600px] mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-reg-black/40 border border-white/5 p-8 rounded-2xl relative overflow-hidden backdrop-blur-luxury">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldAlert className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center p-3 animate-pulse">
              <Scale className="w-8 h-8 text-rose-500" />
           </div>
           <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Legal <span className="text-rose-500 italic uppercase">Intervention Hub</span></h2>
              <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Sovereign Authority Oversight: Crisis Resolve Module</p>
           </div>
        </div>

        <div className="relative z-10 flex gap-4">
           <button 
             onClick={handleEmergencyFreeze}
             className="px-8 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-xl shadow-rose-500/30"
           >
             Activate Emergency Freeze
           </button>
           <button 
             onClick={handleAuditLogsDownload}
             className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 text-white/70 transition-all"
           >
             Audit Logs
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Conflict Distribution Heatmap */}
         <div className="lg:col-span-2 glass-card border-white/5 p-8 bg-black/40 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <Globe2 className="text-rose-500 w-5 h-5 transition-colors" />
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">National Conflict Intensity</span>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Active Litigate</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                  {[
                    { state: 'Lagos', count: 142, trend: '+12%' },
                    { state: 'Abuja (FCT)', count: 85, trend: '-2%' },
                    { state: 'Rivers', count: 64, trend: '+5%' },
                    { state: 'Kano', count: 42, trend: 'Stable' }
                  ].map(r => (
                     <div key={r.state} className="space-y-2 group">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-[11px] font-bold text-white uppercase italic tracking-tighter group-hover:text-rose-500 transition-colors">{r.state}</span>
                           <span className="text-[10px] font-mono text-white/40 italic uppercase">{r.count} Cases</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(r.count / 150) * 100}%` }}
                             className="h-full bg-gradient-to-r from-rose-500/20 to-rose-500"
                           />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                     <AlertTriangle className="text-rose-500 w-4 h-4" />
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Vulnerability Score</span>
                  </div>
                  <div className="flex justify-center py-4">
                     <span className="text-5xl font-black text-white italic tracking-tighter">Moderate</span>
                  </div>
                  <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed text-center tracking-widest italic">System recommendation: Review Gazetted Land in Ibeju-Lekki.</p>
               </div>
            </div>
         </div>

         {/* Intervention Actions */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase italic px-1">Urgent Interventions</h3>
            {hotCases.map(c => (
               <div key={c.id} className="glass-card border-white/5 p-6 bg-reg-black/40 space-y-4 group">
                  <div className="flex justify-between items-center">
                     <div className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[8px] tracking-widest uppercase">
                        {c.risk} RISK
                     </div>
                     <span className="text-[10px] font-mono text-white/20 italic">ID: {c.id}</span>
                  </div>
                  <div>
                     <p className="text-sm font-black text-white uppercase italic mb-1 group-hover:text-rose-500 transition-colors">{c.location}</p>
                     <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest italic">{c.type}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                     <div>
                        <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest block">Est. Market Value</label>
                        <span className="text-[11px] font-black text-white italic">{c.value}</span>
                     </div>
                     <button 
                       onClick={() => showToast('Initiating Judicial Dispute Resolution: Preparing Smart Contract Call')}
                       className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all italic"
                     >
                       Resolve
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
         <MetricBox icon={Activity} label="Litigation Velocity" value="+4.2%" color="text-rose-500" />
         <MetricBox icon={Lock} label="Frozen Assets" value="₦42.8B" color="text-blue-500" />
         <MetricBox icon={BarChart3} label="AUST Audit Score" value="99.8" color="text-nigeria-green" />
         <MetricBox icon={Zap} label="Blockchain Gas Optimization" value="S0.2" color="text-amber-500" />
      </div>

    </motion.div>
  );
};

const MetricBox = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card border-white/5 p-6 min-w-[240px] bg-reg-black/40 flex items-center gap-4">
     <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${color}`}>
        <Icon className="w-5 h-5" />
     </div>
     <div>
        <p className="text-[11px] font-black text-white italic italic uppercase leading-none">{value}</p>
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">{label}</p>
     </div>
  </div>
);

export default GovernorCrisisResolve;
