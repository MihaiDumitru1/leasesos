import React from 'react'
import { fmtEur, fmtDate, daysLeft, progressPct, STATUS, statusColor, avColor, initials } from '../utils'

export default function Dashboard({ leases, onRowClick, onNewContract, isMobile }) {
  const active = leases.filter(l => l.status !== 'expired')
  const totalSqm = active.reduce((s, l) => s + (l.area_sqm || 0), 0)
  const monthly = active.reduce((s, l) => s + (l.area_sqm || 0) * (l.rent_eur_sqm || 0), 0)
  const expCnt = leases.filter(l => l.status === 'expiring').length
  const wault = monthly > 0
    ? (active.reduce((s, l) => { const d = daysLeft(l.end_date); return s + (d > 0 ? (d / 365) * (l.area_sqm || 0) * (l.rent_eur_sqm || 0) : 0) }, 0) / monthly).toFixed(1)
    : '—'

  const byProperty = active.reduce((acc, l) => {
    const k = l.property || 'Necunoscut'
    acc[k] = (acc[k] || 0) + (l.area_sqm || 0) * (l.rent_eur_sqm || 0)
    return acc
  }, {})

  const byStatus = ['active', 'expiring', 'negotiation', 'expired'].map(s => ({
    s, cnt: leases.filter(l => l.status === s).length, label: STATUS[s].label,
  }))

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi accent">
          <div className="kpi-label">Contracte</div>
          <div className="kpi-val">{leases.length}</div>
          <div className="kpi-sub">{leases.filter(l => l.status === 'active').length} active · {expCnt} expiră</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Suprafață</div>
          <div className="kpi-val">{totalSqm.toLocaleString('ro-RO')} <span style={{ fontSize: 14, color: 'var(--t3)' }}>m²</span></div>
          <div className="kpi-sub">portofoliu total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Venit lunar</div>
          <div className="kpi-val" style={{ fontSize: isMobile ? 18 : 26 }}>{fmtEur(monthly)}</div>
          <div className="kpi-sub">contracte active</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">WAULT</div>
          <div className="kpi-val">{wault} <span style={{ fontSize: 14, color: 'var(--t3)' }}>ani</span></div>
          <div className="kpi-sub">durată medie</div>
        </div>
      </div>

      {/* Mobile layout: stacked */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Contracte recente ca carduri */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd">
              <span className="card-title">Contracte recente</span>
              <button className="btn btn-p btn-sm" onClick={onNewContract}>+ Nou</button>
            </div>
            {leases.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <h3>Niciun contract</h3>
                <p>Apasă "+ Nou" pentru a începe.</p>
              </div>
            ) : (
              <div>
                {leases.slice(0, 5).map(l => <MobileLeaseCard key={l.id} l={l} onClick={() => onRowClick(l)} />)}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd"><span className="card-title">Pe status</span></div>
            <div style={{ padding: '14px 16px' }}>
              {byStatus.map(({ s, cnt, label }) => {
                const pct = leases.length ? Math.round(cnt / leases.length * 100) : 0
                return (
                  <div key={s} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>{label}</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{cnt}</span>
                    </div>
                    <div className="prog" style={{ width: '100%' }}>
                      <div className="prog-fill" style={{ width: pct + '%', background: statusColor(s) }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop layout: 2 coloane */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 16 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd">
              <span className="card-title">Contracte recente</span>
              <button className="btn btn-p btn-sm" onClick={onNewContract}>+ Contract nou</button>
            </div>
            {leases.length === 0 ? <Empty /> : (
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Chiriaș</th><th>Proprietate</th><th>Suprafață</th>
                      <th>Chirie/lună</th><th>Expirare</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leases.slice(0, 8).map(l => <LeaseRow key={l.id} l={l} onClick={() => onRowClick(l)} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-hd"><span className="card-title">Pe status</span></div>
              <div style={{ padding: '14px 16px' }}>
                {byStatus.map(({ s, cnt, label }) => {
                  const pct = leases.length ? Math.round(cnt / leases.length * 100) : 0
                  return (
                    <div key={s} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>{label}</span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{cnt}</span>
                      </div>
                      <div className="prog" style={{ width: '100%' }}>
                        <div className="prog-fill" style={{ width: pct + '%', background: statusColor(s) }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-hd"><span className="card-title">Venit / proprietate</span></div>
              <div style={{ padding: '14px 16px' }}>
                {Object.entries(byProperty).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                    <span style={{ color: 'var(--t2)' }}>{k}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{fmtEur(v)}</span>
                  </div>
                ))}
                {Object.keys(byProperty).length === 0 && <div style={{ fontSize: 12, color: 'var(--t3)' }}>—</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Card pentru mobile
function MobileLeaseCard({ l, onClick }) {
  const col = avColor(l.tenant_name || '')
  const monthly = (l.area_sqm || 0) * (l.rent_eur_sqm || 0)
  const d = daysLeft(l.end_date)
  const sc = STATUS[l.status] || STATUS.active
  return (
    <div onClick={onClick} style={{
      padding: '12px 16px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div className="av" style={{ width: 36, height: 36, fontSize: 12, background: col.bg, color: col.c, flexShrink: 0 }}>
        {initials(l.tenant_name || '?')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.tenant_name}</div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{l.property || '—'}{l.floor ? ' · ' + l.floor : ''}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: 13 }}>{monthly ? fmtEur(monthly) : '—'}</div>
        <span className={`badge ${sc.cls}`} style={{ fontSize: 10, padding: '2px 7px' }}>{sc.label}</span>
      </div>
    </div>
  )
}

// Row pentru desktop
function LeaseRow({ l, onClick }) {
  const col = avColor(l.tenant_name || '')
  const monthly = (l.area_sqm || 0) * (l.rent_eur_sqm || 0)
  const d = daysLeft(l.end_date)
  const pct = progressPct(l.start_date, l.end_date)
  const sc = STATUS[l.status] || STATUS.active
  return (
    <tr className="clickable" onClick={onClick}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="av" style={{ width: 28, height: 28, fontSize: 10, background: col.bg, color: col.c }}>{initials(l.tenant_name || '?')}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{l.tenant_name}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>{l.cui || ''}</div>
          </div>
        </div>
      </td>
      <td>
        <div>{l.property || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{l.floor || ''}</div>
      </td>
      <td style={{ fontFamily: 'DM Mono, monospace' }}>{l.area_sqm ? l.area_sqm.toLocaleString('ro-RO') + ' m²' : '—'}</td>
      <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{monthly ? fmtEur(monthly) : '—'}</td>
      <td>
        <div style={{ fontSize: 12 }}>{l.end_date ? fmtDate(l.end_date) : '—'}</div>
        {l.start_date && l.end_date && (
          <>
            <div className="prog" style={{ width: 80 }}>
              <div className="prog-fill" style={{ width: pct + '%', background: statusColor(l.status) }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
              {d !== null ? (d > 0 ? d + ' zile' : 'expirat') : ''}
            </div>
          </>
        )}
      </td>
      <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
    </tr>
  )
}

function Empty() {
  return (
    <div className="empty">
      <div className="empty-icon">📋</div>
      <h3>Niciun contract</h3>
      <p>Apasă "+ Contract nou" pentru a începe.</p>
    </div>
  )
}
