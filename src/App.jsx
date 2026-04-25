import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { db } from './firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import ContractModal from './ContractModal'
import DetailPanel from './DetailPanel'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import Reports from './pages/Reports'

const PAGE_TITLES = {
  '/': 'Dashboard', '/contracts': 'Contracte', '/tenants': 'Chiriași',
  '/payments': 'Plăți', '/reports': 'Rapoarte',
}

function AppInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [leases, setLeases] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detailLease, setDetailLease] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 769)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => { loadLeases() }, [])

  async function loadLeases() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'leases'), orderBy('created_at', 'desc')))
      setLeases(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error('Firebase error:', e)
    }
    setLoading(false)
  }

  function openNewContract() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(lease) {
    setDetailLease(null)
    setEditing(lease)
    setModalOpen(true)
  }

  // Map location to page id for MobileNav/Sidebar
  const pathToPage = {
    '/': 'dash', '/contracts': 'contracts', '/tenants': 'tenants',
    '/payments': 'payments', '/reports': 'reports',
  }
  const pageToPath = {
    'dash': '/', 'contracts': '/contracts', 'tenants': '/tenants',
    'payments': '/payments', 'reports': '/reports',
  }
  const currentPage = pathToPage[location.pathname] || 'dash'
  const title = PAGE_TITLES[location.pathname] || 'Dashboard'
  const expiringCount = leases.filter(l => l.status === 'expiring').length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!isMobile && (
        <Sidebar
          page={currentPage}
          setPage={p => navigate(pageToPath[p])}
          onNewContract={openNewContract}
        />
      )}

      <div style={{ marginLeft: isMobile ? 0 : 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          height: 52, padding: '0 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: 13, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
                <div style={{ width: 24, height: 24, background: 'var(--green)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6" height="7" rx="1.5" fill="white"/>
                    <rect x="10" y="2" width="6" height="4" rx="1.5" fill="white"/>
                    <rect x="10" y="9" width="6" height="7" rx="1.5" fill="white"/>
                    <rect x="2" y="12" width="6" height="4" rx="1.5" fill="white"/>
                  </svg>
                </div>
              </div>
            )}
            LeaseOS › <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{title}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {expiringCount > 0 && !isMobile && (
              <div style={{ fontSize: 11, background: 'var(--wbg)', color: 'var(--warn)', padding: '4px 10px', borderRadius: 20, fontFamily: 'DM Mono, monospace' }}>
                {expiringCount} expiră curând
              </div>
            )}
            {!isMobile && (
              <button className="btn btn-p btn-sm" onClick={openNewContract}>+ Contract nou</button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: isMobile ? '16px 14px' : 24, flex: 1, paddingBottom: isMobile ? 76 : 24 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--t3)' }}>
              Se încarcă...
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard leases={leases} onRowClick={setDetailLease} onNewContract={openNewContract} />} />
              <Route path="/contracts" element={<Contracts leases={leases} onRowClick={setDetailLease} onNewContract={openNewContract} />} />
              <Route path="/tenants" element={<Tenants leases={leases} />} />
              <Route path="/payments" element={<Payments leases={leases} />} />
              <Route path="/reports" element={<Reports leases={leases} />} />
            </Routes>
          )}
        </div>
      </div>

      {isMobile && (
        <MobileNav
          page={currentPage}
          setPage={p => navigate(pageToPath[p])}
          onNew={openNewContract}
        />
      )}

      <ContractModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={loadLeases}
      />

      {detailLease && (
        <DetailPanel
          lease={detailLease}
          onClose={() => setDetailLease(null)}
          onEdit={() => openEdit(detailLease)}
          onDeleted={loadLeases}
        />
      )}

      <div id="toast" className="toast" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

