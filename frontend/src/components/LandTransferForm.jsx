import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRightLeft, 
  Map as MapIcon, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi'
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry'
import { supabase } from '../lib/supabase'

const LandTransferForm = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const { address, isConnected } = useAccount()
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [error, setError] = useState(null)

  // 1. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  // 2. Transaction Monitor
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 3. Live Parcels
  const [estates, setEstates] = useState([])
  const [isLoadingParcels, setIsLoadingParcels] = useState(true)

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchMyParcels = async () => {
      setIsLoadingParcels(true)
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('owner_address', address.toLowerCase())
        .eq('status', 'Active'); // Only transfer active ones
      
      if (!error && data) {
        setEstates(data.map(p => ({
          id: p.parcel_id,
          nid: `NG-REG-${p.parcel_id}`,
          name: `Parcel #${p.parcel_id}`,
          area: `${p.area} SQM`
        })));
      }
      setIsLoadingParcels(false)
    }

    fetchMyParcels()
  }, [isConnected, address])

  const handleTransfer = async () => {
    if (!selectedParcel) return setError("Please select a property to transfer.")
    if (!recipient || recipient.length !== 42) return setError("Please enter a valid recipient wallet address.")

    setError(null)
    try {
      await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'initiateTransfer',
        args: [BigInt(selectedParcel.id), recipient],
      })
    } catch (err) {
      console.error(err)
      setError("Transaction Failed: " + (err.shortMessage || err.message))
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-2">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-accent/10 border-0.5 border-gold-accent/30 rounded-full text-[10px] font-bold text-gold-accent uppercase tracking-widest">
            Module: TRANSACTION_V4
         </div>
         <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">
            Estate <span className="text-white/40">Transfer</span>
         </h2>
         <p className="text-sm text-white/40 uppercase tracking-widest font-medium italic underline decoration-gold-accent underline-offset-8">Conveyancing & Settlement</p>
      </header>

      <div className="space-y-6 relative">
         {/* Overlay Loader */}
         <AnimatePresence>
            {(isSigning || isMinting) && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-reg-black/60 backdrop-blur-sm z-50 rounded-3xl flex flex-col items-center justify-center space-y-4"
              >
                 <Loader2 className="w-10 h-10 text-gold-accent animate-spin" />
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                    {isSigning ? 'Authorizing in Wallet...' : 'Initiating On-Chain...'}
                 </p>
              </motion.div>
            )}
         </AnimatePresence>

         {/* Property Select Section */}
         <section className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
               <MapIcon className="w-3 h-3" />
               Select Property Portfolio
            </h3>
            <div className="grid grid-cols-1 gap-4">
               {isLoadingParcels ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold-accent" /></div>
               ) : estates.map((estate) => (
                  <label 
                    key={estate.id} 
                    className={`glass-card p-5 cursor-pointer hover:bg-white/5 transition-all relative group overflow-hidden block border-0.5 ${
                      selectedParcel?.id === estate.id ? 'border-gold-accent bg-gold-accent/5' : 'border-white/5'
                    }`}
                    onClick={() => setSelectedParcel(estate)}
                  >
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <h4 className="font-bold text-white tracking-tight">{estate.name}</h4>
                           <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">{estate.nid}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{estate.area}</span>
                           <span className="text-[9px] font-bold text-nigeria-green/60 uppercase tracking-widest">Ownership Verified</span>
                        </div>
                     </div>
                  </label>
               ))}
               {!isLoadingParcels && estates.length === 0 && (
                  <p className="text-center text-[10px] text-white/20 uppercase py-8">No Active Assets Found in Wallet</p>
               )}
            </div>
         </section>

         {/* Buyer Info */}
         <section className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
               <User className="w-3 h-3" />
               Recipient Identification
            </h3>
            <div className="glass-card p-8 space-y-6">
                {error && (
                    <div className="p-3 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <p className="text-[10px] text-rose-500 font-medium">{error}</p>
                    </div>
                )}
                <div className="space-y-4">
                   <InputField 
                     label="Recipient Wallet (0x...)" 
                     placeholder="0x..." 
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                   />
                </div>
            </div>
         </section>

         {/* Transaction Summary */}
         <section className="glass-card p-6 bg-reg-black/40 border-gold-accent/10">
            <div className="flex items-start gap-4">
               <div className="p-3 bg-gold-accent/10 rounded-xl">
                  <Info className="w-5 h-5 text-gold-accent" />
               </div>
               <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 1: Initiation Only</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    This will start a <span className="text-white/60 font-bold underline">Realistic Transfer Workflow</span>. Final settlement occurs only after Surveyor, Verifier, and Registrar approvals.
                  </p>
               </div>
            </div>
         </section>

         <button 
           onClick={handleTransfer}
           disabled={isConfirmed || isSigning || isMinting}
           className="w-full btn-primary h-16 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50"
         >
             <AnimatePresence mode="wait">
                {isConfirmed ? (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                     className="flex items-center gap-2"
                   >
                      <ShieldCheck className="w-5 h-5 text-white" />
                      <span className="text-sm font-black uppercase italic tracking-[0.1em]">Transfer Protocol Initiated</span>
                   </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-black uppercase italic tracking-[0.1em]">Authorize Initiation</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
             </AnimatePresence>
           </button>
           
           {isConfirmed && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 text-center space-y-4">
                <p className="text-[11px] text-nigeria-green font-bold uppercase tracking-widest">
                   Transfer Initiated Successfully. Awaiting Surveyor and Verifier processing.
                </p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-white/5 border-0.5 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all w-full"
                >
                   Return to Portfolio
                </button>
             </motion.div>
           )}
      </div>

      <p className="text-[9px] text-center text-white/20 uppercase tracking-[0.2em] px-10 leading-relaxed font-medium">
         Attention: This transaction will freeze the asset in the Sovereign Land Ledger until government nodes verify the transfer.
      </p>
    </div>
  )
}

const InputField = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-reg-surface border-0.5 border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold-accent/30 transition-all font-medium placeholder:text-white/10"
    />
  </div>
)

export default LandTransferForm
