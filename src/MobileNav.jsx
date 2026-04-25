import React from 'react'

const ITEMS = [
  { id: 'dash', label: 'Dashboard', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg> },
  { id: 'contracts', label: 'Contracte', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1z"/><path d="M5 6h6M5 9h4"/></svg> },
  { id: '__new__', label: 'Nou', icon: null },
  { id: 'payments', label: 'Plăți', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 7h14M4 10.5h2"/></svg> },
  { id: 'reports', label: 'Rapoarte', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12l3.5-4 3 2.5 2.5-4L14 10"/><rect x="1" y="1" width="14" height="14" rx="1.5"/></svg> },
]

export default function MobileNav({ page, setPage, onNew }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      height: 58, display: 'flex', zIndex: 200,
    }}>
      {ITEMS.map(item => {
        if (item.id === '__new__') {
          return (
            <div key="new" onClick={onNew} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2">
                  <path d="M8 3v10M3 8h10"/>
                </svg>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--green)' }}>Nou</span>
            </div>
          )
        }
        const active = page === item.id
        return (
          <div key={item.id} onClick={() => setPage(item.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            cursor: 'pointer', color: active ? 'var(--green)' : 'var(--t3)',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ width: 20, height: 20, display: 'flex' }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
