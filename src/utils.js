export const fmtEur = (n) => '€' + Math.round(n || 0).toLocaleString('ro-RO')

export const fmtDate = (d) => {
  if (!d) return '—'
  const date = d?.toDate ? d.toDate() : new Date(d)
  return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const daysLeft = (d) => {
  if (!d) return null
  const date = d?.toDate ? d.toDate() : new Date(d)
  return Math.ceil((date - new Date()) / 86400000)
}

export const progressPct = (start, end) => {
  if (!start || !end) return 0
  const s = (start?.toDate ? start.toDate() : new Date(start)).getTime()
  const e = (end?.toDate ? end.toDate() : new Date(end)).getTime()
  return Math.min(100, Math.max(0, Math.round(((Date.now() - s) / (e - s)) * 100)))
}

export const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')

const AV_COLORS = [
  { bg: '#B5D4F4', c: '#0C447C' }, { bg: '#FAC775', c: '#633806' },
  { bg: '#C0DD97', c: '#27500A' }, { bg: '#9FE1CB', c: '#085041' },
  { bg: '#F4C0D1', c: '#72243E' }, { bg: '#CCC9F7', c: '#3C3489' },
  { bg: '#FAC8A0', c: '#7A3810' },
]
export const avColor = (str = '') => AV_COLORS[(str.charCodeAt(0) || 0) % AV_COLORS.length]

export const STATUS = {
  active:      { label: 'Activ',         cls: 'ba' },
  expiring:    { label: 'Expiră curând', cls: 'be' },
  negotiation: { label: 'Reînnoire',     cls: 'bn' },
  expired:     { label: 'Expirat',       cls: 'bx' },
}

export const statusColor = (s) =>
  s === 'expiring' ? '#8C5A0A' : s === 'negotiation' ? '#1A4A7A' : s === 'expired' ? '#8B2020' : '#2A5C45'

export const PAYMENT_STATUS = {
  paid:    { label: 'Încasat',      color: '#1D9E75' },
  pending: { label: 'Așteptare',    color: '#8C5A0A' },
  late:    { label: 'Restanță',     color: '#8B2020' },
}

let toastTimer = null
export const showToast = (msg, type = '') => {
  const t = document.getElementById('toast')
  if (!t) return
  t.textContent = msg
  t.className = 'toast show ' + type
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { t.className = 'toast' }, 2800)
}
