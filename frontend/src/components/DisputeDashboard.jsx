import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldAlert, 
  Scale, 
  Gavel, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search
} from 'lucide-react'

const DisputeDashboard = () => {
  const activeDisputes = [
    { id: "DISP-101", parcel: "NG-LAG-IKJ-001", type: "Boundary Overlap", status: "EVIDENCE_REVIEW", priority: "HIGH" },
    { id: "DISP-102", parcel: "NG-ABU-GWA-042", type: "Inheritance Claim", status: "WAITING_RULING", priority: "CRITICAL" },
    { id: "DISP-103", parcel: "NG-KN-MUN-990", type: "Fraudulent Deed", status: "INVESTIGATION", priority: "MEDIUM" }
  ]

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-full text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-4">
             Module: LEGAL_ARBITRATION_V1
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Dispute <span className="text-white/40">Desk</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Conflict Resolution & Title Rectification</p>
        </motion.div>

        <div className="flex gap-4">
           <motion.button whileHover={{ scale: 1.02 }} className="px-6 py-3 bg-rose-600/20 text-rose-500 border-0.5 border-rose-500/30 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-900/20">
             <Lock className="w-4 h-4" />
             Freeze Contested Titles
           </motion.button>
        </div>
      </header>

      {/* Dispute Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="Active Cases" value="24" icon={AlertTriangle} color="text-rose-500" desc="8 requiring urgent action" />
        <StatItem label="Resolved (30d)" value="142" icon={CheckCircle2} color="text-emerald-400" desc="9.8/10 satisfaction" />
        <StatItem label="Avg. Resolution" value="12d" icon={Gavel} color="text-blue-400" desc="Blockchain speedup enabled" />
        <StatItem label="Legal Integrity" value="99.9%" icon={Lock} color="text-white/60" desc="Tamper-proof evidence" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Active Cases Table */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-rose-500/20 underline-offset-8 flex items-center gap-2">
               <Scale className="w-5 h-5 text-rose-500" />
               Arbitration Queue
            </h3>
            <div className="glass-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02] border-b-0.5 border-white/5 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4 font-bold">Case ID</th>
                        <th className="px-8 py-4 font-bold">Parcel Reference</th>
                        <th className="px-8 py-4 font-bold">Contest Type</th>
                        <th className="px-8 py-4 font-bold">Status</th>
                        <th className="px-8 py-4 font-bold">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs">
                     {activeDisputes.map((caseItem, idx) => (
                       <tr key={idx} className="group border-b-0.5 border-white/5 hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6 font-mono text-white/40">#{caseItem.id}</td>
                          <td className="px-8 py-6">
                             <span className="font-mono text-white/80">{caseItem.parcel}</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="font-bold text-white/80">{caseItem.type}</p>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${
                                  caseItem.priority === 'CRITICAL' ? 'text-rose-500' : 'text-white/20'
                                }`}>{caseItem.priority} PRIORITY</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/5 border-0.5 border-white/10 rounded text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                {caseItem.status.replace('_', ' ')}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-white/5 text-white/20 border-0.5 border-white/10 hover:text-white hover:bg-white/10 transition-all">
                                   <FileText className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg bg-rose-500/10 text-rose-500 border-0.5 border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                                   <Gavel className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Evidence Vault */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight uppercase italic underline decoration-white/20 underline-offset-8">Evidence Vault</h3>
            <div className="glass-card p-8 space-y-6">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Search encrypted evidence linked to contested parcel hashes.</p>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input type="text" placeholder="Parcel Hash..." className="w-full bg-reg-surface border-0.5 border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/30 font-mono transition-all uppercase tracking-widest" />
                  </div>
                  <button className="w-full py-4 bg-white/5 text-white/40 border-0.5 border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/10 transition-all">Retrieve Records</button>
               </div>
               
               <div className="pt-4 border-t-0.5 border-white/5">
                  <div className="flex items-center gap-3 text-rose-500/20">
                     <ShieldAlert className="w-4 h-4" />
                     <p className="text-[9px] font-black uppercase tracking-widest">Protocol-Level Encryption Active</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

const StatItem = ({ label, value, icon: Icon, color, desc }) => (
  <div className="glass-card p-8 flex flex-col justify-between group">
     <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border-0.5 border-white/10 rounded-xl group-hover:border-white/20 transition-all">
           <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Legal Node Beta</span>
     </div>
     <div className="space-y-1">
        <span className="text-3xl font-black text-white italic tracking-tighter block">{value}</span>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest py-2 ${color} opacity-60`}>{desc}</p>
     </div>
  </div>
)

export default DisputeDashboard
