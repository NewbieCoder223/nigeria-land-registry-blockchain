import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileSignature, 
  BookOpen, 
  ShieldCheck, 
  History,
  Zap,
  PenTool,
  CheckCircle2,
  AlertCircle,
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

const RegistrarDashboard = ({ showToast }) => {
  const { address, isConnected } = useAccount()
  const [processingId, setProcessingId] = useState(null)
  const [pendingDeeds, setPendingDeeds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [counts, setCounts] = useState({ issued: 0, rofo: 0, transfers: 0 })

  const fetchData = async () => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // 1. Fetch pending deeds (Legally validated but not registrar approved)
    const { data: transfers, error } = await supabase
      .from('transfers')
      .select('*, parcels (*)')
      .eq('status', 'LegallyValidated')
      .eq('registrar_approved', false);

    if (!error && transfers) {
      setPendingDeeds(transfers);
    }

    // 2. Fetch stats for summary boxes (Approximation for prototype)
    const { count: issuedCount } = await supabase.from('parcels').select('*', { count: 'exact', head: true });
    const { count: transferCount } = await supabase.from('transfers').select('*', { count: 'exact', head: true }).eq('status', 'Completed');
    
    setCounts({
      issued: issuedCount || 0,
      rofo: Math.floor((issuedCount || 0) * 0.7), // Mock split
      transfers: transferCount || 0
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('registrar-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transfers' }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isConnected, address]);

  const [txHash, setTxHash] = useState(null)

  // 2. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  // 3. Transaction Monitor
  const activeHash = txHash || hash
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: activeHash,
  })

  const handleApprove = async (parcelId) => {
    setProcessingId(parcelId)
    try {
      const submittedHash = await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'approveTransfer',
        args: [BigInt(parcelId)],
      })
      if (submittedHash) {
        setTxHash(submittedHash)
      }
    } catch (err) {
      console.error(err)
      setProcessingId(null) // Unfreeze UI
    }
  }

  useEffect(() => {
    if (isConfirmed && processingId) {
      supabase.table('transfers').update({ registrar_approved: true, status: 'Completed' }).eq('parcel_id', processingId).then(() => {});
      supabase.table('parcels').update({ status: 'Active' }).eq('parcel_id', processingId).then(() => {});
      setPendingDeeds(prev => prev.filter(r => (r.parcel_id || r.parcelId) !== processingId))
      setProcessingId(null)
      setTxHash(null)
      showToast('Title Deed & Ownership Transfer finalized on-chain')
    }
  }, [isConfirmed, processingId])

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-accent/10 border-0.5 border-gold-accent/30 rounded-full text-[10px] font-bold text-gold-accent uppercase tracking-widest mb-4">
              Authority Level: REGISTRY_OFFICIAL
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Registrar <span className="text-white/40">Portal</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Official Title Deeds & Ledger Maintenance</p>
        </motion.div>

        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.02 }} 
             onClick={() => showToast('Regulating Registry Protocol: Synchronizing Ledger v4.1')}
             className="px-6 py-3 bg-gold-accent/10 text-gold-accent border-0.5 border-gold-accent/30 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gold-accent hover:text-white transition-all shadow-lg shadow-gold-accent/20"
           >
              <PenTool className="w-4 h-4" />
              Regulate Protocol
           </motion.button>
        </div>
      </header>

      {/* Registrar Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="Deeds Minted" value="12.8k" icon={CheckCircle2} color="text-gold-accent" desc="On-chain records" />
        <StatItem label="Pending Signatures" value={pendingDeeds.length} icon={FileSignature} color="text-amber-500" desc="Awaiting official seal" />
        <StatItem label="Ledger Sync" value="Live" icon={Zap} color="text-emerald-400" desc="Polygon mainnet connected" />
        <StatItem label="Registry Health" value="Stable" icon={ShieldCheck} color="text-white/60" desc="Protocol v4.1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Pending Deeds Queue */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-gold-accent/20 underline-offset-8 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-gold-accent" />
               Final Approval Queue
            </h3>
            <div className="glass-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02] border-b-0.5 border-white/5 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4 font-bold">Parcel Index</th>
                        <th className="px-8 py-4 font-bold">Property Owner</th>
                        <th className="px-8 py-4 font-bold">Title Type</th>
                        <th className="px-8 py-4 font-bold">Status</th>
                        <th className="px-8 py-4 font-bold">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs text-white/80">
                     {pendingDeeds.map((deed, idx) => (
                       <tr key={idx} className="group border-b-0.5 border-white/5 hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6 font-mono text-white/40">#{deed.parcel_id}</td>
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="font-bold text-white uppercase italic">{deed.parcels?.owner_address.slice(0,10)}...</p>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest">{deed.parcels?.area} SQM</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-2 py-1 bg-white/5 border-0.5 border-white/10 rounded text-[9px] font-bold text-white/60 uppercase tracking-widest">C_of_O</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="inline-flex items-center gap-2 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                                COMPLIANCE_MET
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => handleApprove(deed.parcel_id)}
                                  disabled={processingId === deed.parcel_id || isSigning || isMinting}
                                  className="px-4 py-2 rounded-lg bg-gold-accent/10 text-gold-accent border-0.5 border-gold-accent/20 hover:bg-gold-accent hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30"
                                >
                                   {(processingId === deed.parcel_id && (isSigning || isMinting)) ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                   ) : (
                                      <>
                                          <PenTool className="w-3 h-3" />
                                          Sign & Finalize
                                      </>
                                   )}
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               
               {pendingDeeds.length === 0 && (
                <div className="text-center py-20 grayscale opacity-20 flex flex-col items-center">
                   <ShieldCheck className="w-12 h-12 mb-4" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em]">All Titles Minted & Synchronized</p>
                </div>
               )}
            </div>
         </div>

         {/* Official Ledger Summary */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-8">Official Ledger</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Registry Stats Summary</p>
                  <SummaryItem label="Total C_of_O Issued" value={counts.issued} />
                  <SummaryItem label="Total R_of_O Issued" value={counts.rofo} />
                  <SummaryItem label="Transfers Recorded" value={counts.transfers} />
               </div>
               
               <div className="pt-4 border-t-0.5 border-white/5 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-gold-accent/40">
                     <ShieldCheck className="w-4 h-4" />
                     <p className="text-[9px] font-black uppercase tracking-[0.2em]">Validated by Sovereign Root</p>
                  </div>
                   <button 
                     onClick={() => showToast('Fetching Sovereign Archive: Decrypting Genesis Block Records')}
                     className="w-full py-4 glass-card bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                   >
                      View Full Archive
                   </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}

const SummaryItem = ({ label, value }) => (
  <div className="flex items-center justify-between pb-3 border-b-0.5 border-white/5">
    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-white italic tracking-tighter">{value}</span>
  </div>
)

const StatItem = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl group-hover:border-white/20 transition-all">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Registry Meta v4.1</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

export default RegistrarDashboard
