import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { fmtEur, avColor, initials, PAYMENT_STATUS, showToast } from '../utils'

export default function Payments({ leases }) {
  const [payments, setPayments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ lease_id: '', period: '', amount_eur: '', status: 'paid', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadPayments() }, [])

  async function loadPayments() {
    const snap = await getDocs(query(collection(db, 'payments'), orderBy('created_at', 'desc')))
    setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  async function handleAdd() {
    if (!form.lease_id || !form.period || !form.amount_eur) {
      alert('Contract, perioadă și sumă sunt obligatorii.'); return
    }
    setSaving(true)
    const lease = leases.find(l => l.id === form.lease_id)
    await addDoc(collection(db, 'payments'), {
      ...form,
      amount_eur: parseFloat(form.amount_eur),
      tenant_name: lease?.tenant_name || '',
      contract_no: lease?.contract_no || '',
      created_at: serverTimestamp(),
    })
    showToast('Plată salvată!', 'ok')
    setShowForm(false)
    setForm({ lease_id: '', period: '', amount_eur: '', status: 'paid', notes: '' })
    loadPayments()
    setSaving(false)
  }

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount_eur, 0)
  const totalPend = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount_eur, 0)
  const totalLate = payments.filter(p => p.status === 'late').reduce((s, p) => s + p.amount_eur, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 15, fontWeight: 500 }}>Plăți</h1>
        <button className="btn btn-p btn-sm" onClick={() => setShowForm(v => !v)}>+ Plată nouă</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[['Total încasat', totalPaid, 'var(--green)'], ['În așteptare', totalPend, 'var(--warn)'], ['Restanțe', totalLate, 'var(--red)']].map(([l, v, c]) => (
          <div key={l} className="kpi">
            <div className="kpi-label">{l}</div>
            <div className="kpi-val" style={{ fontSize: 22, color: c }}>{fmtEur(v)}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 14 }}>Plată nouă</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label>Contract</label>
              <select value={form.lease_id} onChange={e => setForm(f => ({ ...f, lease_id: e.target.value }))}>
                <option value="">Selectează...</option>
                {leases.map(l => <option key={l.id} value={l.id}>{l.tenant_name} · {l.contract_no}</option>)}
              </select>
            </div>
            <div><label>Perioadă</label><input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="Aprilie 2026" /></div>
            <div><label>Sumă (€)</label><input type="number" value={form.amount_eur} onChange={e => setForm(f => ({ ...f, amount_eur: e.target.value }))} placeholder="15000" /></div>
            <div><label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="paid">Încasat</option>
                <option value="pending">În așteptare</option>
                <option value="late">Restanță</option>
              </select>
            </div>
            <div><label>Note</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Opțional" /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={() => setShowForm(false)}>Anulează</button>
            <button className="btn btn-p btn-sm" onClick={handleAdd} disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</button>
          </div>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-hd"><span className="card-title">Toate plățile</span></div>
        {payments.length === 0 ? (
          <div className="empty"><div className="empty-icon">💳</div><h3>Nicio plată</h3><p>Adaugă prima plată.</p></div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Chiriaș</th><th>Contract</th><th>Perioadă</th><th>Sumă</th><th>Status</th><th>Note</th></tr></thead>
              <tbody>
                {payments.map(p => {
                  const col = avColor(p.tenant_name || '')
                  const ps = PAYMENT_STATUS[p.status] || { label: p.status, color: '#888' }
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="av" style={{ width: 24, height: 24, borderRadius: 6, fontSize: 9, background: col.bg, color: col.c }}>{initials(p.tenant_name || '?')}</div>
                          <span>{p.tenant_name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--t2)', fontFamily: 'DM Mono, monospace' }}>{p.contract_no || '—'}</td>
                      <td>{p.period}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{fmtEur(p.amount_eur)}</td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 12, background: ps.color + '22', color: ps.color }}>
                          {ps.label}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--t2)' }}>{p.notes || '—'}</td>
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
