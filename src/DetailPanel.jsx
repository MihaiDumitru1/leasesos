import React from 'react'
import { db } from './firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { fmtEur, fmtDate, daysLeft, progressPct, STATUS, statusColor, avColor, initials, showToast } from './utils'

export default function DetailPanel({ lease, onClose, onEdit, onDeleted }) {
  if (!lease) return null

  const col = avColor(lease.tenant_name || '')
  const monthly = (lease.area_sqm || 0) * (lease.rent_eur_sqm || 0)
  const d = daysLeft(lease.end_date)
  const pct = progressPct(lease.start_date, lease.end_date)
  const sc = STATUS[lease.status] || STATUS.active

  async function handleDelete() {
    if (!confirm('Ștergi acest contract? Acțiunea este ireversibilă.')) return
    await deleteDoc(doc(db, 'leases', lease.id))
    showToast('Contract șters.', 'ok')
    onDeleted()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 400 }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(460px, 100vw)',
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,.08)', zIndex: 401,
        display: 'flex', flexDirection: 'column',
        animation: 'panelIn .2s ease',
      }}>
        <style>{`@keyframes panelIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{lease.tenant_name}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
              {lease.contract_no}{lease.cui ? ' · ' + lease.cui : ''}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--t2)' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* Avatar + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="av" style={{ width: 44, height: 44, borderRadius: 12, fontSize: 15, background: col.bg, color: col.c }}>
              {initials(lease.tenant_name)}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{lease.tenant_name}</div>
              <span className={`badge ${sc.cls}`} style={{ marginTop: 4, display: 'inline-flex' }}>{sc.label}</span>
            </div>
          </div>

          {/* Progress bar */}
          {lease.start_date && lease.end_date && (
            <div style={{ background: 'var(--s2)', borderRadius: 9, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'DM Mono, monospace', marginBottom: 6 }}>
                {fmtDate(lease.start_date)} → {fmtDate(lease.end_date)}
                {d !== null ? ` · ${d > 0 ? d + ' zile rămase' : 'Expirat'}` : ''}
              </div>
              <div className="prog" style={{ width: '100%' }}>
                <div className="prog-fill" style={{ width: pct + '%', background: statusColor(lease.status) }} />
              </div>
            </div>
          )}

          {/* Detalii */}
          <Section title="Spațiu & Financiar">
            <DGrid>
              <DItem label="Proprietate" val={lease.property} />
              <DItem label="Etaj" val={lease.floor} />
              <DItem label="Suprafață" val={lease.area_sqm ? lease.area_sqm.toLocaleString('ro-RO') + ' m²' : '—'} mono />
              <DItem label="€/m²/lună" val={lease.rent_eur_sqm ? '€' + lease.rent_eur_sqm : '—'} mono />
              <DItem label="Chirie lunară" val={monthly ? fmtEur(monthly) : '—'} mono green />
              <DItem label="Valoare anuală" val={monthly ? fmtEur(monthly * 12) : '—'} mono />
            </DGrid>
          </Section>

          {(lease.indexation || lease.break_option || lease.deposit || lease.fitout) && (
            <Section title="Clauze contractuale">
              {[['Indexare', lease.indexation], ['Break option', lease.break_option], ['Garanție', lease.deposit], ['Fit-out', lease.fitout]]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 8, fontSize: 13, padding: '8px 12px', background: 'var(--s2)', borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginTop: 5, flexShrink: 0 }} />
                    <div><strong>{k}:</strong> {v}</div>
                  </div>
                ))}
            </Section>
          )}

          {lease.contact && (
            <Section title="Contact chiriaș">
              <div style={{ fontSize: 13, color: 'var(--t2)' }}>{lease.contact}</div>
            </Section>
          )}

          {lease.notes && (
            <Section title="Note">
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{lease.notes}</div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-p" style={{ flex: 1, justifyContent: 'center' }} onClick={onEdit}>✏️ Editează</button>
          <button className="btn btn-d btn-sm" onClick={handleDelete}>Șterge</button>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function DGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>{children}</div>
}

function DItem({ label, val, mono, green }) {
  return (
    <div style={{ background: 'var(--s2)', borderRadius: 9, padding: '10px 13px' }}>
      <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 500, fontFamily: mono ? 'DM Mono, monospace' : undefined, color: green ? 'var(--green)' : undefined }}>
        {val || '—'}
      </div>
    </div>
  )
}
