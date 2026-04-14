import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ShieldCheck, 
  Map as MapIcon, 
  UserCircle, 
  Compass, 
  Lock, 
  Scale, 
  Globe2, 
  Fingerprint, 
  Zap, 
  ChevronRight, 
  Eye,
  ShieldAlert,
  Terminal,
  Database
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { InteractiveGlobe } from './Map/InteractiveGlobe';
import { SovereignLogo } from './SovereignLogo';

export const LandingPage = ({ onPreview }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Parallax handling
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollY } = useScroll();
  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative z-10 bg-reg-dark overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative">
        <motion.div 
          style={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] opacity-25 pointer-events-none scale-110 md:scale-150"
        >
          <InteractiveGlobe className="rotate-[15deg]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl space-y-10 relative z-20"
        >
          <motion.div style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-nigeria-green/10 border border-nigeria-green/30 text-nigeria-green text-[11px] font-black tracking-[0.3em] uppercase mb-4 shadow-2xl backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nigeria-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nigeria-green"></span>
              </span>
              Digital Sovereignty Protocol 1.02
            </div>
          </motion.div>

          <motion.h1 
             style={{ x: mousePos.x * 1, y: mousePos.y * 1 }}
             className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter text-white uppercase italic"
          >
            Fortify Your <br />
            <span className="text-nigeria-green italic drop-shadow-[0_0_30px_rgba(5,150,105,0.4)]">Territory.</span>
          </motion.h1>

          <motion.p 
            style={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
            className="text-white/40 max-w-2xl mx-auto text-sm md:text-xl leading-relaxed font-bold uppercase tracking-widest italic"
          >
            Nigeria's definitive cryptographic registry. Anchor your titles on 
            unyielding permanence. No disputes. No forgery. 
          </motion.p>

          <motion.div 
             style={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
             className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <ConnectButton.Custom>
               {({ openConnectModal }) => (
                 <button 
                   onClick={openConnectModal}
                   className="group px-12 py-6 bg-nigeria-green text-white rounded-2xl font-black italic uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_20px_60px_rgba(5,150,105,0.4)] flex items-center gap-3 border border-emerald-400/20 active:scale-95"
                 >
                   Establish Connection
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
               )}
            </ConnectButton.Custom>

            <button 
              onClick={onPreview}
              className="group px-12 py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black italic uppercase tracking-widest text-sm transition-all flex items-center gap-3 active:scale-95"
            >
              Explore National Desk
              <Eye className="w-4 h-4 group-hover:text-nigeria-green transition-colors" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
             icon={ShieldCheck} 
             title="Immutable Ledger" 
             desc="Zero title overlap. Every parcel encoded on the blockchain with cryptographic certainty."
             color="text-nigeria-green"
          />
          <FeatureCard 
             icon={Compass} 
             title="GIS Precision" 
             desc="Sub-centimetre accuracy provided by global GNSS sensor clusters for absolute boundary trust."
             color="text-blue-500"
          />
          <FeatureCard 
             icon={Fingerprint} 
             title="Verified Identity" 
             desc="Biometric synchronization with NIMC/NIN databases ensures legitimate title ownership."
             color="text-amber-500"
          />
        </div>
      </section>

      {/* Roles Section - With Restricted View */}
      <section className="py-32 px-8 bg-white/[0.02] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center">
             <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Ecosystem <span className="text-nigeria-green">Authorization Matrix</span></h2>
             <p className="text-[11px] text-white/40 font-mono tracking-widest uppercase">Multi-Role Governance Configuration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <RoleCard 
                title="Citizen Node" 
                role="Landowner" 
                icon={UserCircle} 
                isRestricted={false} 
                details={["Manage Asset Portfolio", "File Dispute Claims", "Instant Title Transfer"]}
             />
             <RoleCard 
                title="Administrative Access" 
                role="Governor / Registrar" 
                icon={ShieldAlert} 
                isRestricted={true} 
                details={["National Crisis Oversight", "Sovereign Title Freezing", "Legal Implementation"]}
             />
          </div>
        </div>
        
        {/* Background Decorative Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nigeria-green/5 blur-3xl rounded-full" />
      </section>

      {/* Technical Proof Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto text-center space-y-16">
        <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl mb-8">
           <Zap className="text-amber-500 w-5 h-5 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Proof of Security: Active Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 glass-card border-white/5 bg-black/40 space-y-4">
              <Terminal className="text-nigeria-green w-6 h-6 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter italic">ZKP Circuits</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold italic">Zero-Knowledge Identity Verification</p>
           </div>
           <div className="p-8 glass-card border-white/5 bg-black/40 space-y-4">
              <Database className="text-blue-500 w-6 h-6 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter italic">AES-256 Storage</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold italic">Military-Grade Deed Encryption</p>
           </div>
           <div className="p-8 glass-card border-white/5 bg-black/40 space-y-4">
              <Globe2 className="text-amber-500 w-6 h-6 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter italic">Polygon Amoy</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold italic">Decentralized Trust Network</p>
           </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 glass-card border-white/5 bg-reg-black/40 relative overflow-hidden group"
  >
     <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 ${color} group-hover:scale-110 transition-all shadow-2xl`}>
        <Icon className="w-6 h-6" />
     </div>
     <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 italic italic">{title}</h3>
     <p className="text-sm text-white/40 leading-relaxed uppercase font-bold tracking-widest italic">{desc}</p>
     <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent w-full opacity-0 group-hover:opacity-100 transition-all ${color}`} />
  </motion.div>
);

const RoleCard = ({ title, role, icon: Icon, isRestricted, details }) => (
  <div className={`p-10 glass-card border-white/5 relative overflow-hidden group ${isRestricted ? 'bg-rose-500/[0.02]' : 'bg-nigeria-green/[0.02]'}`}>
     {isRestricted && (
        <div className="absolute top-0 right-0 p-4">
           <Lock className="w-4 h-4 text-rose-500/40" />
        </div>
     )}
     <div className="flex items-center gap-6 mb-10">
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg ${
           isRestricted ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-nigeria-green/10 border-nigeria-green/20 text-nigeria-green'
        }`}>
           <Icon className="w-7 h-7" />
        </div>
        <div>
           <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isRestricted ? 'text-rose-500' : 'text-nigeria-green'}`}>
              {isRestricted ? 'Restricted Node' : 'Public Node'}
           </p>
           <h3 className="text-3xl font-black italic tracking-tighter uppercase italic">{role}</h3>
        </div>
     </div>

     <ul className="space-y-4 mb-10">
        {details.map(d => (
           <li key={d} className="flex items-center gap-4 group/item">
              <div className={`w-1.5 h-1.5 rounded-full transition-all group-hover/item:scale-150 ${isRestricted ? 'bg-rose-500/20' : 'bg-nigeria-green/20'}`} />
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest italic group-hover/item:text-white transition-colors">{d}</span>
           </li>
        ))}
     </ul>

     <button className={`w-full py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
        isRestricted 
           ? 'border-rose-500/20 text-rose-500/40 hover:bg-rose-500/10' 
           : 'border-nigeria-green/20 text-nigeria-green hover:bg-nigeria-green hover:text-white'
     }`}>
        {isRestricted ? 'Administrative Auth Required' : 'Establish Access'}
     </button>
  </div>
);
