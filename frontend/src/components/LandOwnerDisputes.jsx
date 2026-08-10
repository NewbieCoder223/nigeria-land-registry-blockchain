import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  FileText, 
  PlusCircle, 
  Clock, 
  ChevronRight, 
  Gavel,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi';
import { parseEther } from 'viem';
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry';
import { supabase } from '../lib/supabase';

const LandOwnerDisputes = () => {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parcelId, setParcelId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  // 1. Live Cases & User Parcels from Supabase
  const [myCases, setMyCases] = useState([]);
  const [userParcels, setUserParcels] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCases(true);
      if (address) {
        // Fetch User's Parcels first
        const { data: userParcelData } = await supabase
          .from('parcels')
          .select('parcel_id, ipfs_hash, status')
          .eq('owner_address', address.toLowerCase());
        
        let availableParcels = userParcelData || [];

        // If user owns 0 parcels, fetch all system parcels so they can select any parcel to dispute
        if (availableParcels.length === 0) {
          const { data: allParcelData } = await supabase
            .from('parcels')
            .select('parcel_id, ipfs_hash, status');
          if (allParcelData) {
            availableParcels = allParcelData;
          }
        }

        setUserParcels(availableParcels);
        if (availableParcels.length > 0) {
          setParcelId(String(availableParcels[0].parcel_id));
        }

        // Fetch user disputes
        const { data: disputeData } = await supabase
          .from('disputes')
          .select('*')
          .eq('claimant', address.toLowerCase());
        
        if (disputeData) {
          setMyCases(disputeData.map(d => ({
            id: `DISP-L-00${d.id || d.parcel_id}`,
            parcelId: String(d.parcel_id),
            type: d.reason || 'Title Dispute',
            status: d.status || 'PENDING_GOVERNOR_REVIEW',
            date: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent'
          })));
        } else {
          setMyCases([]);
        }
      } else {
        setUserParcels([]);
        setMyCases([]);
      }
      setIsLoadingCases(false);
    };

    fetchData();
  }, [address]);

  // 2. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract();

  // 3. Fetch Dispute Fee
  const { data: disputeFee } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'disputeFee',
  });

  // 4. Transaction Monitor
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFileDispute = async () => {
    if (!parcelId) return setError("Please select or enter a Parcel ID.");
    if (!reason) return setError("Please provide a legal reason for the dispute.");

    setError(null);
    try {
      await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'fileDispute',
        args: [BigInt(parcelId), reason],
        value: disputeFee || parseEther('0.05'),
      });
    } catch (err) {
      console.error(err);
      setError("Transaction Failed: " + (err.shortMessage || err.message));
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsModalOpen(false);
      setReason('');
    }
  }, [isConfirmed]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tight uppercase">Dispute <span className="text-rose-500">Desk</span></h2>
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Title Advocacy & Case Tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
        >
          <PlusCircle className="w-3 h-3" />
          File New Dispute
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Cases */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase mb-4 italic">Active Enforcements</h3>
           {myCases.map(c => (
              <div key={c.id} className="glass-card border-white/5 p-6 bg-reg-black/40 hover:border-rose-500/30 transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                          <Gavel className="w-5 h-5 text-rose-500" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase italic">{c.type}</p>
                          <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mt-0.5">Asset Index: #{c.parcelId}</p>
                       </div>
                    </div>
                    <span className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest">#{c.id}</span>
                 </div>

                 <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-white/20" />
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{c.date}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{c.status.replace('_', ' ')}</span>
                       </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}
        </div>

        {/* Evidence Checklist */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase mb-4 italic">Preparation</h3>
           <div className="glass-card border-white/5 p-8 space-y-6 bg-reg-black/40">
              <div className="flex items-center gap-3">
                 <FileText className="text-rose-500 w-5 h-5" />
                 <span className="text-[10px] font-bold tracking-widest uppercase italic">Evidence Repository</span>
              </div>
              <ul className="space-y-4">
                 {[
                   'Certified Copy of Title Deed',
                   'NIN Biometric Receipt',
                   'Geo-tagged Site Photos',
                   'Surveyor Affidavit'
                 ].map(item => (
                    <li key={item} className="flex items-center gap-3 group cursor-pointer">
                       <div className="w-4 h-4 rounded border border-white/10 group-hover:border-rose-500/50 transition-colors" />
                       <span className="text-[10px] text-white/40 group-hover:text-white transition-colors uppercase font-bold italic">{item}</span>
                    </li>
                 ))}
              </ul>
              <div className="pt-6 border-t border-white/5">
                 <div className="flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5" />
                    <p className="text-[9px] text-rose-500/60 uppercase font-bold italic leading-relaxed">
                       Once filed, the asset will be "LITIGATION_LOCKED" on the blockchain until a ruling is reached by the Governor.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Filing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-reg-black/80 backdrop-blur-md"
               onClick={() => setIsModalOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="glass-card w-full max-w-lg bg-reg-surface p-10 space-y-8 relative z-10"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase italic">File <span className="text-rose-500">Dispute</span></h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Sovereign Tribunal Submission</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white"><X className="w-6 h-6"/></button>
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-xl flex items-center gap-3">
                     <AlertCircle className="w-4 h-4 text-rose-500" />
                     <p className="text-xs text-rose-500 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Target Parcel ID</label>
                      {userParcels.length > 0 ? (
                        <select 
                          value={parcelId}
                          onChange={(e) => setParcelId(e.target.value)}
                          className="w-full bg-reg-black/80 border-0.5 border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-rose-500/30 transition-all font-medium font-mono"
                        >
                          {userParcels.map(p => (
                            <option key={p.parcel_id} value={p.parcel_id} className="bg-reg-black text-white">
                              Parcel #{p.parcel_id} — (Status: {p.status || 'Active'})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Enter Parcel ID (e.g. 1)" 
                          value={parcelId}
                          onChange={(e) => setParcelId(e.target.value)}
                          className="w-full bg-reg-black/40 border-0.5 border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-rose-500/30 transition-all font-medium font-mono"
                        />
                      )}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Legal Reason / Complaint</label>
                      <textarea 
                        rows={4}
                        placeholder="State your claim clearly..." 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-reg-black/40 border-0.5 border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-rose-500/30 transition-all font-medium"
                      />
                   </div>
                </div>

                <button 
                  onClick={handleFileDispute}
                  disabled={isSigning || isMinting}
                  className="w-full btn-primary bg-rose-600 hover:bg-rose-500 border-rose-400/30 h-14 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   { (isSigning || isMinting) ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                      <>
                        <Gavel className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Transmit Claim</span>
                      </>
                   )}
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LandOwnerDisputes;
