import React, { useState } from 'react'
import { fmtEur, fmtDate, daysLeft, progressPct, STATUS, statusColor, avColor, initials } from '../utils'

const FILTERS = [
  { v: 'all', l: 'Toate' },
  { v: 'active', l: 'Active' },
  { v: 'expiring', l: 'Expiră curând' },
  { v: 'negotiation', l: 'Reînnoire' },
  { v: 'expired', l: 'Expirate' },
]

export default function Contracts({ leases, onRowClick, onNewContract }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? leases : leases.filter(l => l.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500 }}>Contracte</h1>
          <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{filtered.length} contracte</p>
        </div>
        <button className="btn btn-p" onClick={onNewContract}>+ Contract nou</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Filter pills */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const cnt = f.v === 'all' ? leases.length : leases.filter(l => l.status === f.v).length
            return (
              <span key={f.v} onClick={() => setFilter(f.v)} style={{
                padding: '4px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: '1px solid', transition: 'all .12s',
                background: filter === f.v ? 'var(--text)' : 'var(--surface)',
                color: filter === f.v ? '#fff' : 'var(--t2)',
                borderColor: filter === f.v ? 'var(--text)' : 'var(--border2)',
              }}>
                {f.l} ({cnt})
              </span>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div><h3>Niciun contract</h3><p>Niciun contract pentru filtrul selectat.</p></div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Chiriaș</th><th>Proprietate</th><th>Suprafață</th>
                  <th>€/m²</th><th>Chirie/lună</th><th>Perioadă</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const col = avColor(l.tenant_name || '')
                  const monthly = (l.area_sqm || 0) * (l.rent_eur_sqm || 0)
                  const d = daysLeft(l.end_date)
                  const pct = progressPct(l.start_date, l.end_date)
                  const sc = STATUS[l.status] || STATUS.active
                  return (
                    <tr key={l.id} className="clickable" onClick={() => onRowClick(l)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div className="av" style={{ width: 28, height: 28, fontSize: 10, background: col.bg, color: col.c }}>{initials(l.tenant_name || '?')}</div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{l.tenant_name}</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>{l.contract_no}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{l.property || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{l.floor || ''}</div>
                      </td>
                      <td style={{ fontFamily: 'DM Mono, monospace' }}>{l.area_sqm ? l.area_sqm.toLocaleString('ro-RO') + ' m²' : '—'}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace' }}>{l.rent_eur_sqm ? '€' + l.rent_eur_sqm : '—'}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{monthly ? fmtEur(monthly) : '—'}</td>
                      <td>
                        <div style={{ fontSize: 11, color: 'var(--t2)' }}>{l.start_date ? fmtDate(l.start_date) : '—'}</div>
                        {l.start_date && l.end_date && (
                          <div className="prog" style={{ width: 90 }}>
                            <div className="prog-fill" style={{ width: pct + '%', background: statusColor(l.status) }} />
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>
                          {l.end_date ? fmtDate(l.end_date) : '—'}{d !== null ? ' · ' + (d > 0 ? d + 'z' : 'exp.') : ''}
                        </div>
                      </td>
                      <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
