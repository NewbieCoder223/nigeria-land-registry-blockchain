import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Map as MapIcon, 
  History, 
  Files, 
  ArrowUpRight,
  LandPlot,
  Activity,
  ShieldCheck,
  Loader2
} from 'lucide-react'
import { 
  MapContainer, 
  TileLayer, 
  Polygon,
  Popup 
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const LandOwnerDashboard = ({ showToast }) => {
  const { address, isConnected } = useAccount()
  const navigate = useNavigate()
  const [parcels, setParcels] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    const fetchParcels = async () => {
      setIsLoading(true);
      try {
        if (isConnected && address) {
          const { data, error } = await supabase
            .from('parcels')
            .select('*')
            .eq('owner_address', address.toLowerCase());
          
          if (!error && data) {
            setParcels(data.map(p => {
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
            }));
          }
        }
      } catch (err) {
        console.error("LandOwner fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcels();

    // ⚡ Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parcels',
          filter: `owner_address=eq.${address.toLowerCase()}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setParcels(prev => [...prev, {
              ...payload.new,
              coordinates: typeof payload.new.gps_coordinates === 'string' ? JSON.parse(payload.new.gps_coordinates) : payload.new.gps_coordinates
            }]);
          } else if (payload.eventType === 'UPDATE') {
            setParcels(prev => prev.map(p => p.parcel_id === payload.new.parcel_id ? {
              ...payload.new,
              coordinates: typeof payload.new.gps_coordinates === 'string' ? JSON.parse(payload.new.gps_coordinates) : payload.new.gps_coordinates
            } : p));
          } else if (payload.eventType === 'DELETE') {
            setParcels(prev => prev.filter(p => p.parcel_id !== payload.old.parcel_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected, address]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
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
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Estate <span className="text-white/40">Repository</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Manage your sovereign property assets</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/register')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Assets</span>
        </motion.button>
      </header>

      {/* Stats Grid - Calculated Dynamically from User Parcels */}
      {(() => {
        const totalSqm = parcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);
        const totalHectares = (totalSqm / 10000).toFixed(2);
        const verifiedCount = parcels.filter(p => p.status === 'Verified' || p.status === 'Active').length;
        const pendingCount = parcels.filter(p => p.status === 'Pending').length;
        const totalDeeds = parcels.filter(p => p.ipfs_hash).length;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Prime Holdings" 
              value={totalHectares} 
              unit="Hectares" 
              icon={LandPlot}
              trend={`${parcels.length} Total Parcels`}
              color="text-nigeria-green"
            />
            <StatCard 
              label="Pending Approvals" 
              value={pendingCount} 
              unit="Pending" 
              icon={Activity}
              trend="Workflow Active"
              color="text-gold-accent"
            />
            <StatCard 
              label="Verified Titles" 
              value={parcels.length > 0 ? `${Math.round((verifiedCount / parcels.length) * 100)}%` : '0%'} 
              unit="Compliance" 
              icon={ShieldCheck}
              trend="Immutable Ledger"
              color="text-nigeria-green"
            />
            <StatCard 
              label="Archive Files" 
              value={totalDeeds} 
              unit="Digital Deeds" 
              icon={Files}
              trend="IPFS Secured"
              color="text-white/60"
            />
          </div>
        );
      })()}

      {/* Main Map & Parcel List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map Area */}
        <div className="lg:col-span-2 glass-card overflow-hidden h-[600px] relative group">
          <div className="absolute top-6 left-6 z-[1000] flex gap-2">
             <div className="px-4 py-2 bg-reg-black/80 backdrop-blur-md rounded-full border-0.5 border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-nigeria-green animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Satellite Feed</span>
             </div>
          </div>
          
          <MapContainer 
            center={[6.5244, 3.3792]} 
            zoom={11} 
            className="w-full h-full z-0 grayscale-[0.2] brightness-[0.8]"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {parcels.filter(p => Array.isArray(p.coordinates) && p.coordinates.length >= 3).map((p, idx) => (
              <Polygon 
                key={p.parcel_id || p.id || idx}
                positions={p.coordinates}
                pathOptions={{ 
                  color: p.status === 'Verified' ? '#059669' : '#d4af37',
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup className="glass-popup">
                  <div className="p-3">
                    <h4 className="font-bold text-black">Parcel #{p.parcel_id}</h4>
                    <p className="text-xs text-gray-600">Area: {p.area} SQM</p>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>

          <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-reg-dark via-reg-dark/40 to-transparent pointer-events-none">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Selected Region</p>
                   <h3 className="text-2xl font-black text-white italic underline decoration-nigeria-green underline-offset-8">LAGOS METROPOLIS</h3>
                </div>
                <div className="pointer-events-auto">
                   <button 
                      onClick={() => showToast('Satellite E-Report Generation System Undergoing Synchronization')}
                      className="p-4 rounded-full bg-white/5 border-0.5 border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                      <ArrowUpRight className="w-6 h-6" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Parcel List */}
        <div className="space-y-6 flex flex-col h-[600px]">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-4">Recent Records</h3>
              <div 
                className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-nigeria-green transition-colors" 
                onClick={() => showToast('Audit History Protocol (v2) Releasing in next Genesis Block')}
              >
                 <History className="w-3 h-3" />
                 History (v2)
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {parcels.map((parcel, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={parcel.id} 
                  className="glass-card p-6 group cursor-pointer hover:bg-white/5 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border-0.5 border-white/10 group-hover:border-nigeria-green/30 transition-colors">
                      <MapIcon className="w-5 h-5 text-nigeria-green" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${
                      parcel.status === 'Verified' ? 'text-nigeria-green bg-nigeria-green/5' : 'text-gold-accent bg-gold-accent/5'
                    }`}>
                      {parcel.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-white tracking-tight">Parcel #{parcel.parcel_id}</h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Status: {parcel.status}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t-0.5 border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Acreage <span className="text-white block font-mono text-xs">{parcel.area}</span>
                       </div>
                    </div>
                    <button className="p-2 rounded-lg text-white/20 group-hover:text-white group-hover:bg-nigeria-green/20 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {!isLoading && parcels.length === 0 && (
                 <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-white/5 flex flex-col items-center justify-center">
                    <MapIcon className="w-8 h-8 text-white/20 mb-3" />
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                       No assets found in your portfolio.
                       <br />
                       Click 'Register New Assets' to configure bounds.
                    </p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, unit, icon: Icon, trend, color, message }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div className="p-2.5 rounded-xl bg-white/5 border-0.5 border-white/10">
        <Icon className="w-5 h-5 text-white/60" />
      </div>
      {trend && <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{trend}</span>}
    </div>
    
    <div className="mt-6 flex flex-col">
       {message && <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">{message}</p>}
       <div className="flex items-baseline gap-2">
         <span className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</span>
         <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{unit}</span>
       </div>
       <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mt-2 italic">{label}</p>
    </div>
  </motion.div>
)

export default LandOwnerDashboard
