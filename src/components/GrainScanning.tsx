import { useState, useRef } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

type ScanState = 'upload' | 'scanning' | 'done'

export default function GrainScanning({ onNavigate }: Props) {
  const [state, setState] = useState<ScanState>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedGrain, setSelectedGrain] = useState('Maize')
  const fileRef = useRef<HTMLInputElement | null>(null)

  function startScan() {
    setState('scanning')
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 12 + 4
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => {
          setState('done')
          setTimeout(() => onNavigate('scan-results'), 600)
        }, 400)
      }
      setProgress(Math.min(p, 100))
    }, 180)
  }

  const steps = [
    { label: 'Upload',   active: state === 'upload',   done: state !== 'upload' },
    { label: 'Scanning', active: state === 'scanning', done: state === 'done' },
    { label: 'Results',  active: false,                done: false },
  ]

  return (
    <div>
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => onNavigate('farmer-dashboard')}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">Scan Grain</div>
        <div className="flex-1" />
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-sky-100 text-sky-600">AI Analysis</span>
      </div>

      {/* Page */}
      <div className="max-w-[680px] mx-auto p-10 px-8">
        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all duration-[220ms] ${
                s.active ? 'bg-sky-500 border-sky-500 text-white'
                : s.done  ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {s.done ? '✓' : i + 1}
              </div>
              <div className={`text-xs font-semibold ml-2 ${s.active ? 'text-sky-600' : 'text-slate-400'}`}>{s.label}</div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${s.done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {state === 'upload' && (
          <UploadState
            dragOver={dragOver}
            selectedGrain={selectedGrain}
            setSelectedGrain={setSelectedGrain}
            onDragOver={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => { setDragOver(false); startScan() }}
            onFileClick={() => fileRef.current?.click()}
            onStartScan={startScan}
            fileRef={fileRef}
          />
        )}

        {state === 'scanning' && <ScanningState progress={progress} grain={selectedGrain} />}

        {state === 'done' && (
          <div className="text-center py-[60px]">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-[#A7F3D0] flex items-center justify-center text-[28px] mx-auto mb-4">✓</div>
            <div className="text-lg font-bold text-slate-900">Analysis Complete</div>
            <div className="text-sm text-slate-400 mt-[6px]">Loading your results…</div>
          </div>
        )}
      </div>
    </div>
  )
}

interface UploadStateProps {
  dragOver: boolean; selectedGrain: string; setSelectedGrain: (g: string) => void
  onDragOver: () => void; onDragLeave: () => void; onDrop: () => void
  onFileClick: () => void; onStartScan: () => void; fileRef: React.RefObject<HTMLInputElement | null>
}

function UploadState({ dragOver, selectedGrain, setSelectedGrain, onDragOver, onDragLeave, onDrop, onFileClick, onStartScan, fileRef }: UploadStateProps) {
  const grains = ['Maize', 'Wheat', 'Sorghum', 'Soybean', 'Rice', 'Millet']

  return (
    <div className="flex flex-col gap-5">
      {/* Grain selector */}
      <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
        <div className="text-[13px] font-semibold text-slate-900 mb-3">Grain Type</div>
        <div className="flex gap-2 flex-wrap">
          {grains.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrain(g)}
              className={`py-[7px] px-4 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                selectedGrain === g
                  ? 'border-sky-500 bg-sky-50 text-sky-600'
                  : 'border-slate-200 bg-transparent text-slate-500 hover:border-slate-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-[28px] py-14 px-10 text-center cursor-pointer relative transition-all duration-[220ms] ${
          dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-500 hover:bg-sky-50'
        }`}
        onDragOver={e => { e.preventDefault(); onDragOver() }}
        onDragLeave={onDragLeave}
        onDrop={e => { e.preventDefault(); onDrop() }}
        onClick={onFileClick}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onStartScan} />
        <div className="w-14 h-14 rounded-[20px] bg-white border border-slate-200 flex items-center justify-center mx-auto mb-5 text-sky-500 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-[17px] font-bold text-slate-900 mb-2">
          {dragOver ? 'Drop to start scan' : 'Upload grain image'}
        </div>
        <div className="text-sm text-slate-400 mb-5">
          Drag & drop your grain photo, or{' '}
          <span className="text-sky-500 font-semibold">browse files</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['JPG', 'PNG', 'HEIC', 'WEBP'].map(f => (
            <span key={f} className="px-[10px] py-[3px] bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-500">{f}</span>
          ))}
          <span className="text-xs text-slate-400">· Max 20MB</span>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
        <div className="text-[13px] font-semibold text-slate-900 mb-[14px]">Photo tips for best results</div>
        <div className="flex flex-col gap-[10px]">
          {[
            { icon: '☀️', tip: 'Take the photo in good natural lighting' },
            { icon: '📐', tip: 'Spread grain flat and fill the frame' },
            { icon: '🔍', tip: 'Keep camera 20–30 cm above the sample' },
            { icon: '🧹', tip: 'Use a clean, neutral-coloured background' },
          ].map(t => (
            <div key={t.tip} className="flex gap-[10px] items-start">
              <span className="text-base leading-[1.4]">{t.icon}</span>
              <span className="text-[13px] text-slate-500">{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="inline-flex items-center justify-center gap-2 flex-1 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600 hover:-translate-y-px"
          onClick={onStartScan}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Start AI Scan
        </button>
        <button className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50 whitespace-nowrap">
          Use Camera
        </button>
      </div>
    </div>
  )
}

function ScanningState({ progress, grain }: { progress: number; grain: string }) {
  const messages = [
    'Detecting grain boundaries…',
    'Measuring moisture content…',
    'Analysing defect distribution…',
    'Calculating protein content…',
    'Comparing with price database…',
    'Generating quality report…',
  ]
  const msgIndex = Math.floor((progress / 100) * (messages.length - 1))

  return (
    <div className="flex flex-col gap-5">
      {/* Preview */}
      <div className="rounded-[28px] overflow-hidden relative h-[280px] flex items-center justify-center" style={{ background: '#0F172A' }}>
        <div className="absolute inset-0 flex items-center justify-center text-[80px] opacity-60"
          style={{ background: 'linear-gradient(135deg,#1a2744 0%,#0d1929 100%)' }}>
          🌽
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 40%,rgba(14,165,233,0.03) 100%)' }} />
        <div className="absolute left-0 right-0 h-[3px] z-10 animate-scan-fast"
          style={{ background: 'linear-gradient(90deg,transparent 0%,#38BDF8 30%,#0EA5E9 50%,#38BDF8 70%,transparent 100%)', boxShadow: '0 0 30px rgba(14,165,233,0.8),0 0 60px rgba(14,165,233,0.4)' }}
        />
        {/* Corner brackets */}
        <div className="absolute inset-6 z-[2] pointer-events-none">
          {[['top-0 left-0 border-t-2 border-l-2 rounded-tl-[3px]'],['top-0 right-0 border-t-2 border-r-2 rounded-tr-[3px]'],['bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[3px]'],['bottom-0 right-0 border-b-2 border-r-2 rounded-br-[3px]']].map(([cls], i) => (
            <div key={i} className={`absolute w-5 h-5 border-sky-500 ${cls}`} />
          ))}
        </div>
        <div className="absolute top-3 right-3 bg-sky-500/90 backdrop-blur text-white text-[11px] font-bold tracking-[0.05em] px-[10px] py-[5px] rounded-[6px]">
          AI SCANNING · {grain.toUpperCase()}
        </div>
        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center gap-[10px] backdrop-blur"
          style={{ background: 'rgba(15,23,42,0.85)' }}>
          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-sky-500 shrink-0 animate-spin-fast" />
          <div className="text-[13px] font-medium text-white/70 flex-1">{messages[msgIndex]}</div>
          <div className="text-[13px] font-bold text-sky-500">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-1">
        <div className="flex justify-between mb-2">
          <span className="text-[13px] font-semibold text-slate-900">Analysis Progress</span>
          <span className="text-[13px] font-bold text-sky-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-[width] duration-[1000ms]"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#0284C7,#38BDF8)' }}
          />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Grain Type',    value: grain,       done: progress > 20 },
          { label: 'Sample Quality', value: 'Sufficient', done: progress > 40 },
          { label: 'Lighting',      value: 'Optimal',   done: progress > 15 },
        ].map(c => (
          <div key={c.label} className="p-[14px] bg-white border border-slate-900/[0.06] rounded-[10px] text-center">
            <div className="text-[11px] text-slate-400 font-medium mb-1">{c.label}</div>
            <div className="text-[15px] font-bold" style={{ color: c.done ? '#0F172A' : '#CBD5E1' }}>
              {c.done ? c.value : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-progress bars */}
      <div className="flex flex-col gap-[10px]">
        {[
          { label: 'Boundary detection', pct: Math.min(progress * 1.5, 100) },
          { label: 'Moisture analysis',  pct: Math.max(0, Math.min((progress - 20) * 1.4, 100)) },
          { label: 'Defect scanning',    pct: Math.max(0, Math.min((progress - 40) * 1.4, 100)) },
          { label: 'Price calculation',  pct: Math.max(0, Math.min((progress - 65) * 2.5, 100)) },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-3">
            <div className="text-xs text-slate-500 w-[140px] shrink-0">{m.label}</div>
            <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-[1000ms]"
                style={{ width: `${m.pct}%`, background: m.pct === 100 ? '#10B981' : 'linear-gradient(90deg,#0284C7,#0EA5E9)' }}
              />
            </div>
            <div className="text-[11px] font-semibold w-7" style={{ color: m.pct === 100 ? '#10B981' : '#94A3B8' }}>
              {m.pct === 100 ? '✓' : `${Math.round(m.pct)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
