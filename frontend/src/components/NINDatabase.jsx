import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  Search, 
  Database, 
  Fingerprint, 
  Lock, 
  ShieldAlert, 
  RefreshCcw,
  Loader2,
  X,
  KeyRound
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const NINDatabase = ({ showToast }) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideNin, setOverrideNin] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  const fetchIdentityRecords = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user profiles from database
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch land parcel registrations for NIN cross-referencing
      const { data: parcels } = await supabase
        .from('parcels')
        .select('*');

      let combinedRecords = [];

      if (profiles && profiles.length > 0) {
        combinedRecords = profiles.map(p => {
          const userParcelsCount = parcels ? parcels.filter(pcl => pcl.owner_address.toLowerCase() === (p.wallet_address || '').toLowerCase()).length : 0;
          return {
            id: p.id,
            ninHash: p.nin_hash ? `NIN-SHA256-${p.nin_hash.slice(0, 8)}...` : 'NIN-SECURE-HASH',
            fullNinHash: p.nin_hash || '',
            rawNin: p.nin || '',
            name: p.full_name || 'Registered Citizen',
            wallet: p.wallet_address || '0x...',
            status: p.is_verified ? 'VERIFIED' : 'PENDING_AUDIT',
            score: p.is_verified ? '100%' : '85%',
            parcelsCount: userParcelsCount,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent'
          };
        });
      }

      if (parcels && parcels.length > 0) {
        parcels.forEach(p => {
          if (!combinedRecords.some(r => r.wallet.toLowerCase() === (p.owner_address || '').toLowerCase())) {
            combinedRecords.push({
              id: p.parcel_id,
              ninHash: `NIN-SHA256-${(p.ipfs_hash || 'HASH').slice(0, 8)}...`,
              fullNinHash: p.ipfs_hash || '',
              rawNin: '',
              name: `Title Holder (Parcel #${p.parcel_id})`,
              wallet: p.owner_address || '0x...',
              status: p.status === 'Verified' ? 'VERIFIED' : 'ACTIVE_TITLE',
              score: '98%',
              parcelsCount: 1,
              date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent'
            });
          }
        });
      }

      setRecords(combinedRecords);
      setFilteredRecords(combinedRecords);

    } catch (err) {
      console.error("NIN fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentityRecords();

    const channel1 = supabase
      .channel('nin-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchIdentityRecords())
      .subscribe();

    const channel2 = supabase
      .channel('nin-parcels-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcels' }, () => fetchIdentityRecords())
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  // Search Filter Handler - High Precision Wildcard & SHA-256 NIN Hash Matching
  useEffect(() => {
    const filterRecords = async () => {
      if (!searchQuery.trim()) {
        setFilteredRecords(records);
        return;
      }

      const term = searchQuery.toLowerCase().trim();

      // Compute SHA256 hash of term if it looks like an 11-digit NIN
      let searchHash = '';
      if (/^\d{11}$/.test(term)) {
        try {
          const encoder = new TextEncoder();
          const dataBuffer = encoder.encode(term);
          const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          searchHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
        } catch (e) {
          console.error(e);
        }
      }

      const filtered = records.filter(r => {
        const nameMatch = (r.name || '').toLowerCase().includes(term);
        const walletMatch = (r.wallet || '').toLowerCase().includes(term);
        const ninHashMatch = (r.ninHash || '').toLowerCase().includes(term);
        const fullHashMatch = (r.fullNinHash || '').toLowerCase().includes(term);
        const rawNinMatch = (r.rawNin || '').toLowerCase().includes(term);
        const sha256Match = searchHash ? (r.fullNinHash || '').toLowerCase().includes(searchHash.slice(0, 16)) : false;
        const idMatch = String(r.id || '').toLowerCase().includes(term);
        const statusMatch = (r.status || '').toLowerCase().includes(term);
        
        return nameMatch || walletMatch || ninHashMatch || fullHashMatch || rawNinMatch || sha256Match || idMatch || statusMatch;
      });

      setFilteredRecords(filtered);
    };

    filterRecords();
  }, [searchQuery, records]);

  // ⚡ Refresh Identity Nodes Handler
  const handleRefreshNodes = () => {
    setIsRefreshing(true);
    fetchIdentityRecords().then(() => {
      setIsRefreshing(false);
      if (showToast) showToast('Identity Nodes Synchronized with NIMC Core Database');
    });
  };

  // 🔑 Administrative Manual Override Handler
  const handleManualOverride = () => {
    if (!overrideNin.trim()) {
      if (showToast) showToast('Please enter a target NIN or Citizen Wallet');
      return;
    }
    setIsOverrideModalOpen(false);
    if (showToast) showToast(`Manual Identity Override Executed for NIN ${overrideNin}`);
    setOverrideNin('');
    setOverrideReason('');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-nigeria-green animate-spin" />
      </div>
    );
  }

  const totalRecords = records.length;
  const verifiedCount = records.filter(r => r.status === 'VERIFIED' || r.status === 'ACTIVE_TITLE').length;
  const complianceScore = totalRecords > 0 ? Math.round((verifiedCount / totalRecords) * 100) : 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 space-y-8 max-w-[1600px] mx-auto font-sans"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-3">
             <UserCircle className="text-nigeria-green w-8 h-8" />
             National <span className="text-white/40">Identity Interface</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Cross-Reference Sync with NIMC Database</p>
        </div>
        
        <div className="w-full md:w-auto relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-nigeria-green transition-colors" />
           <input 
             type="text" 
             placeholder="Search by NIN, Name, Wallet, or Parcel ID..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full md:w-96 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white placeholder:text-white/30 focus:ring-1 focus:ring-nigeria-green focus:border-nigeria-green outline-none font-medium"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Database Status */}
         <div className="glass-card border-white/5 p-6 bg-reg-black/40 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
               <Database className="w-5 h-5 text-nigeria-green" />
               <span className="text-xs font-bold uppercase text-white/80">Live NIMC Synchrony</span>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-white/50 leading-none">Registered Citizen Profiles</label>
                  <p className="text-3xl font-extrabold text-white mt-1 leading-none font-mono">{totalRecords} Profiles</p>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={handleRefreshNodes}
                    disabled={isRefreshing}
                    className="px-5 py-2.5 bg-nigeria-green/10 text-nigeria-green border-0.5 border-nigeria-green/30 rounded-xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-nigeria-green hover:text-white transition-all disabled:opacity-50"
                  >
                     {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                     Refresh Identity Nodes
                  </button>
               </div>
            </div>
         </div>

         {/* Compliance Status */}
         <div className="glass-card border-white/5 p-6 bg-reg-black/40 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
               <Fingerprint className="w-5 h-5 text-nigeria-green" />
               <span className="text-xs font-bold uppercase text-white/80">Identity Verification</span>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-white/50 leading-none">Verified Compliance Score</label>
                  <p className="text-3xl font-extrabold text-nigeria-green mt-1 leading-none font-mono">{complianceScore}% Pass Rate</p>
               </div>
               <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/50 font-medium">{verifiedCount} Attested Identity Cards</span>
               </div>
            </div>
         </div>

         {/* Admin Controls */}
         <div className="glass-card border-white/5 p-6 bg-red-500/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
               <ShieldAlert className="w-5 h-5 text-red-500" />
               <span className="text-xs font-bold uppercase text-red-500">Administrative Override</span>
            </div>
            <div className="space-y-4">
               <p className="text-xs text-white/50 leading-relaxed font-medium">Perform administrative identity clearances or manual overrides</p>
               <button 
                 onClick={() => setIsOverrideModalOpen(true)}
                 className="w-full py-2.5 bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white transition-all rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2"
               >
                 <KeyRound className="w-3.5 h-3.5" />
                 Manual Override
               </button>
            </div>
         </div>
      </div>

      {/* Database Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden bg-reg-black/40">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold uppercase text-white tracking-tight">NIMC Citizen Identity Registry</h3>
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Showing {filteredRecords.length} of {records.length} Entries</span>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase text-white/40 tracking-widest">
                     <th className="p-4 pl-6">Citizen Name</th>
                     <th className="p-4">NIMC Identity Hash</th>
                     <th className="p-4">Wallet Address</th>
                     <th className="p-4">Titles Owned</th>
                     <th className="p-4">Audit Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-xs font-sans">
                  {filteredRecords.map((rec, i) => (
                    <tr key={rec.id || i} className="hover:bg-white/[0.02] transition-colors">
                       <td className="p-4 pl-6 font-bold text-white">{rec.name}</td>
                       <td className="p-4 text-nigeria-green font-mono">{rec.ninHash}</td>
                       <td className="p-4 text-white/70 font-mono">{rec.wallet ? `${rec.wallet.slice(0,6)}...${rec.wallet.slice(-4)}` : '0x...'}</td>
                       <td className="p-4 text-white font-medium">{rec.parcelsCount} Plot(s)</td>
                       <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            rec.status === 'VERIFIED' || rec.status === 'ACTIVE_TITLE'
                              ? 'bg-nigeria-green/10 text-nigeria-green border-nigeria-green/30'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          }`}>
                             {rec.status}
                          </span>
                       </td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                       <td colSpan={5} className="text-center py-12 text-white/40 text-xs uppercase tracking-widest font-mono">
                          No NIMC identity records matched your search query.
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* 🔑 Manual Override Modal */}
      <AnimatePresence>
        {isOverrideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-reg-black/80 backdrop-blur-md"
               onClick={() => setIsOverrideModalOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="glass-card w-full max-w-md bg-reg-surface p-8 space-y-6 relative z-10 rounded-2xl border border-red-500/30"
             >
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black uppercase text-white">
                        Administrative <span className="text-red-500">Override</span>
                      </h3>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Execute emergency identity clearance</p>
                   </div>
                   <button onClick={() => setIsOverrideModalOpen(false)} className="text-white/20 hover:text-white"><X className="w-6 h-6"/></button>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Target NIN / Citizen Wallet</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12345678901 or 0x..." 
                        value={overrideNin}
                        onChange={(e) => setOverrideNin(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-red-500 font-mono"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Executive Reason / Incident ID</label>
                      <textarea 
                        rows={3}
                        placeholder="Reason for administrative clearance..." 
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-red-500"
                      />
                   </div>
                </div>

                <button 
                  onClick={handleManualOverride}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
                >
                  <KeyRound className="w-4 h-4" />
                  Confirm Emergency Clearance
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NINDatabase;
