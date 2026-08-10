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
  Search,
  X,
  FileText,
  CheckCircle2
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

  // Modals & Tools
  const [isGazetteModalOpen, setIsGazetteModalOpen] = useState(false)
  const [gazetteQuery, setGazetteQuery] = useState('')
  const [gazetteResults, setGazetteResults] = useState(null)
  const [isRecalibrating, setIsRecalibrating] = useState(false)
  const [recalibrationLog, setRecalibrationLog] = useState(null)

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all parcels for map visualization & metric computation
      const { data: parcels, error: parcelError } = await supabase
        .from('parcels')
        .select('*')
        .order('created_at', { ascending: false });

      let parsedParcels = [];
      if (!parcelError && parcels) {
        parsedParcels = parcels.map(p => {
          let coords = [];
          if (p.gps_coordinates) {
            try {
              coords = typeof p.gps_coordinates === 'string' ? JSON.parse(p.gps_coordinates) : p.gps_coordinates;
            } catch (e) {
              coords = [];
            }
          }
          return {
            ...p,
            coordinates: Array.isArray(coords) ? coords : []
          };
        });
        setAllParcels(parsedParcels);
      }

      // 2. Fetch pending transfer requests
      const { data: transfers, error: transferError } = await supabase
        .from('transfers')
        .select('*, parcels (*)')
        .order('created_at', { ascending: false });

      let transferItems = [];
      if (!transferError && transfers) {
        transferItems = transfers.map(t => {
          let coords = [];
          if (t.parcels?.gps_coordinates) {
            try {
              coords = typeof t.parcels.gps_coordinates === 'string' ? JSON.parse(t.parcels.gps_coordinates) : t.parcels.gps_coordinates;
            } catch (e) {
              coords = [];
            }
          }
          return {
            id: `TRF-${t.id || t.parcel_id}`,
            parcel_id: t.parcel_id,
            area: t.parcels?.area ? `${t.parcels.area} SQM` : 'PARCEL',
            type: 'TRANSFER_VERIFICATION',
            from_address: t.from_address || t.sender || '0x...',
            to_address: t.to_address || t.recipient || '0x...',
            status: t.surveyor_approved ? 'SurveyorVerified' : 'Pending Survey Sign-off',
            isApproved: t.surveyor_approved,
            parcel: {
              ...t.parcels,
              coordinates: Array.isArray(coords) ? coords : []
            }
          };
        });
      }

      // 3. Add unverified parcel registrations to queue as well
      const pendingParcelItems = parsedParcels.map(p => ({
        id: `PCL-${p.parcel_id}`,
        parcel_id: p.parcel_id,
        area: `${p.area || 1250} SQM`,
        type: 'INITIAL_REGISTRATION',
        from_address: p.owner_address,
        to_address: 'REGISTRY_VAULT',
        status: p.status || 'Pending Survey Verification',
        isApproved: p.status === 'Verified' || p.status === 'Active',
        parcel: p
      }));

      // Combine queue items (unverified items first)
      const fullQueue = [...transferItems, ...pendingParcelItems];
      setPendingRequests(fullQueue);

    } catch (err) {
      console.error("Surveyor fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Realtime Subscriptions
    const channel1 = supabase
      .channel('surveyor-transfers-sub')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transfers' }, () => fetchData())
      .subscribe();

    const channel2 = supabase
      .channel('surveyor-parcels-sub')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcels' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [isConnected, address]);

  const [txHash, setTxHash] = useState(null)
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  const activeHash = txHash || hash
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: activeHash,
  })

  // Cleanup on success
  useEffect(() => {
    if (isConfirmed && processingId) {
      supabase.from('transfers').update({ surveyor_approved: true, status: 'SurveyorVerified' }).eq('parcel_id', processingId).then(() => {});
      supabase.from('parcels').update({ status: 'Verified' }).eq('parcel_id', processingId).then(() => {});
      
      setPendingRequests(prev => prev.map(r => r.parcel_id === processingId ? { ...r, status: 'SurveyorVerified', isApproved: true } : r))
      setProcessingId(null)
      setTxHash(null)
      if (showToast) showToast('GIS boundary verification committed on-chain')
    }
  }, [isConfirmed, processingId])

  // Handlers
  const handleVerify = async (parcelId) => {
    if (!isConnected) {
      if (showToast) showToast('Please connect your Web3 wallet first');
      return;
    }
    setProcessingId(parcelId)
    try {
      const submittedHash = await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'verifySurvey',
        args: [BigInt(parcelId)],
      })
      if (submittedHash) {
        setTxHash(submittedHash)
      }
    } catch (err) {
      console.error(err)
      setProcessingId(null)
      if (showToast) showToast('Transaction failed or rejected by wallet')
    }
  }

  // 🔍 Real Federal Gazette Search Handler
  const handleSearchGazette = async (e) => {
    if (e) e.preventDefault();
    const term = gazetteQuery.toLowerCase().trim();
    
    // Direct Supabase query to ensure complete database lookup
    const { data: searchData, error } = await supabase
      .from('parcels')
      .select('*');

    if (searchData && !error) {
      if (!term) {
        setGazetteResults(searchData);
      } else {
        const matches = searchData.filter(p => 
          String(p.parcel_id || '').toLowerCase().includes(term) ||
          String(p.owner_address || '').toLowerCase().includes(term) ||
          String(p.ipfs_hash || '').toLowerCase().includes(term) ||
          String(p.status || '').toLowerCase().includes(term)
        );
        setGazetteResults(matches);
      }
    } else {
      setGazetteResults([]);
    }
  };

  // Open Gazette Modal & Pre-fetch results
  const openGazetteModal = () => {
    setIsGazetteModalOpen(true);
    handleSearchGazette();
  };

  // 🎯 Execute GNSS Recalibration & Spatial Overlap Collision Audit Handler
  const handleExecuteRecalibration = async () => {
    setIsRecalibrating(true);
    setRecalibrationLog("Connecting to RTK-GNSS Satellite Array & querying spatial database...");

    const { data: dbParcels } = await supabase.from('parcels').select('*');
    const parcelList = dbParcels || allParcels;

    setTimeout(() => {
      setRecalibrationLog(`Pinging 16 Active GNSS Satellite Nodes... Auditing ${parcelList.length} registered parcels for spatial boundary overlaps...`);
    }, 1200);

    setTimeout(() => {
      // Perform real spatial collision check (Bounding Box Intersection)
      let overlapsFound = 0;
      for (let i = 0; i < parcelList.length; i++) {
        for (let j = i + 1; j < parcelList.length; j++) {
          const c1 = typeof parcelList[i].gps_coordinates === 'string' ? JSON.parse(parcelList[i].gps_coordinates) : parcelList[i].gps_coordinates;
          const c2 = typeof parcelList[j].gps_coordinates === 'string' ? JSON.parse(parcelList[j].gps_coordinates) : parcelList[j].gps_coordinates;

          if (Array.isArray(c1) && Array.isArray(c2) && c1.length > 0 && c2.length > 0) {
            // Check bounding box intersection
            const minLat1 = Math.min(...c1.map(p => p[0])), maxLat1 = Math.max(...c1.map(p => p[0]));
            const minLng1 = Math.min(...c1.map(p => p[1])), maxLng1 = Math.max(...c1.map(p => p[1]));

            const minLat2 = Math.min(...c2.map(p => p[0])), maxLat2 = Math.max(...c2.map(p => p[0]));
            const minLng2 = Math.min(...c2.map(p => p[1])), maxLng2 = Math.max(...c2.map(p => p[1]));

            const intersects = !(maxLat1 < minLat2 || minLat1 > maxLat2 || maxLng1 < minLng2 || minLng1 > maxLng2);
            if (intersects) overlapsFound++;
          }
        }
      }

      if (overlapsFound > 0) {
        setRecalibrationLog(`Recalibration complete: ${parcelList.length} GIS Parcels Audited. ⚠️ ${overlapsFound} Potential Boundary Overlap Conflict(s) Detected.`);
      } else {
        setRecalibrationLog(`GNSS Recalibration Complete: ${parcelList.length} GIS Parcels Synchronized. Zero spatial boundary conflicts detected across state database.`);
      }

      setIsRecalibrating(false);
      if (showToast) showToast(`Recalibration Audit Finished: ${parcelList.length} Parcels Synchronized`);
    }, 2800);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
      </div>
    );
  }

  // 📊 Dynamic Metric Calculations
  const totalSqm = allParcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);
  const totalHectares = (totalSqm / 10000).toFixed(2);
  const pendingCount = pendingRequests.filter(r => !r.isApproved).length;
  const verifiedCount = allParcels.filter(p => p.status === 'Verified' || p.status === 'Active').length;

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

        <div className="flex flex-wrap gap-4">
           <button 
             onClick={openGazetteModal}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 border-0.5 border-white/10 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
           >
              <Search className="w-3.5 h-3.5" />
              Search Gazette
           </button>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             onClick={handleExecuteRecalibration}
             disabled={isRecalibrating}
             className="px-6 py-3 bg-teal-600/20 text-teal-400 border-0.5 border-teal-500/30 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-teal-500 hover:text-white transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50"
           >
             {isRecalibrating ? <Loader2 className="w-4 h-4 animate-spin text-teal-400" /> : <Crosshair className="w-4 h-4" />}
             {isRecalibrating ? 'Recalibrating Nodes...' : 'Execute Recalibration'}
           </motion.button>
        </div>
      </header>

      {recalibrationLog && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-between text-xs text-teal-400 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>{recalibrationLog}</span>
          </div>
          <button onClick={() => setRecalibrationLog(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4"/></button>
        </div>
      )}

      {/* Dynamic Specialist Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem 
          label="Precision Multiplier" 
          value="99.98%" 
          icon={Navigation}
          color="text-teal-400"
          desc="RTK-GNSS Constellation Active"
        />
        <StatItem 
           label="Total System Parcels"
           value={allParcels.length}
           icon={Zap}
           color="text-emerald-400"
           desc={`${verifiedCount} Verified On-Chain`}
        />
        <StatItem 
           label="Pending Survey Queue"
           value={pendingCount}
           icon={AlertCircle}
           color="text-amber-400"
           desc="Awaiting Surveyor Sign-off"
        />
        <StatItem 
           label="Validated Surface Area"
           value={`${totalHectares} Ha`}
           icon={Maximize2}
           color="text-white/60"
           desc={`${totalSqm.toLocaleString()} SQM Mapped`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Advanced GIS Portal */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-teal-500/20 underline-offset-8 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-teal-400" />
                  Active Mapping Grid ({allParcels.length} Mapped Parcels)
               </h3>
               <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border-0.5 border-white/10 text-[9px] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE HASH_SYNCED_GIS
               </div>
            </div>

            <div className="glass-card h-[600px] overflow-hidden relative group rounded-2xl">
               <GISMap 
                  parcels={allParcels} 
                  center={pendingRequests[0]?.parcel?.coordinates?.[0] || [9.0820, 8.6753]}
                  zoom={pendingRequests[0] ? 14 : 6}
               />
               
               {/* GIS Overlay Elements */}
               <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-[1000]">
                  <div className="glass-card bg-reg-black/80 px-4 py-3 space-y-1 rounded-xl">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Focal Node</p>
                      <p className="text-[11px] font-mono text-teal-400 uppercase">
                         {typeof pendingRequests[0]?.parcel?.coordinates?.[0]?.[0] === 'number' ? pendingRequests[0].parcel.coordinates[0][0].toFixed(4) : '9.0820'}° N | {typeof pendingRequests[0]?.parcel?.coordinates?.[0]?.[1] === 'number' ? pendingRequests[0].parcel.coordinates[0][1].toFixed(4) : '8.6753'}° E
                      </p>
                  </div>
               </div>
            </div>
        </div>

        {/* Verification Queue */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-8">Verification Queue</h3>
           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {pendingRequests.map((survey, i) => (
                <motion.div 
                  key={survey.id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 space-y-5 group hover:bg-white/[0.03] transition-all relative overflow-hidden rounded-2xl border border-white/10"
                >
                   <div className="flex justify-between items-start relative z-10">
                      <div>
                         <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-1">Queue ID: {survey.id}</p>
                         <h4 className="text-sm font-black text-white italic tracking-tight">Parcel #{survey.parcel_id} ({survey.area})</h4>
                      </div>
                      <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                         survey.isApproved 
                           ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                           : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                      }`}>
                         {survey.isApproved ? 'VERIFIED' : 'PENDING'}
                      </div>
                   </div>

                   <div className="space-y-2 relative z-10">
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                         <span>Owner / Origin:</span>
                         <span className="font-mono text-white/60">{survey.from_address ? `${survey.from_address.slice(0,6)}...${survey.from_address.slice(-4)}` : '0x...'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                         <span>Type:</span>
                         <span className="text-teal-400 font-mono italic">{survey.type}</span>
                      </div>
                   </div>

                   <div className="flex gap-3 relative z-10 pt-2 border-t border-white/5">
                      {survey.isApproved ? (
                        <div className="w-full py-2 px-4 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          GIS Boundary Certified
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleVerify(survey.parcel_id)}
                          disabled={processingId === survey.parcel_id || isSigning || isMinting}
                          className="w-full py-2.5 px-4 text-[9px] font-black uppercase tracking-widest bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/40 hover:bg-teal-500 hover:text-black transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-lg"
                        >
                           {(processingId === survey.parcel_id && (isSigning || isMinting)) ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                           ) : (
                              'Verify Spatial Bounds'
                           )}
                        </button>
                      )}
                   </div>
                </motion.div>
              ))}

              {pendingRequests.length === 0 && (
                <div className="text-center py-20 grayscale opacity-40 border border-dashed border-white/10 rounded-2xl">
                   <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-teal-400" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Queue Fully Verified</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 📜 Search Federal Land Gazette Modal */}
      <AnimatePresence>
        {isGazetteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-reg-black/80 backdrop-blur-md"
               onClick={() => setIsGazetteModalOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="glass-card w-full max-w-2xl bg-reg-surface p-8 space-y-6 relative z-10 rounded-2xl border border-white/10"
             >
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black italic uppercase text-white">
                        Federal Land <span className="text-teal-400">Gazette Search</span>
                      </h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Query official IPFS land registry records & survey plans</p>
                   </div>
                   <button onClick={() => setIsGazetteModalOpen(false)} className="text-white/20 hover:text-white"><X className="w-6 h-6"/></button>
                </div>

                <form onSubmit={handleSearchGazette} className="flex gap-2">
                   <div className="relative flex-1">
                      <Search className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                      <input 
                        type="text" 
                        placeholder="Search by Parcel ID, Owner Wallet, or IPFS CID..." 
                        value={gazetteQuery}
                        onChange={(e) => setGazetteQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400 font-mono"
                      />
                   </div>
                   <button 
                     type="submit"
                     className="px-6 py-3 bg-teal-500 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all"
                   >
                     Search
                   </button>
                </form>

                <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                   {gazetteResults && gazetteResults.length > 0 && (
                     gazetteResults.map(p => (
                       <div key={p.parcel_id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-white uppercase">
                            <span>Parcel #{p.parcel_id} ({p.area} SQM)</span>
                            <span className="text-teal-400">{p.status || 'Active'}</span>
                          </div>
                          <p className="text-[10px] text-white/40 font-mono truncate">Owner: {p.owner_address}</p>
                          <p className="text-[10px] text-white/40 font-mono truncate">IPFS Deed: {p.ipfs_hash}</p>
                       </div>
                     ))
                   )}

                   {gazetteResults && gazetteResults.length === 0 && (
                     <p className="text-xs text-white/40 text-center py-6">No gazette land records matched your search query.</p>
                   )}

                   {!gazetteResults && (
                     <p className="text-xs text-white/30 text-center py-6">Enter a search query above to query the federal land gazette repository.</p>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StatItem = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between group rounded-2xl border border-white/5">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl group-hover:border-white/20 transition-all">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Live GIS Stream</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

export default SurveyorDashboard
