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
  const fileRef = useRef<HTMLInputElement>(null)

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
    { label: 'Upload', active: state === 'upload', done: state !== 'upload' },
    { label: 'Scanning', active: state === 'scanning', done: state === 'done' },
    { label: 'Results', active: false, done: false },
  ]

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('farmer-dashboard')}>
          ← Back
        </button>
        <div className="page-title">Scan Grain</div>
        <div style={{ flex: 1 }} />
        <div className="badge badge-sky">AI Analysis</div>
      </div>

      <div className="scan-page">
        {/* Step indicator */}
        <div className="scan-steps">
          {steps.map((s, i) => (
            <div key={s.label} className="step-item" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div className={`step-dot${s.active ? ' active' : s.done ? ' done' : ''}`}>
                {s.done ? '✓' : i + 1}
              </div>
              <div className={`step-label${s.active ? ' active' : ''}`}>{s.label}</div>
              {i < steps.length - 1 && (
                <div className={`step-line${s.done ? ' done' : ''}`} />
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

        {state === 'scanning' && (
          <ScanningState progress={progress} grain={selectedGrain} />
        )}

        {state === 'done' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--green-50)', border: '2px solid #A7F3D0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 16px'
            }}>
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>Analysis Complete</div>
            <div style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 6 }}>Loading your results…</div>
          </div>
        )}
      </div>
    </div>
  )
}

interface UploadStateProps {
  dragOver: boolean
  selectedGrain: string
  setSelectedGrain: (g: string) => void
  onDragOver: () => void
  onDragLeave: () => void
  onDrop: () => void
  onFileClick: () => void
  onStartScan: () => void
  fileRef: React.RefObject<HTMLInputElement | null>
}

function UploadState({
  dragOver, selectedGrain, setSelectedGrain,
  onDragOver, onDragLeave, onDrop, onFileClick, onStartScan, fileRef
}: UploadStateProps) {
  const grains = ['Maize', 'Wheat', 'Sorghum', 'Soybean', 'Rice', 'Millet']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Grain type selector */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 12 }}>
          Grain Type
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {grains.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrain(g)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: selectedGrain === g ? 'var(--sky)' : 'var(--gray-200)',
                background: selectedGrain === g ? 'var(--sky-50)' : 'transparent',
                color: selectedGrain === g ? 'var(--sky-dark)' : 'var(--gray-500)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); onDragOver() }}
        onDragLeave={onDragLeave}
        onDrop={e => { e.preventDefault(); onDrop() }}
        onClick={onFileClick}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onStartScan} />

        <div className="upload-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="upload-title">
          {dragOver ? 'Drop to start scan' : 'Upload grain image'}
        </div>
        <div className="upload-sub">
          Drag & drop your grain photo, or{' '}
          <span style={{ color: 'var(--sky)', fontWeight: 600 }}>browse files</span>
        </div>

        <div className="upload-formats">
          {['JPG', 'PNG', 'HEIC', 'WEBP'].map(f => (
            <span className="format-tag" key={f}>{f}</span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>· Max 20MB</span>
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 14 }}>
          Photo tips for best results
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '☀️', tip: 'Take the photo in good natural lighting' },
            { icon: '📐', tip: 'Spread grain flat and fill the frame' },
            { icon: '🔍', tip: 'Keep camera 20–30 cm above the sample' },
            { icon: '🧹', tip: 'Use a clean, neutral-coloured background' },
          ].map(t => (
            <div key={t.tip} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, lineHeight: 1.4 }}>{t.icon}</span>
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-sky btn-lg flex-1" onClick={onStartScan}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Start AI Scan
        </button>
        <button className="btn btn-outline btn-lg" style={{ whiteSpace: 'nowrap' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="scanning-preview">
        <div className="scanning-grain-bg">🌽</div>
        <div className="scanning-overlay" />
        <div className="scanning-sweep" />

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map(c => (
          <div
            key={c}
            className={`scan-corner ${c}`}
            style={{ position: 'absolute', inset: 24, zIndex: 2 }}
          />
        ))}

        <div className="ai-badge">AI SCANNING · {grain.toUpperCase()}</div>

        <div className="scanning-status">
          <div className="scanning-spinner" />
          <div className="scanning-text">{messages[msgIndex]}</div>
          <div className="scanning-pct">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Analysis Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sky)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--sky-dark), var(--sky-light))',
            }}
          />
        </div>
      </div>

      {/* Live analysis cards */}
      <div className="scan-info-cards">
        {[
          { label: 'Grain Type', value: grain, done: progress > 20 },
          { label: 'Sample Quality', value: 'Sufficient', done: progress > 40 },
          { label: 'Lighting', value: 'Optimal', done: progress > 15 },
        ].map(c => (
          <div className="scan-info-card" key={c.label}>
            <div className="scan-info-card-label">{c.label}</div>
            <div className="scan-info-card-value" style={{ color: c.done ? 'var(--navy)' : 'var(--gray-300)' }}>
              {c.done ? c.value : '—'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Boundary detection', pct: Math.min(progress * 1.5, 100) },
          { label: 'Moisture analysis', pct: Math.max(0, Math.min((progress - 20) * 1.4, 100)) },
          { label: 'Defect scanning', pct: Math.max(0, Math.min((progress - 40) * 1.4, 100)) },
          { label: 'Price calculation', pct: Math.max(0, Math.min((progress - 65) * 2.5, 100)) },
        ].map(m => (
          <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', width: 140, flexShrink: 0 }}>{m.label}</div>
            <div className="progress-track" style={{ flex: 1 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${m.pct}%`,
                  background: m.pct === 100
                    ? 'var(--green)'
                    : 'linear-gradient(90deg, var(--sky-dark), var(--sky))',
                }}
              />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: m.pct === 100 ? 'var(--green)' : 'var(--gray-400)', width: 28 }}>
              {m.pct === 100 ? '✓' : `${Math.round(m.pct)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
