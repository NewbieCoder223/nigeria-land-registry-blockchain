import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map as MapIcon, 
  Crosshair, 
  ShieldCheck, 
  AlertCircle,
  Maximize2,
  Layers,
  Zap,
  Navigation,
  Loader2,
  Search
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi'
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry'
import { supabase } from '../lib/supabase'
import GISMap from './Map/GISMap'

const SurveyorDashboard = ({ showToast }) => {
  const { address, isConnected } = useAccount()
  const [processingId, setProcessingId] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [allParcels, setAllParcels] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    // 1. Fetch pending transfers for survey verification
    const { data: transfers, error: transferError } = await supabase
      .from('transfers')
      .select(`
        *,
        parcels (*)
      `)
      .eq('surveyor_approved', false)
      .eq('status', 'Initiated');

    if (!transferError && transfers) {
      setPendingRequests(transfers.map(t => ({
        ...t,
        parcel: {
          ...t.parcels,
          coordinates: typeof t.parcels.gps_coordinates === 'string' ? JSON.parse(t.parcels.gps_coordinates) : t.parcels.gps_coordinates
        }
      })));
    }

    // 2. Fetch all parcels for map visualization
    const { data: parcels, error: parcelError } = await supabase
      .from('parcels')
      .select('*');

    if (!parcelError && parcels) {
      setAllParcels(parcels.map(p => ({
        ...p,
        coordinates: typeof p.gps_coordinates === 'string' ? JSON.parse(p.gps_coordinates) : p.gps_coordinates
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    // ⚡ Realtime for transfers
    const channel = supabase
      .channel('surveyor-transfers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transfers' }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isConnected, address]);

  // 2. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  // 3. Transaction Monitor
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Cleanup on success
  useEffect(() => {
    if (isConfirmed) {
      setProcessingId(null)
      showToast('Verification successfully recorded on-chain')
    }
  }, [isConfirmed])

  // Handlers
  const handleVerify = async (parcelId) => {
    if (!isConnected) return showToast('Please connect your wallet first');
    setProcessingId(parcelId)
    try {
      await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'verifySurvey',
        args: [BigInt(parcelId)],
      })
    } catch (err) {
      console.error(err)
      setProcessingId(null)
      showToast('Transaction failed or rejected')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border-0.5 border-teal-500/30 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-4">
             Module: GEOSPATIAL_ANALYSIS_P1
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Surveyor <span className="text-white/40">Portal</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">High-Precision Boundary Verification</p>
        </motion.div>

        <div className="flex gap-4">
           <button 
             onClick={() => showToast('Searching Federal Land Gazette: IPFS Node Sync Active')}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 border-0.5 border-white/10 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all"
           >
              <Search className="w-3.5 h-3.5" />
              Search Gazette
           </button>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             onClick={() => showToast('Initiating RTK-GNSS Satellite Recalibration Sequence')}
             className="px-6 py-3 bg-teal-600/20 text-teal-400 border-0.5 border-teal-500/30 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-teal-500 hover:text-white transition-all shadow-lg shadow-teal-900/20"
           >
             <Crosshair className="w-4 h-4" />
             Execute Recalibration
           </motion.button>
        </div>
      </header>

      {/* Specialist Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem 
          label="Precision Multiplier" 
          value="99.98%" 
          icon={Navigation}
          color="text-teal-400"
          desc="RTK-GNSS Enabled"
        />
        <StatItem 
           label="Processed Parcels"
           value="1,842"
           icon={Zap}
           color="text-emerald-400"
           desc="+42 This cycle"
        />
        <StatItem 
           label="Queue Latency"
           value="3.2h"
           icon={AlertCircle}
           color="text-amber-400"
           desc="Avg verification time"
        />
        <StatItem 
           label="Validated Area"
           value="12.4k"
           icon={Maximize2}
           color="text-white/60"
           desc="Hectares secured"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Advanced GIS Portal */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-teal-500/20 underline-offset-8 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-teal-400" />
                  Active Mapping Grid
               </h3>
               <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border-0.5 border-white/10 text-[9px] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE HASH_SYNCED_GIS
               </div>
            </div>

            <div className="glass-card h-[600px] overflow-hidden relative group">
               <GISMap 
                  parcels={allParcels} 
                  center={pendingRequests[0]?.parcel?.coordinates?.[0] || [9.0820, 8.6753]}
                  zoom={pendingRequests[0] ? 16 : 6}
               />
               
               {/* GIS Overlay Elements */}
               <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-[1000]">
                  <div className="glass-card bg-reg-black/80 px-4 py-3 space-y-1">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Selected Node</p>
                     <p className="text-[11px] font-mono text-teal-400 uppercase">
                        {pendingRequests[0]?.parcel?.coordinates?.[0]?.[0].toFixed(4) || 'N/A'} N | {pendingRequests[0]?.parcel?.coordinates?.[0]?.[1].toFixed(4) || 'N/A'} E
                     </p>
                  </div>
               </div>
            </div>
        </div>

        {/* Verification Queue */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-8">Verification Queue</h3>
           <div className="space-y-4">
              {pendingRequests.map((survey, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 space-y-5 group hover:bg-white/[0.03] transition-all relative overflow-hidden"
                >
                   <div className="flex justify-between items-start relative z-10">
                      <div>
                         <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-1">Queue ID: {survey.id}</p>
                         <h4 className="text-sm font-black text-white italic tracking-tight">{survey.area} CLAIM</h4>
                      </div>
                      <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                         survey.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' :
                         survey.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                         {survey.priority}
                      </div>
                   </div>

                   <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                         <span>Initiator:</span>
                         <span className="font-mono text-white/60">{survey.from_address.slice(0,6)}...{survey.from_address.slice(-4)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                         <span>Recipient:</span>
                         <span className="font-mono text-white/60">{survey.to_address.slice(0,6)}...{survey.to_address.slice(-4)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                         <span>Status:</span>
                         <span className="text-white/60 italic">{survey.status}</span>
                      </div>
                   </div>

                   <div className="flex gap-3 relative z-10">
                      <button 
                        className="flex-1 py-1 px-4 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border-0.5 border-white/5 rounded-lg disabled:opacity-30"
                        disabled={processingId === survey.parcelId}
                      >
                         Deny
                      </button>
                      <button 
                        onClick={() => handleVerify(survey.parcelId)}
                        disabled={processingId === survey.parcelId || isSigning || isMinting}
                        className="flex-1 py-2 px-4 text-[9px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-400 rounded-lg border-0.5 border-teal-500/20 hover:bg-teal-500 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                         {(processingId === survey.parcelId && (isSigning || isMinting)) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                         ) : (
                            'Verify Bounds'
                         )}
                      </button>
                   </div>
                   
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-3xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-teal-500/10" />
                </motion.div>
              ))}

              {pendingRequests.length === 0 && (
                <div className="text-center py-20 grayscale opacity-20">
                   <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Queue Fully Sanitized</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

const StatItem = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl group-hover:border-white/20 transition-all">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Data Stream Alpha</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

export default SurveyorDashboard
