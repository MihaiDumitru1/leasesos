import React, { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { showToast, fmtEur } from './utils'

const EMPTY = {
  contract_no: '', status: 'active', tenant_name: '', cui: '',
  property: '', floor: '', area_sqm: '', rent_eur_sqm: '',
  start_date: '', end_date: '', indexation: 'HICP anual, cap 3%',
  break_option: '', deposit: '3 chirii', fitout: '', contact: '', notes: '',
}

export default function ContractModal({ open, onClose, editing, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({
        contract_no: editing.contract_no || '',
        status: editing.status || 'active',
        tenant_name: editing.tenant_name || '',
        cui: editing.cui || '',
        property: editing.property || '',
        floor: editing.floor || '',
        area_sqm: editing.area_sqm || '',
        rent_eur_sqm: editing.rent_eur_sqm || '',
        start_date: editing.start_date || '',
        end_date: editing.end_date || '',
        indexation: editing.indexation || '',
        break_option: editing.break_option || '',
        deposit: editing.deposit || '',
        fitout: editing.fitout || '',
        contact: editing.contact || '',
        notes: editing.notes || '',
      })
    } else {
      setForm({ ...EMPTY, contract_no: `CTR-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}` })
    }
    setError('')
  }, [open, editing])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const monthly = (parseFloat(form.area_sqm) || 0) * (parseFloat(form.rent_eur_sqm) || 0)

  async function handleSave() {
    if (!form.contract_no.trim() || !form.tenant_name.trim()) {
      setError('Nr. contract și Chiriaș sunt obligatorii.')
      return
    }
    setLoading(true); setError('')
    const payload = {
      ...form,
      area_sqm: parseFloat(form.area_sqm) || null,
      rent_eur_sqm: parseFloat(form.rent_eur_sqm) || null,
      updated_at: serverTimestamp(),
    }
    try {
      if (editing?.id) {
        await updateDoc(doc(db, 'leases', editing.id), payload)
        showToast('Contract actualizat!', 'ok')
      } else {
        payload.created_at = serverTimestamp()
        await addDoc(collection(db, 'leases'), payload)
        showToast('Contract creat!', 'ok')
      }
      setLoading(false)
      onSaved()
      onClose()
    } catch (e) {
      setError('Eroare: ' + e.message)
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      zIndex: 500, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'center', padding: '0',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: '14px 14px 0 0',
        width: '100%', maxWidth: 680,
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,.15)',
        animation: 'slideUp .2s ease',
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{editing ? 'Editează contract' : 'Contract nou'}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--t2)' }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          <Grid>
            <Field label="Nr. contract"><input value={form.contract_no} onChange={e => set('contract_no', e.target.value)} /></Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Activ</option>
                <option value="expiring">Expiră curând</option>
                <option value="negotiation">Reînnoire</option>
                <option value="expired">Expirat</option>
              </select>
            </Field>
            <Field label="Chiriaș (companie)"><input value={form.tenant_name} onChange={e => set('tenant_name', e.target.value)} placeholder="Medicover România SA" /></Field>
            <Field label="CUI"><input value={form.cui} onChange={e => set('cui', e.target.value)} placeholder="RO12345678" /></Field>
            <Field label="Proprietate"><input value={form.property} onChange={e => set('property', e.target.value)} placeholder="Floreasca Park" /></Field>
            <Field label="Etaj / Unitate"><input value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="Etajul 3" /></Field>

            <SectionTitle>Financiar</SectionTitle>
            <Field label="Suprafață (m²)"><input type="number" value={form.area_sqm} onChange={e => set('area_sqm', e.target.value)} placeholder="1200" /></Field>
            <Field label="Preț €/m²/lună"><input type="number" step="0.5" value={form.rent_eur_sqm} onChange={e => set('rent_eur_sqm', e.target.value)} placeholder="15" /></Field>
            {monthly > 0 && (
              <div style={{ gridColumn: '1/-1', background: 'var(--gbg)', borderRadius: 9, padding: '11px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--gtext)' }}>Chirie lunară estimată</span>
                <strong style={{ fontSize: 14, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>{fmtEur(monthly)} / lună</strong>
              </div>
            )}

            <SectionTitle>Durată</SectionTitle>
            <Field label="Data început"><input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} /></Field>
            <Field label="Data expirare"><input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} /></Field>

            <SectionTitle>Clauze</SectionTitle>
            <Field label="Indexare"><input value={form.indexation} onChange={e => set('indexation', e.target.value)} placeholder="HICP anual, cap 3%" /></Field>
            <Field label="Break option"><input value={form.break_option} onChange={e => set('break_option', e.target.value)} placeholder="ex: 31 dec 2027" /></Field>
            <Field label="Garanție"><input value={form.deposit} onChange={e => set('deposit', e.target.value)} placeholder="3 chirii" /></Field>
            <Field label="Fit-out"><input value={form.fitout} onChange={e => set('fitout', e.target.value)} placeholder="Contribuție proprietar €50.000" /></Field>
            <Field label="Contact chiriaș" full><input value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Ion Popescu · ion@companie.ro · +40 721 000 000" /></Field>
            <Field label="Note" full><textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observații adiționale..." /></Field>
          </Grid>

          {error && <div className="err-box">{error}</div>}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: 'var(--surface)' }}>
          <button className="btn" onClick={onClose}>Anulează</button>
          <button className="btn btn-p" onClick={handleSave} disabled={loading}>
            {loading ? 'Se salvează...' : editing ? 'Salvează modificările' : 'Salvează contractul'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
      {children}
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: full ? '1/-1' : undefined }}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{
      gridColumn: '1/-1', fontSize: 10.5, fontWeight: 500, color: 'var(--t3)',
      textTransform: 'uppercase', letterSpacing: '.8px',
      paddingTop: 6, borderTop: '1px solid var(--border)', marginTop: 2,
    }}>{children}</div>
  )
}
