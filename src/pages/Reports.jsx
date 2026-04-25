import React from 'react'
import { fmtEur, fmtDate, daysLeft } from '../utils'

export default function Reports({ leases }) {
  const active = leases.filter(l => l.status !== 'expired')
  const totalSqm = active.reduce((s, l) => s + (l.area_sqm || 0), 0)
  const monthly = active.reduce((s, l) => s + (l.area_sqm || 0) * (l.rent_eur_sqm || 0), 0)
  const annual = monthly * 12
  const avgRent = totalSqm > 0 ? monthly / totalSqm : 0
  const wault = monthly > 0
    ? (active.reduce((s, l) => { const d = daysLeft(l.end_date); return s + (d > 0 ? (d / 365) * (l.area_sqm || 0) * (l.rent_eur_sqm || 0) : 0) }, 0) / monthly).toFixed(2)
    : '—'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 15, fontWeight: 500 }}>Rapoarte & Rent Roll</h1>
        <div style={{ fontSize: 12, color: 'var(--t2)', fontFamily: 'DM Mono, monospace' }}>
          {new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {[
          ['Suprafață totală', totalSqm.toLocaleString('ro-RO') + ' m²'],
          ['Venit lunar (GRI)', fmtEur(monthly)],
          ['Valoare anuală (ARV)', fmtEur(annual)],
          ['WAULT', wault + ' ani'],
        ].map(([l, v]) => (
          <div key={l} className="kpi">
            <div className="kpi-label">{l}</div>
            <div className="kpi-val" style={{ fontSize: 22 }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-hd"><span className="card-title">Rent Roll complet</span></div>
        {leases.length === 0 ? (
          <div className="empty"><div className="empty-icon">📊</div><h3>Niciun contract</h3><p>Adaugă contracte pentru rent roll.</p></div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Contract</th><th>Chiriaș</th><th>Proprietate</th>
                  <th>m²</th><th>€/m²</th><th>Lunar</th><th>Anual</th>
                  <th>Expirare</th><th>Zile rămase</th>
                </tr>
              </thead>
              <tbody>
                {leases.map(l => {
                  const m = Math.round((l.area_sqm || 0) * (l.rent_eur_sqm || 0))
                  const d = daysLeft(l.end_date)
                  return (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--t2)' }}>{l.contract_no}</td>
                      <td style={{ fontWeight: 500 }}>{l.tenant_name}</td>
                      <td style={{ fontSize: 12, color: 'var(--t2)' }}>{l.property || '—'}{l.floor ? ' / ' + l.floor : ''}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace' }}>{l.area_sqm?.toLocaleString('ro-RO') || '—'}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace' }}>{l.rent_eur_sqm ? '€' + l.rent_eur_sqm : '—'}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{m ? fmtEur(m) : '—'}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace' }}>{m ? fmtEur(m * 12) : '—'}</td>
                      <td style={{ fontSize: 12 }}>{l.end_date ? fmtDate(l.end_date) : '—'}</td>
                      <td style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 12,
                        color: d !== null && d < 180 ? 'var(--warn)' : d !== null && d < 0 ? 'var(--red)' : 'var(--t2)',
                      }}>
                        {d !== null ? (d > 0 ? d + ' zile' : 'Expirat') : '—'}
                      </td>
                    </tr>
                  )
                })}
                {/* Total row */}
                <tr style={{ background: 'var(--s2)', fontWeight: 500 }}>
                  <td colSpan={3}>TOTAL</td>
                  <td style={{ fontFamily: 'DM Mono, monospace' }}>{totalSqm.toLocaleString('ro-RO')}</td>
                  <td style={{ fontFamily: 'DM Mono, monospace' }}>€{avgRent.toFixed(2)}</td>
                  <td style={{ fontFamily: 'DM Mono, monospace' }}>{fmtEur(monthly)}</td>
                  <td style={{ fontFamily: 'DM Mono, monospace' }}>{fmtEur(annual)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
