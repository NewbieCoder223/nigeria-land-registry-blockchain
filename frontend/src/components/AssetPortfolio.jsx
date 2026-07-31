import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, ShieldCheck, Clock, Download, ArrowUpRight, Loader2, ExternalLink, FileText } from 'lucide-react';
import { useAccount } from 'wagmi';
import { supabase } from '../lib/supabase';

const AssetPortfolio = () => {
  const { address, isConnected } = useAccount();
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setParcels([]);
      setIsLoading(false);
      return;
    }

    const fetchParcels = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('owner_address', address.toLowerCase());

      if (!error && data) {
        setParcels(data);
      }
      setIsLoading(false);
    };

    fetchParcels();

    const channel = supabase
      .channel('portfolio-parcel-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parcels',
          filter: `owner_address=eq.${address.toLowerCase()}`
        },
        () => fetchParcels()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected, address]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-nigeria-green animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tight uppercase">Asset <span className="text-nigeria-green">Portfolio</span></h2>
          <p className="text-sm text-white/40 uppercase tracking-widest font-medium mt-1">
            Total Holdings: {parcels.length} Registered {parcels.length === 1 ? 'Plot' : 'Plots'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-nigeria-green" />
            Export Portfolio
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <Map className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Wallet Not Connected</h3>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Please connect your Web3 wallet to inspect your registered land titles.</p>
        </div>
      )}

      {isConnected && parcels.length === 0 && (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-nigeria-green/10 border border-nigeria-green/20 flex items-center justify-center mb-4">
            <Map className="w-8 h-8 text-nigeria-green" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-widest italic">No Registered Land Parcels Found</h3>
          <p className="text-xs text-white/40 mt-2 max-w-md uppercase tracking-wider leading-relaxed">
            Your connected wallet (<span className="font-mono text-white/60">{address.slice(0,6)}...{address.slice(-4)}</span>) does not own any registered title deeds yet.
          </p>
        </div>
      )}

      {isConnected && parcels.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parcels.map((parcel, index) => (
            <motion.div 
              key={parcel.id || parcel.parcel_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-reg-black/40 backdrop-blur-luxury p-6 hover:border-nigeria-green/30 transition-all shadow-2xl space-y-6"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-nigeria-green/5 blur-3xl group-hover:bg-nigeria-green/10 transition-all" />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-nigeria-green/10 border border-nigeria-green/20 flex items-center justify-center">
                  <Map className="w-6 h-6 text-nigeria-green" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                    parcel.status === 'Active' || parcel.status === 'Verified'
                      ? 'bg-nigeria-green/10 text-nigeria-green border-nigeria-green/30' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>
                    {parcel.status || 'Active'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-nigeria-green transition-colors italic tracking-tight">
                  Parcel #{parcel.parcel_id}
                </h3>
                <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-widest">
                  Title Reference: C_OF_O_NIG_{parcel.parcel_id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">Land Area</label>
                  <p className="text-base font-bold text-white italic font-mono">{parcel.area} SQM</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">IPFS Deed CID</label>
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${parcel.ipfs_hash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold text-nigeria-green hover:underline flex items-center gap-1 font-mono truncate"
                  >
                    {parcel.ipfs_hash ? `${parcel.ipfs_hash.slice(0, 10)}...` : 'QmMockDeed...'}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-white/40 uppercase border-t border-white/5">
                <span>Owner: {parcel.owner_address.slice(0, 8)}...{parcel.owner_address.slice(-6)}</span>
                <span className="text-nigeria-green font-bold">On-Chain Immutable</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AssetPortfolio;
