import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ArrowRightLeft, 
  ShieldAlert, 
  UserCircle,
  BookOpen,
  Scale,
  MousePointer2,
  ShieldCheck,
  FileSignature,
  PenTool,
  ExternalLink,
  Zap,
  Eye,
  LogOut,
  ChevronRight,
  Lock,
  ShieldBan,
  Menu,
  X,
  ShieldCheck as ShieldVerified
} from 'lucide-react'

// Import Dashboards
import LandOwnerDashboard from './components/LandOwnerDashboard'
import GovernorDashboard from './components/GovernorDashboard'
import SurveyorDashboard from './components/SurveyorDashboard'
import VerifierDashboard from './components/VerifierDashboard'
import RegistrarDashboard from './components/RegistrarDashboard'

// Import Sub-Pages
import AssetPortfolio from './components/AssetPortfolio'
import GISCalibrations from './components/GISCalibrations'
import NationalLedger from './components/NationalLedger'
import NINDatabase from './components/NINDatabase'
import StampDeed from './components/StampDeed'

// Import Role-Specific Disputes
import LandOwnerDisputes from './components/LandOwnerDisputes'
import GovernorCrisisResolve from './components/GovernorCrisisResolve'

// Import Workflows
import LandRegistrationForm from './components/LandRegistrationForm'
import LandTransferForm from './components/LandTransferForm'

// Import Debug Overlay
import DebugOverlay from './components/DebugOverlay'

// Import Landing Page Component
import { LandingPage } from './components/LandingPage'

import { SovereignLogo } from './components/SovereignLogo'

// 🛡️ Sovereign Identity Registry
import { supabase } from './lib/supabase';

const SUPER_ADMIN = '0x765357ab691d7f6EE1afd432E9Db93B89F53D21D';

function App() {
  const { isConnected, address } = useAccount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [role, setRole] = useState(() => localStorage.getItem('user_role') || 'LANDOWNER')
  const [toast, setToast] = useState(null)
  const location = useLocation()

  const mainRef = React.useRef(null)

  // 📜 Scroll to Top on Navigation
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const isSuperAdmin = useMemo(() => address?.toLowerCase() === SUPER_ADMIN.toLowerCase(), [address]);
  const showApp = isConnected

  // 🛡️ Supabase Profile Sync
  useEffect(() => {
    const fetchProfile = async () => {
      if (isConnected && address && !isSuperAdmin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (data && !error) {
          setRole(data.role);
          localStorage.setItem('token', (await supabase.auth.getSession()).data.session?.access_token || '');
        } else {
          // Default to LANDOWNER if no profile found (Auto-registration flow might be needed)
          setRole('LANDOWNER');
        }
      }
    };

    fetchProfile();
    
    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => subscription.unsubscribe();
  }, [isConnected, address, isSuperAdmin]);

  // Sync role to localStorage whenever it changes manually (e.g. for superadmin)
  useEffect(() => {
    localStorage.setItem('user_role', role);
  }, [role]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Restricted routes that guests OR unauthorized users cannot see
  const govtRoutes = ['/governor', '/verifier', '/registrar', '/crisis-resolve', '/registry', '/nin', '/sign'];
  const isTargetingRestricted = govtRoutes.includes(location.pathname);

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="min-h-screen bg-reg-dark flex text-white font-sans selection:bg-nigeria-green/30 relative">
      {/* Sidebar - Integrated Mobile Support */}
      {showApp && (
        <>
          <Sidebar 
            role={role}
            setRole={setRole}
            isSuperAdmin={isSuperAdmin}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
              />
            )}
          </AnimatePresence>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-reg-black/40 backdrop-blur-luxury sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {showApp && (
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-white/60" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-3 group">
              <SovereignLogo className="w-10 h-10" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tight leading-none group-hover:text-nigeria-green transition-colors duration-500 uppercase">SOVEREIGN <span className="text-nigeria-green">Ledger</span></h1>
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Federal Republic of Nigeria</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {isSuperAdmin && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nigeria-green/10 border border-nigeria-green/20 text-nigeria-green text-[10px] font-black tracking-widest uppercase italic">
                 <ShieldVerified className="w-3.5 h-3.5" />
                 Sovereign Superuser
               </div>
            )}
            <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route 
                path="/" 
                element={!showApp ? <LandingPage /> : <Navigate to="/dashboard" />} 
              />
              
              {/* Core Dashboards */}
              <Route path="/dashboard" element={<LandOwnerDashboard showToast={showToast} />} />
              <Route path="/governor" element={<GovernorDashboard showToast={showToast} />} />
              <Route path="/surveyor" element={<SurveyorDashboard showToast={showToast} />} />
              <Route path="/verifier" element={<VerifierDashboard showToast={showToast} />} />
              <Route path="/registrar" element={<RegistrarDashboard showToast={showToast} />} />

              {/* Sub-Pages & Tools */}
              <Route path="/profile" element={<AssetPortfolio showToast={showToast} />} />
              <Route path="/calib" element={<GISCalibrations showToast={showToast} />} />
              <Route path="/registry" element={<NationalLedger showToast={showToast} />} />
              <Route path="/nin" element={<NINDatabase showToast={showToast} />} />
              <Route path="/sign" element={<StampDeed showToast={showToast} />} />

              {/* Differentiated Dispute Routes */}
              <Route path="/disputes" element={<LandOwnerDisputes showToast={showToast} />} />
              <Route path="/crisis-resolve" element={<GovernorCrisisResolve showToast={showToast} />} />

              {/* Workflows */}
              <Route path="/register" element={<LandRegistrationForm showToast={showToast} />} />
              <Route path="/transfer" element={<LandTransferForm showToast={showToast} />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="h-16 border-t border-white/5 flex items-center justify-between px-8 text-[10px] text-white/20 uppercase tracking-widest bg-reg-black/20">
          <p className="hidden md:block">© 2026 Oseikhuemen Osereme</p>
          <div className="flex gap-6 mx-auto md:mx-0">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
              Legal <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
              Technical <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </footer>
      </div>
      
      {/* 🛠️ Developer Verification Overlay — Restricted to Superuser */}
      {isSuperAdmin && <DebugOverlay role={role} setRole={setRole} showToast={showToast} />}

      {/* 🍞 Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 bg-reg-black border border-nigeria-green/30 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-nigeria-green animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RestrictedView = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8"
  >
    <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center animate-pulse">
       <ShieldBan className="w-10 h-10 text-rose-500" />
    </div>
    <div className="max-w-md space-y-4">
       <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Restricted <span className="text-rose-500">Protocol</span></h2>
       <p className="text-[11px] text-white/40 font-mono tracking-widest uppercase leading-relaxed font-bold italic">
          This administrative node contains high-security sovereign data. 
          Access requires official government credentials and cryptographic clearance.
       </p>
    </div>
    <div className="pt-8 grid grid-cols-2 gap-4">
       <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <Lock className="w-4 h-4 text-white/20 mb-2 mx-auto" />
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">AES-256 Active</span>
       </div>
       <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <ShieldCheck className="w-4 h-4 text-white/20 mb-2 mx-auto" />
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">Auth Shard Enc</span>
       </div>
    </div>
  </motion.div>
);

const Sidebar = ({ role, setRole, isSuperAdmin, isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    localStorage.setItem('user_role', newRole);
    switch (newRole) {
      case 'GOVERNOR': navigate('/governor'); break;
      case 'SURVEYOR': navigate('/surveyor'); break;
      case 'VERIFIER': navigate('/verifier'); break;
      case 'REGISTRAR': navigate('/registrar'); break;
      default: navigate('/dashboard'); break;
    }
  }

  const getMenuItems = (userRole) => {
    const commonItems = [{ name: 'Sovereign Hub', icon: LayoutDashboard, path: '/dashboard' }]
    
    switch(userRole) {
      case 'GOVERNOR':
        return [
          ...commonItems,
          { name: 'Command Center', icon: ShieldAlert, path: '/governor' },
          { name: 'National Ledger', icon: BookOpen, path: '/registry' },
          { name: 'Crisis Resolve', icon: Scale, path: '/crisis-resolve' },
        ]
      case 'SURVEYOR':
        return [
          ...commonItems,
          { name: 'GIS Mapping', icon: MapIcon, path: '/surveyor' },
          { name: 'Calibrations', icon: MousePointer2, path: '/calib' },
        ]
      case 'VERIFIER':
        return [
          ...commonItems,
          { name: 'Audit Portal', icon: ShieldCheck, path: '/verifier' },
          { name: 'NIN Database', icon: UserCircle, path: '/nin' },
        ]
      case 'REGISTRAR':
        return [
          ...commonItems,
          { name: 'Registry Desk', icon: FileSignature, path: '/registrar' },
          { name: 'Stamp Deed', icon: PenTool, path: '/sign' },
        ]
      default: // LANDOWNER
        return [
          ...commonItems,
          { name: 'Asset Registry', icon: MapIcon, path: '/register' },
          { name: 'Title Transfer', icon: ArrowRightLeft, path: '/transfer' },
          { name: 'Dispute Desk', icon: ShieldAlert, path: '/disputes' },
          { name: 'Portfolio', icon: UserCircle, path: '/profile' },
        ]
    }
  }

  const menuItems = getMenuItems(role)

  return (
    <motion.aside 
      initial={false}
      animate={(window.innerWidth >= 1024 || isOpen) ? { x: 0 } : { x: '-100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`fixed lg:static inset-y-0 left-0 w-64 sidebar-glass flex flex-col h-screen overflow-y-auto border-r border-white/5 z-40 lg:translate-x-0 !opacity-100`}
    >
      <div className="p-8 pb-4 flex items-center justify-between">
        <label className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Sovereign Authority</label>
        <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
           <X className="w-4 h-4 text-white/40" />
        </button>
      </div>

      <div className="px-8 mb-6">
        {(!isSuperAdmin) ? (
          <div className="flex flex-col gap-1">
             <span className={`text-[11px] font-black italic tracking-widest uppercase ${role !== 'LANDOWNER' ? 'text-rose-500' : 'text-nigeria-green'}`}>
               {String(role || 'LANDOWNER').replace('_', ' ')}
             </span>
             <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">Verified Protocol</span>
          </div>
        ) : (
          <div className="group">
             <select 
               value={role} 
               onChange={(e) => handleRoleChange(e.target.value)}
               className="bg-transparent text-[11px] font-black text-nigeria-green uppercase tracking-widest border-none p-0 focus:ring-0 cursor-pointer hover:brightness-125 transition-all"
             >
               <option className="bg-reg-dark" value="LANDOWNER">Land Owner</option>
               <option className="bg-reg-dark" value="GOVERNOR">Governor (Restricted)</option>
               <option className="bg-reg-dark" value="SURVEYOR">Surveyor (Field Ops)</option>
               <option className="bg-reg-dark" value="VERIFIER">Verifier (Restricted)</option>
               <option className="bg-reg-dark" value="REGISTRAR">Registrar (Restricted)</option>
             </select>
             {isSuperAdmin && <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mt-1">Superuser Overwrite Enabled</p>}
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-nigeria-green/10 text-nigeria-green' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-nigeria-green' : 'group-hover:text-white transition-colors duration-300'}`} />
              <span className="text-[11px] font-bold tracking-widest uppercase">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1 h-1 rounded-full bg-nigeria-green shadow-[0_0_12px_rgba(5,150,105,1)]"
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group">
          <p className="text-[10px] font-bold text-nigeria-green tracking-widest uppercase mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-nigeria-green animate-pulse" />
            System Live
          </p>
          <span className="text-[9px] text-white/30 font-mono uppercase group-hover:text-white/60 transition-colors">Polygon Amoy Testnet</span>
        </div>
      </div>
    </motion.aside>
  )
}

export default App
