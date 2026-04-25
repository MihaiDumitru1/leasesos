# LeaseOS — Firebase + GitHub + Vercel

Aplicație de gestiune contracte spații comerciale. Fără autentificare, acces public.

## Stack
- **React + Vite** — frontend
- **Firebase Firestore** — bază de date cloud
- **GitHub** — stocare cod
- **Vercel** — hosting automat

---

## Setup complet în 20 minute

### 1. Firebase — Baza de date

1. Mergi la [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → nume: `leaseos` → Continue (dezactivează Google Analytics dacă vrei) → Create project
3. **Build → Firestore Database** → Create database → **Start in test mode** → Next → Enable
4. **Project Settings** (roată dințată) → **Your apps** → click iconița `</>` (Web)
5. Înregistrează app cu numele `leaseos` → copiază obiectul `firebaseConfig`

### 2. GitHub — Cod sursă

1. Mergi la [github.com](https://github.com) → **New repository**
2. Nume: `leaseos` → Public → Create repository
3. Uploadează toate fișierele din acest zip:
   - Click **uploading an existing file**
   - Trage tot conținutul folderului
   - Commit changes

### 3. Variabile de mediu

Creează fișierul `.env` în root (nu îl comite pe GitHub — e în .gitignore):
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=leaseos-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=leaseos-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=leaseos-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Vercel — Hosting

1. Mergi la [vercel.com](https://vercel.com) → **Add New Project**
2. **Import Git Repository** → selectează `leaseos` de pe GitHub
3. Framework Preset: **Vite**
4. **Environment Variables** → adaugă toate cele 6 variabile VITE_ din pasul 3
5. **Deploy** → în 2 minute ai link-ul public!

### 5. La fiecare modificare

Orice push pe GitHub → Vercel deployează automat în 1-2 minute.

---

## Dezvoltare locală

```bash
npm install
cp .env.example .env   # completează cu datele Firebase
npm run dev            # → http://localhost:5173
```

## Structura proiectului

```
src/
├── firebase.js          # Configurare Firebase
├── utils.js             # Funcții utilitare
├── App.jsx              # Root component
├── Sidebar.jsx          # Navigare desktop
├── MobileNav.jsx        # Navigare mobile
├── ContractModal.jsx    # Formular creare/editare
├── DetailPanel.jsx      # Panou detalii contract
└── pages/
    ├── Dashboard.jsx    # KPIs + tabel
    ├── Contracts.jsx    # Lista contracte
    ├── Tenants.jsx      # Chiriași
    ├── Payments.jsx     # Plăți
    └── Reports.jsx      # Rent roll
```
