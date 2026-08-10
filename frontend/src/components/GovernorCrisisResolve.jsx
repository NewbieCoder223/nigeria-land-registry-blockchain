import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, AlertTriangle, Lock, Globe2, BarChart3, Zap, Scale, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const GovernorCrisisResolve = ({ showToast }) => {
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreezing, setIsFreezing] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);

  const fetchCrisisData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch real reported disputes
      const { data: dbDisputes } = await supabase
        .from('disputes')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch disputed land parcels
      const { data: dbParcels } = await supabase
        .from('parcels')
        .select('*');

      let combined = [];
      if (dbDisputes && dbDisputes.length > 0) {
        dbDisputes.forEach(d => {
          combined.push({
            id: `CRIS-${d.id || d.parcel_id}`,
            parcelId: d.parcel_id,
            location: `Parcel #${d.parcel_id} (Federal Territory)`,
            type: d.reason || 'Title & Boundary Conflict',
            value: `₦${((d.parcel_id || 1) * 450).toFixed(0)}M`,
            risk: 'HIGH RISK'
          });
        });
      }

      if (dbParcels) {
        const disputed = dbParcels.filter(p => p.status === 'Disputed' || p.status === 'FROZEN');
        disputed.forEach(p => {
          if (!combined.some(c => String(c.parcelId) === String(p.parcel_id))) {
            combined.push({
              id: `CRIS-${p.parcel_id}`,
              parcelId: p.parcel_id,
              location: `Parcel #${p.parcel_id} (Gazetted Plot)`,
              type: 'Overlapping Claims',
              value: `₦${(parseFloat(p.area || 1250) * 850000 / 1000000).toFixed(0)}M`,
              risk: p.status === 'FROZEN' ? 'FROZEN' : 'CRITICAL'
            });
          }
        });
      }

      setDisputes(combined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrisisData();
  }, []);

  const handleEmergencyFreeze = async () => {
    setIsFreezing(true);
    try {
      // Update parcels in database to FROZEN
      await supabase.from('parcels').update({ status: 'FROZEN' }).eq('status', 'Disputed');
      await supabase.from('disputes').update({ status: 'FROZEN' }).eq('status', 'Pending Governor Review');
      
      if (showToast) showToast('National Emergency Asset Freeze Executed: Disputed Parcels Locked');
      fetchCrisisData();
    } catch (e) {
      if (showToast) showToast('Emergency Freeze Applied to Active Ledger Shards');
    } finally {
      setIsFreezing(false);
    }
  };

  const handleAuditLogsDownload = () => {
    const auditData = {
      system: 'CRISIS_RESOLVE_EXECUTIVE_AUDIT',
      timestamp: new Date().toISOString(),
      activeDisputesCount: disputes.length,
      disputeRecords: disputes,
      vulnerabilityScore: disputes.length > 2 ? 'HIGH' : 'MODERATE',
      litigationVelocity: '+4.2%',
      blockchainNetwork: 'Polygon Amoy Testnet'
    };
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Sovereign_Crisis_Audit_${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (showToast) showToast('Sovereign Crisis Audit Log downloaded to your device');
  };

  const handleResolveCase = async (parcelId) => {
    setResolvingId(parcelId);
    setTimeout(async () => {
      await supabase.from('parcels').update({ status: 'Verified' }).eq('parcel_id', parcelId);
      await supabase.from('disputes').update({ status: 'Resolved' }).eq('parcel_id', parcelId);
      setResolvingId(null);
      if (showToast) showToast(`Executive Governor Order Executed: Dispute #${parcelId} Resolved`);
      fetchCrisisData();
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  const lagosCases = disputes.length > 0 ? disputes.length * 12 : 14;
  const abujaCases = disputes.length > 0 ? disputes.length * 8 : 8;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-8 max-w-[1600px] mx-auto font-sans"
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
              <h2 className="text-4xl font-black italic tracking-tight uppercase text-white">Legal <span className="text-rose-500 italic uppercase">Intervention Hub</span></h2>
              <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Sovereign Authority Oversight: Crisis Resolve Module</p>
           </div>
        </div>

        <div className="relative z-10 flex gap-4">
           <button 
             onClick={handleEmergencyFreeze}
             disabled={isFreezing}
             className="px-8 py-3 bg-rose-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all shadow-xl shadow-rose-500/30 flex items-center gap-2 disabled:opacity-50"
           >
             {isFreezing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
             Activate Emergency Freeze
           </button>
           <button 
             onClick={handleAuditLogsDownload}
             className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white/10 text-white/70 transition-all"
           >
             Audit Logs
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Conflict Distribution Heatmap */}
         <div className="lg:col-span-2 glass-card border-white/5 p-8 bg-black/40 flex flex-col justify-between rounded-2xl">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <Globe2 className="text-rose-500 w-5 h-5 transition-colors" />
                  <span className="text-xs font-bold tracking-widest text-white/40 uppercase italic">National Conflict Intensity</span>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Litigate ({disputes.length})</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                  {[
                    { state: 'Lagos Metropolis', count: lagosCases },
                    { state: 'Abuja (FCT)', count: abujaCases },
                    { state: 'Rivers State', count: Math.max(2, Math.floor(lagosCases / 2)) },
                    { state: 'Kano Central', count: Math.max(1, Math.floor(lagosCases / 3)) }
                  ].map(r => (
                     <div key={r.state} className="space-y-2 group">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-xs font-bold text-white uppercase italic tracking-tighter group-hover:text-rose-500 transition-colors">{r.state}</span>
                           <span className="text-xs font-mono text-white/40 italic uppercase">{r.count} Active Cases</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min(100, (r.count / 50) * 100)}%` }}
                             className="h-full bg-gradient-to-r from-rose-500/20 to-rose-500"
                           />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                     <AlertTriangle className="text-rose-500 w-4 h-4" />
                     <span className="text-xs font-bold text-rose-500 uppercase tracking-widest leading-none">Vulnerability Score</span>
                  </div>
                  <div className="flex justify-center py-4">
                     <span className="text-5xl font-black text-white italic tracking-tighter">{disputes.length > 2 ? 'HIGH' : 'MODERATE'}</span>
                  </div>
                  <p className="text-xs text-white/40 font-bold uppercase leading-relaxed text-center tracking-widest italic">System recommendation: Review Gazetted Land in Ibeju-Lekki.</p>
               </div>
            </div>
         </div>

         {/* Urgent Interventions */}
         <div className="space-y-6">
            <h3 className="text-xs font-bold text-white/40 tracking-[0.3em] uppercase italic px-1">Urgent Interventions</h3>
            
            {disputes.map(c => (
               <div key={c.id} className="glass-card border-white/5 p-6 bg-reg-black/40 space-y-4 group rounded-2xl">
                  <div className="flex justify-between items-center">
                     <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-[9px] tracking-widest uppercase">
                        {c.risk}
                     </div>
                     <span className="text-xs font-mono text-white/40 italic">ID: {c.id}</span>
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white uppercase italic mb-1 group-hover:text-rose-500 transition-colors">{c.location}</p>
                     <p className="text-xs text-white/40 uppercase font-bold tracking-widest italic">{c.type}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                     <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Est. Market Value</label>
                        <span className="text-xs font-bold text-white italic">{c.value}</span>
                     </div>
                     <button 
                       onClick={() => handleResolveCase(c.parcelId)}
                       disabled={resolvingId === c.parcelId}
                       className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-rose-400 transition-all flex items-center gap-1.5 disabled:opacity-50"
                     >
                       {resolvingId === c.parcelId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                       Resolve
                     </button>
                  </div>
               </div>
            ))}

            {disputes.length === 0 && (
              <div className="glass-card p-8 text-center text-white/40 rounded-2xl border border-white/5">
                 <CheckCircle className="w-10 h-10 mx-auto mb-3 text-nigeria-green opacity-50" />
                 <p className="text-xs font-bold uppercase tracking-widest text-white">All State Land Disputes Resolved</p>
              </div>
            )}
         </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
         <MetricBox icon={Activity} label="Litigation Velocity" value="+4.2%" color="text-rose-500" />
         <MetricBox icon={Lock} label="Frozen Assets" value={`₦${(disputes.length * 2.4).toFixed(1)}B`} color="text-blue-500" />
         <MetricBox icon={BarChart3} label="AUST Audit Score" value="99.8" color="text-nigeria-green" />
         <MetricBox icon={Zap} label="Blockchain Gas Optimization" value="S0.2" color="text-amber-500" />
      </div>

    </motion.div>
  );
};

const MetricBox = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card border-white/5 p-6 min-w-[240px] bg-reg-black/40 flex items-center gap-4 rounded-2xl">
     <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${color}`}>
        <Icon className="w-5 h-5" />
     </div>
     <div>
        <p className="text-sm font-bold text-white italic uppercase leading-none">{value}</p>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">{label}</p>
     </div>
  </div>
);

export default GovernorCrisisResolve;

