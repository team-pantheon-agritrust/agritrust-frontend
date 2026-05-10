type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const offers = [
  { id: 1, emoji: '🌽', name: 'Yellow Maize', farmer: 'Aminu Yusuf · Kano', grade: 'A', price: '₦87,500', volume: '500 kg', status: 'Verified', statusClass: 'badge-green', age: '2h ago' },
  { id: 2, emoji: '🫘', name: 'Soybean', farmer: 'Emmanuel Obi · Plateau', grade: 'A', price: '₦112,000', volume: '800 kg', status: 'Pending', statusClass: 'badge-amber', age: '5h ago' },
  { id: 3, emoji: '🌾', name: 'Hard Red Wheat', farmer: 'Hauwa Bello · Kaduna', grade: 'B', price: '₦64,200', volume: '320 kg', status: 'Verified', statusClass: 'badge-green', age: '1d ago' },
  { id: 4, emoji: '🌾', name: 'White Sorghum', farmer: 'Daniel Lawan · Borno', grade: 'B', price: '₦52,800', volume: '400 kg', status: 'In Transit', statusClass: 'badge-sky', age: '2d ago' },
  { id: 5, emoji: '🍚', name: 'Paddy Rice', farmer: 'Fatima Usman · Kebbi', grade: 'A', price: '₦138,000', volume: '1,000 kg', status: 'Pending', statusClass: 'badge-amber', age: '3d ago' },
]

const escrowItems = [
  { id: 'ESC-4821', grain: 'Yellow Maize · 500 kg', amount: '₦87,500', condition: 'Delivery confirmation', pct: 75 },
  { id: 'ESC-4735', grain: 'Soybean · 800 kg', amount: '₦112,000', condition: 'Quality verification', pct: 40 },
]

export default function BuyerDashboard({ onNavigate }: Props) {
  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3 flex-1">
          <div className="page-title">Buyer Dashboard</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline btn-sm">
            <FilterIcon /> Filter
          </button>
          <button className="btn btn-sky btn-sm">
            <PlusIcon /> New Order
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Pending Offers', value: '3', sub: '2 require action', color: 'var(--amber)', bgColor: 'var(--amber-50)' },
            { label: 'In Escrow', value: '₦199K', sub: '2 transactions', color: 'var(--sky)', bgColor: 'var(--sky-50)' },
            { label: 'Delivered (YTD)', value: '18', sub: '14.2 tonnes total', color: 'var(--green)', bgColor: 'var(--green-50)' },
            { label: 'Avg Quality Score', value: '91.4', sub: 'A-grade average', color: '#7C3AED', bgColor: '#F5F3FF' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="stat-label">{s.label}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, marginTop: 3 }} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta neutral">{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main — offers list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Offers table */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '20px 20px 0' }}>
                <div className="section-header">
                  <div className="section-heading">Incoming Offers</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'Verified', 'Pending', 'In Transit'].map(f => (
                      <button
                        key={f}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 99,
                          border: '1px solid var(--gray-200)',
                          fontSize: 12,
                          fontWeight: 600,
                          color: f === 'All' ? 'var(--navy)' : 'var(--gray-400)',
                          background: f === 'All' ? 'var(--gray-100)' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px' }}>
                {offers.map(o => (
                  <div
                    key={o.id}
                    className="offer-row"
                    onClick={() => onNavigate('scan-results')}
                  >
                    <div className="offer-grain">{o.emoji}</div>
                    <div className="offer-info">
                      <div className="offer-name">{o.name}</div>
                      <div className="offer-farmer">{o.farmer} · {o.age}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 4, justifyContent: 'flex-end' }}>
                          <span className="badge badge-gray" style={{ fontSize: 11 }}>Grade {o.grade}</span>
                          <span className={`badge ${o.statusClass}`} style={{ fontSize: 11 }}>{o.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <div className="offer-volume">{o.volume}</div>
                          <div className="offer-price">{o.price}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: 12 }}
                          onClick={e => { e.stopPropagation(); onNavigate('scan-results') }}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sky btn-sm"
                          style={{ fontSize: 12 }}
                          onClick={e => { e.stopPropagation(); onNavigate('payment') }}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery map */}
            <div className="card delivery-card">
              <div className="delivery-map">
                <div className="map-grid" />
                {/* Route line */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <path d="M 60 80 Q 140 40 220 70 Q 300 100 360 60" stroke="#0EA5E9" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.6" />
                  <circle cx="60" cy="80" r="4" fill="#0EA5E9" />
                  <circle cx="360" cy="60" r="4" fill="#10B981" />
                </svg>
                <div className="map-pin">
                  <div className="pin-dot" />
                  <div className="pin-line" />
                </div>
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge badge-sky" style={{ fontSize: 11 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'pulse-ring 2s infinite' }} />
                    Live tracking
                  </span>
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className="badge badge-green" style={{ fontSize: 11 }}>GPS Verified</span>
                </div>
              </div>
              <div className="delivery-info">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
                  Active Delivery · ESC-4821
                </div>
                <div className="delivery-route">
                  <div className="route-dot" />
                  <span style={{ fontSize: 12 }}>Kano Farm Gate</span>
                  <div className="route-line" />
                  <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Lagos Warehouse</span>
                  <div className="route-dot-end" />
                </div>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>ETA</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>Tomorrow, 11:30 AM</div>
                  </div>
                  <div className="progress-track" style={{ width: 120 }}>
                    <div className="progress-fill" style={{ width: '68%', background: 'linear-gradient(90deg, var(--sky), var(--green))' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sky)' }}>68%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Escrow summary */}
            <div className="card" style={{ padding: 20 }}>
              <div className="section-heading" style={{ marginBottom: 16 }}>
                Escrow Accounts
              </div>
              {escrowItems.map(e => (
                <div
                  key={e.id}
                  style={{ padding: '14px 0', borderBottom: '1px solid var(--gray-50)', cursor: 'pointer' }}
                  onClick={() => onNavigate('payment')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.04em' }}>{e.id}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{e.amount}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>{e.grain}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-track" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${e.pct}%`, background: 'linear-gradient(90deg, var(--sky), var(--green))' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--sky)' }}>{e.pct}%</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>Waiting: {e.condition}</div>
                </div>
              ))}
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: 14 }}
                onClick={() => onNavigate('payment')}
              >
                Manage Escrow →
              </button>
            </div>

            {/* Quick search */}
            <div className="card" style={{ padding: 20 }}>
              <div className="section-heading" style={{ marginBottom: 12 }}>Find Grain</div>
              <input className="input" placeholder="Search grain type, location…" style={{ marginBottom: 12 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Maize', 'Soybean', 'Wheat', 'Rice'].map(g => (
                  <div
                    key={g}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--navy)',
                    }}
                  >
                    <span>{g}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                      {Math.floor(Math.random() * 20 + 5)} listings →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality distribution */}
            <div className="card" style={{ padding: 20 }}>
              <div className="section-heading" style={{ marginBottom: 14 }}>Purchased Quality Mix</div>
              {[
                { grade: 'A', pct: 62, color: 'var(--green)' },
                { grade: 'B', pct: 30, color: 'var(--sky)' },
                { grade: 'C', pct: 8, color: 'var(--amber)' },
              ].map(g => (
                <div key={g.grade} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: g.color + '15', border: `1px solid ${g.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: g.color, flexShrink: 0 }}>
                    {g.grade}
                  </div>
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', minWidth: 28 }}>{g.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
