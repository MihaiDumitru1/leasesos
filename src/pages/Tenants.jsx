import React from 'react'
import { fmtEur, avColor, initials } from '../utils'

export default function Tenants({ leases }) {
  const tenants = leases.reduce((acc, l) => {
    const k = l.tenant_name || 'Necunoscut'
    if (!acc[k]) acc[k] = { contracts: 0, sqm: 0, monthly: 0, cui: l.cui, contact: l.contact }
    acc[k].contracts++
    acc[k].sqm += l.area_sqm || 0
    acc[k].monthly += (l.area_sqm || 0) * (l.rent_eur_sqm || 0)
    return acc
  }, {})

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 15, fontWeight: 500 }}>Chiriași</h1>
        <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{Object.keys(tenants).length} chiriași în portofoliu</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {Object.entries(tenants).map(([name, t]) => {
          const col = avColor(name)
          return (
            <div key={name} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="av" style={{ width: 40, height: 40, borderRadius: 10, fontSize: 14, background: col.bg, color: col.c }}>{initials(name)}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{name}</div>
                  {t.cui && <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>{t.cui}</div>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[['Contracte', t.contracts], ['Suprafață', t.sqm.toLocaleString('ro-RO') + ' m²'], ['Lunar', fmtEur(t.monthly)]]
                  .map(([label, val]) => (
                    <div key={label} style={{ background: 'var(--s2)', borderRadius: 8, padding: '9px 11px' }}>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontWeight: 500, fontSize: 12 }}>{val}</div>
                    </div>
                  ))}
              </div>
              {t.contact && <div style={{ fontSize: 12, color: 'var(--t2)' }}>{t.contact}</div>}
            </div>
          )
        })}
        {Object.keys(tenants).length === 0 && (
          <div className="empty" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">👥</div>
            <h3>Niciun chiriaș</h3>
            <p>Adaugă contracte pentru a vedea chiriașii.</p>
          </div>
        )}
      </div>
    </div>
  )
}
