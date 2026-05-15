import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { gradeAndScan } from '../api/squad'

type ScanState = 'idle' | 'camera' | 'preview' | 'scanning' | 'error'

export default function GrainScanning() {
  const navigate = useNavigate()
  const { farmerProfile, setScanResult } = useAppContext()

  const [state, setState] = useState<ScanState>('idle')
  const [selectedGrain, setSelectedGrain] = useState('Maize')
  const [quantity, setQuantity] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [cameraError, setCameraError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  async function startCamera() {
    setCameraError('')
    setState('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setCameraError('Camera access denied. Use the upload option below.')
      setState('idle')
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
    const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '')
    stopCamera()
    setCapturedBase64(base64)
    setImagePreview(dataUrl)
    setImageFile(null)
    setState('preview')
  }

  function retake() {
    setCapturedBase64(null)
    setImagePreview(null)
    startCamera()
  }

  function handleFileSelect(file: File) {
    stopCamera()
    setImageFile(file)
    setCapturedBase64(null)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setState('preview')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  async function runScan() {
    setState('scanning')
    setErrorMsg('')
    try {
      let base64 = capturedBase64
      if (!base64 && imageFile) base64 = await compressImage(imageFile)
      if (!base64) return

      const result = await gradeAndScan({
        farmer: farmerProfile ?? { firstName: 'Demo', lastName: 'Farmer', phone: '08000000000' },
        grainType: selectedGrain,
        quantity: parseFloat(quantity) || 50,
        imageBase64: base64,
        gps: { lat: 9.0765, lng: 7.3986 },
        weatherData: { humidity: 65, temperature: 28 },
      })
      setScanResult(result)
      navigate('/farmer/results')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrorMsg(msg ?? 'Scan failed. Please try again.')
      setState('preview')
    }
  }

  const steps = [
    { label: 'Capture',  active: state === 'idle' || state === 'camera' || state === 'preview' || state === 'error' },
    { label: 'Scanning', active: state === 'scanning' },
    { label: 'Results',  active: false },
  ]

  return (
    <div>
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => { stopCamera(); navigate('/farmer') }}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">Scan Grain</div>
        <div className="flex-1" />
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-sky-100 text-sky-600">AI Analysis</span>
      </div>

      <div className="max-w-[680px] mx-auto p-10 px-8">
        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all duration-[220ms] ${
                s.active ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>{i + 1}</div>
              <div className={`text-xs font-semibold ml-2 ${s.active ? 'text-sky-600' : 'text-slate-400'}`}>{s.label}</div>
              {i < steps.length - 1 && <div className="flex-1 h-px mx-2 bg-slate-200" />}
            </div>
          ))}
        </div>

        {state === 'scanning' && <ScanningState grain={selectedGrain} />}

        {state !== 'scanning' && (
          <div className="flex flex-col gap-5">
            {/* Grain selector */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-5">
              <div className="text-[13px] font-semibold text-slate-900 mb-3">Grain Type</div>
              <div className="flex gap-2 flex-wrap">
                {['Maize', 'Rice', 'Sorghum'].map(g => (
                  <button key={g} onClick={() => setSelectedGrain(g)}
                    className={`py-[7px] px-4 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                      selectedGrain === g ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-200 bg-transparent text-slate-500 hover:border-slate-300'
                    }`}
                  >{g}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-5">
              <label className="block text-[13px] font-semibold text-slate-900 mb-2">Quantity (kg)</label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 50" min="1"
                className="w-full px-[14px] py-[10px] text-sm text-slate-900 bg-white border-[1.5px] border-slate-200 rounded-[10px] outline-none transition focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] placeholder:text-slate-400"
              />
            </div>

            {/* Camera / Preview */}
            {(state === 'idle' || state === 'camera') && !imagePreview && (
              <div className="flex flex-col gap-3">
                {/* Live camera view */}
                <div className="relative rounded-[24px] overflow-hidden bg-slate-900" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-opacity duration-300 ${state === 'camera' ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {state === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
                      <div className="w-16 h-16 rounded-[20px] bg-white/10 flex items-center justify-center text-white">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold text-[15px]">Use your camera</div>
                        <div className="text-white/50 text-[13px] mt-1">Point at your grain sample</div>
                      </div>
                      <button
                        onClick={startCamera}
                        className="mt-1 inline-flex items-center gap-2 py-[10px] px-6 text-[14px] font-semibold rounded-[12px] bg-sky-500 text-white border-0 cursor-pointer transition hover:bg-sky-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Open Camera
                      </button>
                    </div>
                  )}

                  {state === 'camera' && (
                    <>
                      {/* Viewfinder corners */}
                      <div className="absolute inset-8 pointer-events-none">
                        {[
                          'top-0 left-0 border-t-2 border-l-2 rounded-tl-[4px]',
                          'top-0 right-0 border-t-2 border-r-2 rounded-tr-[4px]',
                          'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[4px]',
                          'bottom-0 right-0 border-b-2 border-r-2 rounded-br-[4px]',
                        ].map((cls, i) => (
                          <div key={i} className={`absolute w-6 h-6 border-sky-400 ${cls}`} />
                        ))}
                      </div>
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-[3px] rounded-full flex items-center gap-1">
                        <span className="w-[6px] h-[6px] rounded-full bg-white inline-block" />LIVE
                      </div>
                      {/* Capture button */}
                      <div className="absolute bottom-5 inset-x-0 flex justify-center">
                        <button
                          onClick={capturePhoto}
                          className="w-16 h-16 rounded-full bg-white border-4 border-sky-500 shadow-lg cursor-pointer transition hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                          <div className="w-11 h-11 rounded-full bg-sky-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {cameraError && (
                  <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-[10px] text-sm text-amber-700">
                    {cameraError}
                  </div>
                )}

                {/* Upload fallback */}
                <div
                  className={`border-2 border-dashed rounded-[20px] py-8 px-8 text-center cursor-pointer transition-all duration-[220ms] ${
                    dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'
                  }`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
                  <div className="text-slate-400 text-sm">
                    Or{' '}
                    <span className="text-sky-500 font-semibold">upload from gallery</span>
                    {' '}— drag & drop or click to browse
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    {['JPG', 'PNG', 'HEIC', 'WEBP'].map(f => (
                      <span key={f} className="px-[9px] py-[2px] bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-400">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preview state */}
            {state === 'preview' && imagePreview && (
              <div className="flex flex-col gap-3">
                <div className="relative rounded-[24px] overflow-hidden bg-slate-100" style={{ aspectRatio: '16/9' }}>
                  <img src={imagePreview} alt="Captured grain" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-[10px] py-[4px] rounded-full">
                    {capturedBase64 ? 'Photo captured' : 'Image selected'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={capturedBase64 ? retake : () => { setImagePreview(null); setImageFile(null); setState('idle') }}
                    className="inline-flex items-center justify-center gap-2 py-[10px] px-5 text-[13px] font-semibold rounded-[12px] border border-slate-200 bg-white text-slate-600 cursor-pointer transition hover:bg-slate-50"
                  >
                    {capturedBase64 ? 'Retake' : 'Change image'}
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 py-[10px] px-5 text-[13px] font-semibold rounded-[12px] border border-slate-200 bg-white text-slate-600 cursor-pointer transition hover:bg-slate-50"
                  >
                    Upload instead
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-5">
              <div className="text-[13px] font-semibold text-slate-900 mb-[14px]">Tips for best results</div>
              <div className="flex flex-col gap-[10px]">
                {[
                  { icon: '☀️', tip: 'Shoot in good natural lighting' },
                  { icon: '📐', tip: 'Spread grain flat and fill the frame' },
                  { icon: '🔍', tip: 'Hold camera 20–30 cm above the sample' },
                  { icon: '🧹', tip: 'Use a clean, neutral-coloured background' },
                ].map(t => (
                  <div key={t.tip} className="flex gap-[10px] items-start">
                    <span className="text-base leading-[1.4]">{t.icon}</span>
                    <span className="text-[13px] text-slate-500">{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[10px] text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <button
              className="inline-flex items-center justify-center gap-2 w-full py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              disabled={state !== 'preview'}
              onClick={runScan}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {state === 'preview' ? 'Start AI Scan' : 'Capture or upload an image first'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX_WIDTH = 1280
      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
      resolve(dataUrl.replace(/^data:image\/jpeg;base64,/, ''))
    }
    img.onerror = reject
    img.src = url
  })
}

function ScanningState({ grain }: { grain: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[28px] overflow-hidden relative h-[280px] flex items-center justify-center" style={{ background: '#0F172A' }}>
        <div className="absolute inset-0 flex items-center justify-center text-[80px] opacity-60"
          style={{ background: 'linear-gradient(135deg,#1a2744 0%,#0d1929 100%)' }}>
          🌾
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 40%,rgba(14,165,233,0.03) 100%)' }} />
        <div className="absolute left-0 right-0 h-[3px] z-10 animate-scan-fast"
          style={{ background: 'linear-gradient(90deg,transparent 0%,#38BDF8 30%,#0EA5E9 50%,#38BDF8 70%,transparent 100%)', boxShadow: '0 0 30px rgba(14,165,233,0.8),0 0 60px rgba(14,165,233,0.4)' }}
        />
        <div className="absolute inset-6 z-[2] pointer-events-none">
          {[['top-0 left-0 border-t-2 border-l-2 rounded-tl-[3px]'],['top-0 right-0 border-t-2 border-r-2 rounded-tr-[3px]'],['bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[3px]'],['bottom-0 right-0 border-b-2 border-r-2 rounded-br-[3px]']].map(([cls], i) => (
            <div key={i} className={`absolute w-5 h-5 border-sky-500 ${cls}`} />
          ))}
        </div>
        <div className="absolute top-3 right-3 bg-sky-500/90 backdrop-blur text-white text-[11px] font-bold tracking-[0.05em] px-[10px] py-[5px] rounded-[6px]">
          AI SCANNING · {grain.toUpperCase()}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center gap-[10px] backdrop-blur"
          style={{ background: 'rgba(15,23,42,0.85)' }}>
          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-sky-500 shrink-0 animate-spin-fast" />
          <div className="text-[13px] font-medium text-white/70 flex-1">Analysing grain quality…</div>
        </div>
      </div>

      <div className="bg-white border border-slate-900/[0.06] rounded-[20px] p-5 text-center">
        <div className="text-sm font-semibold text-slate-900 mb-1">Sending to AI for analysis</div>
        <div className="text-xs text-slate-400">This usually takes 5–15 seconds</div>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
