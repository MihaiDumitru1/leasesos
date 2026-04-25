import React from 'react'

const NAV = [
  {
    id: 'dash', label: 'Dashboard',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
  },
  {
    id: 'contracts', label: 'Contracte',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1z"/><path d="M5 6h6M5 9h4"/></svg>
  },
  {
    id: 'tenants', label: 'Chiriași',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="5.5" r="2.5"/><path d="M2 13s1-3 5-3 5 3 5 3"/></svg>
  },
  {
    id: 'payments', label: 'Plăți',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 7h14M4 10.5h2"/></svg>
  },
  {
    id: 'reports', label: 'Rapoarte',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12l3.5-4 3 2.5 2.5-4L14 10"/><rect x="1" y="1" width="14" height="14" rx="1.5"/></svg>
  },
]

export default function Sidebar({ page, setPage, onNewContract }) {
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="7" rx="1.5" fill="white"/>
            <rect x="10" y="2" width="6" height="4" rx="1.5" fill="white"/>
            <rect x="10" y="9" width="6" height="7" rx="1.5" fill="white"/>
            <rect x="2" y="12" width="6" height="4" rx="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.4px' }}>LeaseOS</div>
          <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>demo</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.9px', padding: '0 8px', marginBottom: 6 }}>Principal</div>
        {NAV.slice(0, 3).map(item => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
        ))}
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.9px', padding: '0 8px', margin: '14px 0 6px' }}>Financiar</div>
        {NAV.slice(3).map(item => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500 }}>Demo</div>
          <div style={{ fontSize: 10, color: 'var(--t3)' }}>Admin</div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ item, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
      fontSize: 13, marginBottom: 1, transition: 'all .12s',
      background: active ? 'var(--gbg)' : 'transparent',
      color: active ? 'var(--gtext)' : 'var(--t2)',
      fontWeight: active ? 500 : 400,
    }}>
      <span style={{ width: 15, height: 15, flexShrink: 0, display: 'flex' }}>{item.icon}</span>
      {item.label}
    </div>
  )
}
