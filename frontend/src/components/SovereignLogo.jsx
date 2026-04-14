import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe2 } from 'lucide-react';

export const SovereignLogo = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative ${className} group`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-nigeria-green/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Main Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-nigeria-green to-emerald-900 rounded-xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
        
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Primary Icon */}
        <motion.div
          animate={{ scale: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck className="w-[60%] h-[60%] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] mx-auto" />
        </motion.div>

        {/* Orbit Detail */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-white/5 rounded-full scale-125 pointer-events-none"
        />
        
        {/* Lens Flare */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Mini Accent Icon */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-md flex items-center justify-center shadow-lg border border-nigeria-green/20">
        <Globe2 className="w-2.5 h-2.5 text-nigeria-green" />
      </div>
    </div>
  );
};
