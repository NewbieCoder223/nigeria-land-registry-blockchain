import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi'
import { parseEther } from 'viem'
import axios from 'axios'
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '../contracts/landRegistry'

const BACKEND_URL = 'http://localhost:5000'

const LandRegistrationForm = () => {
  const { address } = useAccount()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStatus, setProcessStatus] = useState('') // 'verifying', 'uploading', 'signing', 'minting'
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    ownerName: '',
    nin: '',
    dob: '1990-01-01',
    walletAddress: address || '',
    coordinates: [], // Array of [lat, lng]
    area: '1250', // Mock area in sqm
    documentFile: null,
    ipfsHash: ''
  })

  // 1. Fetch Registration Fee from Contract
  const { data: regFee } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'registrationFee',
  })

  // 2. Blockchain Write Hook
  const { writeContractAsync, data: hash, isPending: isSigning } = useWriteContract()

  // 3. Transaction Monitor
  const { isLoading: isMinting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      setStep(4)
      setIsProcessing(false)
    }
  }, [isConfirmed])

  // --- Handlers ---

  const handleVerifyIdentity = async () => {
    const trimmedNin = formData.nin?.toString().trim()
    if (!trimmedNin || trimmedNin.length !== 11 || !/^\d+$/.test(trimmedNin)) {
      setError("Please enter a valid 11-digit numeric NIN.")
      return
    }

    setIsProcessing(true)
    setProcessStatus('verifying')
    setError(null)

    try {
      // Step 1: Mock NIN Verification via Backend
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-nin`, {
        nin: formData.nin,
        name: formData.ownerName,
        dob: formData.dob
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.data.verified) {
        nextStep()
      } else {
        setError("NIN Verification Failed: " + response.data.message)
      }
    } catch (err) {
      setError("Identity Protocol Error: " + (err.response?.data?.message || err.message))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, documentFile: file }))
    }
  }

  const handleFinalSubmit = async () => {
    if (!formData.documentFile) {
        setError("Please upload the Survey Plan / Deed.")
        return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // ADVERSARIAL FIX: Wait for signing first before risking orphaned IPFS uploads.
      // However IPFS hash is needed in transaction arguments, so we must upload first.
      
      // Step 2: Upload to IPFS via Backend
      setProcessStatus('uploading')
      const uploadData = new FormData()
      uploadData.append('file', formData.documentFile)
      
      const uploadRes = await axios.post(`${BACKEND_URL}/api/parcels/upload-deed`, uploadData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      })

      const ipfsHash = uploadRes.data.ipfs_hash
      setFormData(prev => ({ ...prev, ipfsHash }))

      // Step 3: Blockchain Transaction
      setProcessStatus('signing')
      const gpsString = JSON.stringify(formData.coordinates)
      
      // ADVERSARIAL FIX: use await writeContractAsync to catch user rejection
      await writeContractAsync({
        address: LAND_REGISTRY_ADDRESS,
        abi: LAND_REGISTRY_ABI,
        functionName: 'registerLand',
        args: [
          formData.walletAddress,
          gpsString,
          BigInt(formData.area),
          ipfsHash
        ],
        value: regFee || parseEther('0.01'),
      })

      setProcessStatus('minting')
    } catch (err) {
      console.error(err)
      setError("Protocol Integration Error: " + (err.response?.data?.message || err.shortMessage || err.message))
      setIsProcessing(false)
    }
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-2">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-nigeria-green/10 border-0.5 border-nigeria-green/30 rounded-full text-[10px] font-bold text-nigeria-green uppercase tracking-widest">
            Protocol: 0xREVERSE_MAPPING
         </div>
         <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">
            Asset <span className="text-white/40">Registration</span>
         </h2>
         <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Step {step} of 3 — Sovereign Verification</p>
      </header>

      {/* Progress Stepper */}
      <div className="flex justify-between items-center px-12 relative">
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
         {[1, 2, 3].map((s) => (
           <div 
             key={s} 
             className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all z-10 border-0.5 ${
               step >= s ? 'bg-nigeria-green text-white border-nigeria-green shadow-lg shadow-nigeria-green/20' : 'bg-reg-surface text-white/20 border-white/10'
             }`}
           >
             {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
           </div>
         ))}
      </div>

      <div className="glass-card min-h-[500px] flex flex-col overflow-hidden relative">
        {/* Overlay Loader */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-reg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative">
                 <Loader2 className="w-12 h-12 text-nigeria-green animate-spin" />
                 <div className="absolute inset-0 blur-xl bg-nigeria-green/20 animate-pulse" />
              </div>
              <div className="text-center">
                 <h4 className="text-white font-bold uppercase tracking-widest">Processing</h4>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                    {processStatus === 'verifying' && 'Scanning NIMC Database (Local Mock)...'}
                    {processStatus === 'uploading' && 'Encrypting & Pinning to IPFS...'}
                    {processStatus === 'signing' && 'Waiting for Wallet Authorization...'}
                    {processStatus === 'minting' && 'Minting Sovereign Title Deed...'}
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                 <User className="w-6 h-6 text-nigeria-green" />
                 <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Identity Information</h3>
              </div>
              
              {error && (
                <div className="p-4 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-xl flex items-center gap-3">
                   <AlertCircle className="w-4 h-4 text-rose-500" />
                   <p className="text-xs text-rose-500 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    label="Full Legal Name" 
                    placeholder="e.g. Aliko Dangote" 
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                />
                <InputField 
                    label="National Identity Number (NIN)" 
                    placeholder="11-digit identification" 
                    value={formData.nin}
                    onChange={(e) => setFormData({...formData, nin: e.target.value})}
                />
                <div className="md:col-span-2">
                   <InputField 
                     label="Beneficiary Wallet Address" 
                     placeholder="0x..." 
                     value={formData.walletAddress}
                     onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                   />
                   <p className="text-[10px] text-white/20 mt-2 uppercase tracking-tighter">This address will be assigned the immutable NFT title deed.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[600px]"
            >
              <div className="p-8 pb-4">
                 <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-6 h-6 text-nigeria-green" />
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Geospatial Boundaries</h3>
                 </div>
                 <p className="text-xs text-white/40 uppercase tracking-widest">Click on the map to define the corners of your parcel.</p>
              </div>
              
              <div className="flex-1 bg-reg-black/40 relative">
                 <MapContainer center={[9.082, 8.675]} zoom={6} className="w-full h-full grayscale brightness-50 z-0">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEventsHandler onMapClick={(pos) => setFormData(d => ({ ...d, coordinates: [...d.coordinates, pos] }))} />
                    {formData.coordinates.length > 0 && (
                        <>
                            {formData.coordinates.map((pos, idx) => <Marker key={idx} position={pos} />)}
                            <Polygon positions={formData.coordinates} pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.2 }} />
                        </>
                    )}
                 </MapContainer>
                 
                 <div className="absolute top-4 right-4 p-4 glass-card bg-reg-black/80 z-[1000] space-y-3">
                    <div className="flex items-center justify-between gap-4">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Points Defined</span>
                       <span className="text-nigeria-green font-mono">{formData.coordinates.length} / 4</span>
                    </div>
                    <button 
                      onClick={() => setFormData(d => ({ ...d, coordinates: [] }))}
                      className="text-[9px] font-black text-rose-500 uppercase hover:text-rose-400 transition-colors"
                    >
                      Reset Selection
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
               <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-nigeria-green" />
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Digital Documents</h3>
               </div>

               {error && (
                <div className="p-4 bg-rose-500/10 border-0.5 border-rose-500/30 rounded-xl flex items-center gap-3">
                   <AlertCircle className="w-4 h-4 text-rose-500" />
                   <p className="text-xs text-rose-500 font-medium">{error}</p>
                </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Upload Verification</p>
                     <label className="h-48 border-0.5 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.tif,.jpg" />
                        {formData.documentFile ? (
                           <div className="text-center p-4">
                              <CheckCircle2 className="w-10 h-10 text-nigeria-green mx-auto mb-2" />
                              <p className="text-[10px] text-white font-bold uppercase truncate max-w-[200px]">{formData.documentFile.name}</p>
                              <p className="text-[8px] text-white/40 uppercase mt-1">Ready for Sovereign Upload</p>
                           </div>
                        ) : (
                           <>
                              <Upload className="w-8 h-8 text-white/20 group-hover:text-nigeria-green transition-colors" />
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center px-4">Drop Survey Plan / C of O (PDF/TIF)</p>
                           </>
                        )}
                     </label>
                  </div>
                  <div className="space-y-4 text-left">
                     <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Summary</p>
                     <div className="space-y-4">
                        <SummaryItem label="Owner" value={formData.ownerName || "Pending"} />
                        <SummaryItem label="Coordinates" value={`${formData.coordinates.length} vertices captured`} />
                        <SummaryItem label="Blockchain" value="Polygon Amoy (0x13882)" />
                        <SummaryItem label="Fee" value="0.01 MATIC" />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
               key="step4"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-10 text-center flex flex-col items-center justify-center h-[500px] space-y-6"
            >
               <div className="w-20 h-20 bg-nigeria-green/10 rounded-full flex items-center justify-center border-0.5 border-nigeria-green/30 relative">
                  <ShieldCheck className="w-10 h-10 text-nigeria-green" />
                  <div className="absolute inset-0 blur-2xl bg-nigeria-green/10 animate-pulse rounded-full" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white italic uppercase italic">Registration Secured</h3>
                  <p className="text-sm text-white/40 uppercase tracking-widest max-w-md">Asset Minted. Your property is now actively linked to your wallet and visible in your Estate Repository.</p>
                  
                  {hash && (
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-bold text-nigeria-green uppercase tracking-widest mt-4 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on PolygonScan
                    </a>
                  )}
               </div>
               <button onClick={() => window.location.reload()} className="btn-primary">Return to Hub</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="p-8 border-t-0.5 border-white/5 bg-reg-black/20 flex justify-between">
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                disabled={isProcessing}
                className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all disabled:opacity-20"
              >
                Cancel Registration
              </button>
              <button 
                onClick={prevStep}
                disabled={step === 1 || isProcessing}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  step === 1 ? 'opacity-0' : 'text-white/40 hover:text-white disabled:opacity-20'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <button 
              onClick={step === 1 ? handleVerifyIdentity : (step === 3 ? handleFinalSubmit : nextStep)}
              disabled={isProcessing}
              className="btn-primary flex items-center gap-2 px-10 disabled:opacity-20"
            >
              <span>{step === 1 ? 'Verify Identity' : (step === 3 ? 'Authorize & Sign' : 'Continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
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
      className="w-full bg-reg-surface border-0.5 border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-nigeria-green/30 transition-all font-medium placeholder:text-white/10"
    />
  </div>
)

const SummaryItem = ({ label, value }) => (
  <div className="flex items-center justify-between pb-3 border-b-0.5 border-white/5">
    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-mono text-white text-right">{value}</span>
  </div>
)

const MapEventsHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick([e.latlng.lat, e.latlng.lng]),
  })
  return null
}

export default LandRegistrationForm
