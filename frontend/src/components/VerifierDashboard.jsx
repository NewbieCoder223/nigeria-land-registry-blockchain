import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  Search,
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

const VerifierDashboard = ({ showToast }) => {
  const { address, isConnected } = useAccount()
  const [processingId, setProcessingId] = useState(null)
  const [auditQueue, setAuditQueue] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // Fetch transfers that have passed Surveyor but not Verifier
    const { data: transfers, error } = await supabase
      .from('transfers')
      .select('*, parcels (*)')
      .eq('status', 'SurveyorVerified')
      .eq('verifier_approved', false);

    if (!error && transfers) {
      setAuditQueue(transfers);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('verifier-updates')
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

  const handleValidate = async (parcelId) => {
    if (!isConnected) return showToast('Please connect your sovereign wallet');
    setProcessingId(parcelId)
    try {
      const submittedHash = await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'validateLegal',
        args: [BigInt(parcelId)],
      })
      if (submittedHash) {
        setTxHash(submittedHash)
      }
    } catch (err) {
      console.error(err)
      setProcessingId(null)
      showToast('Validation transaction rejected')
    }
  }

  useEffect(() => {
    if (isConfirmed && processingId) {
      supabase.table('transfers').update({ verifier_approved: true, status: 'LegallyValidated' }).eq('parcel_id', processingId).then(() => {});
      setAuditQueue(prev => prev.filter(r => (r.parcel_id || r.parcelId) !== processingId))
      setProcessingId(null)
      setTxHash(null)
      showToast('Legal compliance attested successfully')
    }
  }, [isConfirmed, processingId])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end border-b-0.5 border-white/5 pb-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border-0.5 border-amber-500/30 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4">
              Protocol: LEGAL_VALIDATION_UNIT
           </div>
           <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">
             Legal <span className="text-white/40">Verifier</span>
           </h2>
           <p className="text-sm text-white/40 font-medium uppercase tracking-widest mt-1 italic underline decoration-amber-500/20 underline-offset-8">
             Statutory Document Compliance
           </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => showToast('Searching Federal Land Gazette: IPFS Node Sync Active')}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 border-0.5 border-white/10 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all"
           >
              <Search className="w-3.5 h-3.5" />
              Search Gazette
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Metric Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <MetricCard label="Pending Audits" value={auditQueue.length} icon={Clock} color="text-amber-500" />
           <MetricCard label="Accuracy Rating" value="100%" icon={ShieldCheck} color="text-nigeria-green" />
           <div className="glass-card p-6 bg-amber-500/5 border-amber-500/10">
              <div className="flex items-center gap-3 mb-3">
                 <AlertCircle className="w-4 h-4 text-amber-500" />
                 <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Compliance Alert</h4>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tighter">
                Ensure all IPFS-linked deeds are cross-referenced with the Federal Housing Authority database before final validation.
              </p>
           </div>
        </div>

        {/* Audit Queue */}
        <div className="lg:col-span-3 space-y-6">
           <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] px-4">Legislative Queue</h3>
           <div className="space-y-4">
              {auditQueue.map((audit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 group relative overflow-hidden"
                >
                  <div className="flex-1 flex justify-between items-center w-full px-4 text-xs font-mono">
                    <span className="text-white/40">#{audit.parcel_id}</span>
                    <div className="flex flex-col">
                       <p className="font-bold text-white uppercase italic">{audit.from_address.slice(0,10)}...</p>
                       <span className="text-[8px] text-white/20 uppercase tracking-widest">Title-Holder</span>
                    </div>
                    <span className="text-white/60">{audit.to_address.slice(0,10)}...</span>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                        LOW RISK
                    </div>
                    <button 
                       onClick={() => handleValidate(audit.parcel_id)}
                       disabled={processingId === audit.parcel_id || isSigning || isMinting}
                       className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 border-0.5 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                        {(processingId === audit.parcel_id && (isSigning || isMinting)) ? (
                           <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                           <>
                              <FileCheck className="w-3 h-3" />
                              Attest Compliance
                           </>
                        )}
                    </button>
                  </div>
                   
                   {/* Background Decorative Element */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all rounded-full" />
                </motion.div>
              ))}

              {auditQueue.length === 0 && (
                <div className="text-center py-20 grayscale opacity-20">
                   <Scale className="w-12 h-12 mx-auto mb-4" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em]">All Legal Audits Cleared</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass-card p-6 flex items-center justify-between">
     <div className="space-y-1">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white italic">{value}</p>
     </div>
     <div className="p-3 bg-white/5 rounded-xl border-b-2 border-white/10">
        <Icon className={`w-5 h-5 ${color}`} />
     </div>
  </div>
)

export default VerifierDashboard
