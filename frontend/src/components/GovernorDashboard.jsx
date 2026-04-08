import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, 
  Activity, 
  Globe, 
  Database,
  Search,
  Scale,
  Zap,
  Lock,
  Gavel,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi'
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry'
import { supabase } from '../lib/supabase'

const GovernorDashboard = ({ showToast }) => {
  const { address, isConnected } = useAccount()
  const [processingId, setProcessingId] = useState(null)
  const [disputes, setDisputes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ hectares: 0, disputes: 0, health: '99.9%' })

  const fetchData = async () => {
    if (!isConnected || !address) {
      setIsLoading(false);
      setProcessingId(null);
      return;
    }
    setIsLoading(true);

    // 1. Fetch disputed parcels
    const { data: disputedParcels, error } = await supabase
      .from('parcels')
      .select('*')
      .eq('status', 'Disputed');

    if (!error && disputedParcels) {
      setDisputes(disputedParcels);
    }

    // 2. Fetch global metrics
    const { data: allParcels } = await supabase.from('parcels').select('area');
    const totalArea = allParcels?.reduce((sum, p) => sum + (parseFloat(p.area) || 0), 0) || 0;
    
    setStats({
      hectares: (totalArea / 10000).toFixed(1) + 'M', // Mocking M suffix for aesthetic
      disputes: disputedParcels?.length || 0,
      health: 'Live'
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    // ⚡ Realtime for disputes
    const channel = supabase
      .channel('governor-disputes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcels', filter: 'status=eq.Disputed' }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isConnected, address]);

  // 2. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  // 3. Transaction Monitor
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      setProcessingId(null)
    }
  }, [isConfirmed])

  const handleResolve = async (pId, isValid) => {
    setProcessingId(pId)
    try {
      await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'resolveDispute',
        args: [BigInt(pId), isValid],
      })
    } catch (err) {
      console.error(err)
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-full text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-4">
             Authority Level: HIGH_SOVEREIGN
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Command <span className="text-white/40">Center</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">National Land Governance Oversight</p>
        </motion.div>

        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             onClick={() => showToast('Emergency System Freeze Protocol: Authenticating Authority')}
             className="px-6 py-3 bg-rose-600/20 text-rose-500 border-0.5 border-rose-500/30 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-900/20"
           >
             <Lock className="w-4 h-4" />
             Emergency System Freeze
           </motion.button>
        </div>
      </header>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GovStatCard 
          label="Sovereign Hectares" 
          value={stats.hectares} 
          icon={Globe}
          status="Secured"
          color="text-nigeria-green"
          trend="+Blockchain Verified"
        />
        <StatItem 
           label="Active Disputes"
           value={stats.disputes}
           icon={ShieldAlert}
           color="text-rose-500"
           desc="Issues requiring ruling"
        />
        <StatItem 
           label="Node Health"
           value={stats.health}
           icon={Zap}
           color="text-emerald-400"
           desc="Polygon Sync: Active"
        />
        <StatItem 
           label="Registry v4.1"
           value="Online"
           icon={Activity}
           color="text-white/60"
           desc="Protocol stable"
        />
      </div>

      {/* Main Grid: Resolution Queue & Map Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Dispute Resolution Queue */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-rose-500/20 underline-offset-8 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-rose-500" />
                  Resolution Queue
               </h3>
            </div>

            <div className="glass-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02] border-b-0.5 border-white/5 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4 font-bold">Parcel ID</th>
                        <th className="px-8 py-4 font-bold">Involved Entity</th>
                        <th className="px-8 py-4 font-bold">Governance Issue</th>
                        <th className="px-8 py-4 font-bold">Territory</th>
                        <th className="px-8 py-4 font-bold text-center">Final Ruling</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs text-white/80">
                     {disputes.map((dispute, idx) => (
                       <tr key={idx} className="group border-b-0.5 border-white/5 hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <span className="font-mono text-nigeria-green uppercase">#{dispute.parcel_id}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="font-mono text-white/40">{dispute.owner_address.slice(0,10)}...</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="font-bold text-white/80">Boundary / Title Dispute</p>
                                <div className="flex items-center gap-2">
                                   <div className="w-1 h-1 rounded-full bg-rose-500" />
                                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20">HIGH PRIORITY</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-white/40 font-bold uppercase tracking-widest">NIGERIA</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex justify-center gap-3">
                                <button 
                                  onClick={() => handleResolve(dispute.parcel_id, true)}
                                  disabled={processingId === dispute.parcel_id || isSigning || isMinting}
                                  className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border-0.5 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
                                  title="Uphold Claim"
                                >
                                   { (processingId === dispute.parcel_id && (isSigning || isMinting)) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" /> }
                                </button>
                                <button 
                                  onClick={() => handleResolve(dispute.parcel_id, false)}
                                  disabled={processingId === dispute.parcel_id || isSigning || isMinting}
                                  className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border-0.5 border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-30"
                                  title="Dismiss Claim"
                                >
                                   <XCircle className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               
               {disputes.length === 0 && (
                <div className="text-center py-20 grayscale opacity-20 flex flex-col items-center">
                   <Gavel className="w-12 h-12 mb-4" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Judicial Queue Sanitized</p>
                </div>
               )}
            </div>
         </div>

         {/* Territory Overview Side Widget */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-8">Territory Pulse</h3>
            <div className="glass-card p-8 space-y-8">
               <TerritoryItem region="Lagos" status="Active" color="bg-emerald-500" value={84} showToast={showToast} />
               <TerritoryItem region="Federal Capital Territory" status="Congested" color="bg-amber-500" value={62} showToast={showToast} />
               <TerritoryItem region="Rivers State" status="Active" color="bg-emerald-500" value={41} showToast={showToast} />
               
               <div className="pt-4 border-t-0.5 border-white/5">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-center">Protocol Level: Sovereign_Root_4</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

const GovStatCard = ({ label, value, icon: Icon, status, color, trend }) => (
  <div className="glass-card p-8 group relative overflow-hidden">
     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
        <Icon className="w-20 h-20 text-white" />
     </div>
     <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
           <div className="px-3 py-1 bg-white/5 border-0.5 border-white/10 rounded-full text-[9px] font-bold text-white/40 uppercase tracking-widest">{status}</div>
           <span className="text-[8px] font-bold text-nigeria-green uppercase tracking-[0.2em]">{trend}</span>
        </div>
        <div className="space-y-1">
           <span className={`text-4xl font-black italic tracking-tighter block ${color}`}>{value}</span>
           <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] font-mono">{label}</p>
        </div>
     </div>
  </div>
)

const StatItem = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl group-hover:border-white/20 transition-all">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Sovereign Meta v4.1</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

const TerritoryItem = ({ region, status, color, value }) => (
  <div className="space-y-3">
     <div className="flex justify-between items-end">
        <div className="space-y-1">
           <p className="text-[10px] font-bold text-white uppercase tracking-tight">{region}</p>
           <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{status}</span>
           </div>
        </div>
        <span className="text-xs font-mono text-white/60">{value}%</span>
     </div>
     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${value}%` }}
           className={`h-full ${color} opacity-60`}
        />
     </div>
  </div>
)

export default GovernorDashboard
