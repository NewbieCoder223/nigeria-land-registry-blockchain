import React from 'react';
import { motion } from 'framer-motion';
import { Map, ShieldCheck, Clock, Download, ArrowUpRight } from 'lucide-react';

const AssetPortfolio = () => {
  const assets = [
    {
      id: 'NG-ABJ-001',
      location: 'Maitama, Abuja',
      size: '1,200 sqm',
      status: 'VERIFIED',
      type: 'Residential',
      date: 'March 12, 2026'
    },
    {
      id: 'NG-LAG-224',
      location: 'Lekki Phase 1, Lagos',
      size: '650 sqm',
      status: 'PENDING',
      type: 'Commercial',
      date: 'April 02, 2026'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tight uppercase">Asset <span className="text-nigeria-green">Portfolio</span></h2>
          <p className="text-sm text-white/40 uppercase tracking-widest font-medium mt-1">Total Holdings: 2 Verified Plots</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-all flex items-center gap-2">
          <Download className="w-4 h-4 text-nigeria-green" />
          Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assets.map((asset, index) => (
          <motion.div 
            key={asset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-reg-black/40 backdrop-blur-luxury p-6 hover:border-nigeria-green/30 transition-all shadow-2xl"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-nigeria-green/5 blur-3xl group-hover:bg-nigeria-green/10 transition-all" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-nigeria-green/10 border border-nigeria-green/20 flex items-center justify-center">
                <Map className="w-6 h-6 text-nigeria-green" />
              </div>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                asset.status === 'VERIFIED' 
                  ? 'bg-nigeria-green/10 text-nigeria-green border-nigeria-green/30' 
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              }`}>
                {asset.status}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-nigeria-green transition-colors">{asset.location}</h3>
                <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-widest leading-none">Global ID: {asset.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Dimension</label>
                  <p className="text-sm font-bold text-white italic">{asset.size}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Category</label>
                  <p className="text-sm font-bold text-white italic">{asset.type}</p>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-nigeria-green/10 border border-nigeria-green/20 text-[10px] font-bold tracking-widest uppercase hover:bg-nigeria-green hover:text-white transition-all flex items-center justify-center gap-2">
                   View Map
                   <ArrowUpRight className="w-3 h-3" />
                </button>
                <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Clock className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Slot */}
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:border-nigeria-green/50 transition-colors">
            <span className="text-2xl text-white/20 group-hover:text-nigeria-green">+</span>
          </div>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white">Register New Parcel</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetPortfolio;
