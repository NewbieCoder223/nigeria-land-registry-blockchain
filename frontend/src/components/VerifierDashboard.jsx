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
  Loader2,
  CheckCircle2,
  ListFilter,
  UserCheck
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
  const [verifiedHistory, setVerifiedHistory] = useState([])
  const [activeTab, setActiveTab] = useState('pending') // 'pending' | 'verified'
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch pending transfers that have passed Surveyor but not Verifier
      const { data: transfers } = await supabase
        .from('transfers')
        .select('*, parcels (*)')
        .order('created_at', { ascending: false });

      // 2. Fetch all parcels for initial registration verification
      const { data: parcels } = await supabase
        .from('parcels')
        .select('*')
        .order('created_at', { ascending: false });

      let pendingItems = [];
      let historyItems = [];

      if (transfers) {
        transfers.forEach(t => {
          const item = {
            id: `TRF-${t.id || t.parcel_id}`,
            parcel_id: t.parcel_id,
            type: 'TRANSFER_AUDIT',
            claimant: t.from_address || '0x...',
            recipient: t.to_address || '0x...',
            ipfs_hash: t.parcels?.ipfs_hash || 'QmMockDeed...',
            area: t.parcels?.area ? `${t.parcels.area} SQM` : 'Parcel',
            status: t.verifier_approved ? 'LegallyValidated' : 'Pending Verifier Attestation',
            isVerified: t.verifier_approved,
            date: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recent'
          };
          if (t.verifier_approved) historyItems.push(item);
          else if (t.surveyor_approved || t.status === 'SurveyorVerified') pendingItems.push(item);
        });
      }

      if (parcels) {
        parcels.forEach(p => {
          const item = {
            id: `PCL-${p.parcel_id}`,
            parcel_id: p.parcel_id,
            type: 'INITIAL_REGISTRATION_AUDIT',
            claimant: p.owner_address,
            recipient: 'REGISTRY_VAULT',
            ipfs_hash: p.ipfs_hash || 'QmMockDeed...',
            area: `${p.area || 1250} SQM`,
            status: p.status || 'Active',
            isVerified: p.status === 'Verified' || p.status === 'Active',
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent'
          };
          if (p.status === 'Verified') historyItems.push(item);
          else if (p.status === 'Pending') pendingItems.push(item);
        });
      }

      setAuditQueue(pendingItems);
      setVerifiedHistory(historyItems);

    } catch (err) {
      console.error("Verifier fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel1 = supabase
      .channel('verifier-transfers-sub')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transfers' }, () => fetchData())
      .subscribe();

    const channel2 = supabase
      .channel('verifier-parcels-sub')
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

  const handleValidate = async (parcelId) => {
    if (!isConnected) {
      if (showToast) showToast('Please connect your sovereign Web3 wallet');
      return;
    }
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
      if (showToast) showToast('Validation transaction rejected by wallet')
    }
  }

  useEffect(() => {
    if (isConfirmed && processingId) {
      supabase.from('transfers').update({ verifier_approved: true, status: 'LegallyValidated' }).eq('parcel_id', processingId).then(() => {});
      supabase.from('parcels').update({ status: 'Verified' }).eq('parcel_id', processingId).then(() => {});
      
      setAuditQueue(prev => prev.filter(r => r.parcel_id !== processingId))
      setProcessingId(null)
      setTxHash(null)
      if (showToast) showToast('Legal compliance attested successfully on-chain')
    }
  }, [isConfirmed, processingId])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-nigeria-green animate-spin" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-nigeria-green/10 border-0.5 border-nigeria-green/30 rounded-full text-[10px] font-bold text-nigeria-green uppercase tracking-widest mb-4">
             Authority: NIMC_VERIFICATION_NODE
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Identity <span className="text-white/40">Audit Portal</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Legal & Biometric Compliance Attestation</p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'pending' ? 'bg-nigeria-green text-black shadow-lg' : 'text-white/40 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Audit ({auditQueue.length})
          </button>
          <button 
            onClick={() => setActiveTab('verified')}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'verified' ? 'bg-nigeria-green text-black shadow-lg' : 'text-white/40 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified History ({verifiedHistory.length})
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
           label="Pending Compliance Audit" 
           value={auditQueue.length} 
           icon={Clock}
           color="text-amber-400"
           desc="Claims awaiting NIMC verification"
         />
         <StatCard 
           label="Total Verified Claims" 
           value={verifiedHistory.length} 
           icon={ShieldCheck}
           color="text-nigeria-green"
           desc="Attested on-chain"
         />
         <StatCard 
           label="Audit Pass Rate" 
           value={verifiedHistory.length + auditQueue.length > 0 ? `${Math.round((verifiedHistory.length / (verifiedHistory.length + auditQueue.length)) * 100)}%` : '100%'} 
           icon={FileCheck}
           color="text-emerald-400"
           desc="Zero biometric conflicts"
         />
      </div>

      {/* Tab 1: Pending Audit Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
           <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-2">
             <ListFilter className="w-5 h-5 text-amber-400" />
             Pending Compliance Queue
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auditQueue.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 space-y-5 rounded-2xl border border-white/10 bg-reg-black/40 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                >
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{item.id}</span>
                         <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                           {item.status}
                         </span>
                      </div>
                      <h4 className="text-lg font-black text-white italic tracking-tight">Parcel #{item.parcel_id} ({item.area})</h4>
                   </div>

                   <div className="space-y-2 text-xs border-t border-b border-white/5 py-4">
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>Claimant Wallet:</span>
                         <span className="text-white">{item.claimant ? `${item.claimant.slice(0,6)}...${item.claimant.slice(-4)}` : '0x...'}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>Audit Type:</span>
                         <span className="text-nigeria-green font-bold">{item.type}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>IPFS Deed CID:</span>
                         <a href={`https://gateway.pinata.cloud/ipfs/${item.ipfs_hash}`} target="_blank" rel="noreferrer" className="text-nigeria-green hover:underline flex items-center gap-1 font-mono">
                           {item.ipfs_hash ? `${item.ipfs_hash.slice(0, 8)}...` : 'IPFS'}
                           <ExternalLink className="w-3 h-3" />
                         </a>
                      </div>
                   </div>

                   <button 
                     onClick={() => handleValidate(item.parcel_id)}
                     disabled={processingId === item.parcel_id || isSigning || isMinting}
                     className="w-full py-3 bg-nigeria-green text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-nigeria-green/20"
                   >
                     {(processingId === item.parcel_id && (isSigning || isMinting)) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Attest Identity Compliance
                        </>
                     )}
                   </button>
                </motion.div>
              ))}

              {auditQueue.length === 0 && (
                <div className="col-span-full text-center py-20 grayscale opacity-40 border border-dashed border-white/10 rounded-2xl">
                   <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-nigeria-green" />
                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">No Pending Verification Claims</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Tab 2: Verified History View */}
      {activeTab === 'verified' && (
        <div className="space-y-6">
           <h3 className="text-xl font-black italic text-white uppercase tracking-tight flex items-center gap-2">
             <UserCheck className="w-5 h-5 text-nigeria-green" />
             Verified Identity Compliance History
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedHistory.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 space-y-4 rounded-2xl border border-nigeria-green/20 bg-reg-black/40"
                >
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-nigeria-green uppercase tracking-widest">{item.id}</span>
                      <span className="px-2.5 py-1 bg-nigeria-green/10 border border-nigeria-green/30 text-nigeria-green rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                   </div>

                   <h4 className="text-lg font-black text-white italic tracking-tight">Parcel #{item.parcel_id} ({item.area})</h4>

                   <div className="space-y-2 text-xs border-t border-white/5 pt-4">
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>Owner Address:</span>
                         <span className="text-white font-bold">{item.claimant ? `${item.claimant.slice(0,6)}...${item.claimant.slice(-4)}` : '0x...'}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>Deed CID:</span>
                         <a href={`https://gateway.pinata.cloud/ipfs/${item.ipfs_hash}`} target="_blank" rel="noreferrer" className="text-nigeria-green hover:underline flex items-center gap-1 font-mono">
                           {item.ipfs_hash ? `${item.ipfs_hash.slice(0, 8)}...` : 'IPFS'}
                           <ExternalLink className="w-3 h-3" />
                         </a>
                      </div>
                      <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                         <span>Verification Status:</span>
                         <span className="text-emerald-400 font-bold">Passed NIMC Audit</span>
                      </div>
                   </div>
                </motion.div>
              ))}

              {verifiedHistory.length === 0 && (
                <div className="col-span-full text-center py-20 grayscale opacity-40 border border-dashed border-white/10 rounded-2xl">
                   <FileText className="w-12 h-12 mx-auto mb-4 text-white/40" />
                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">No Verified Records in Archive</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between rounded-2xl border border-white/5 bg-reg-black/40">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">NIMC Audit Node</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

export default VerifierDashboard
