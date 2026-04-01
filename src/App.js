import React, { useState } from 'react';
import Article from './component/Article';
import Client from './component/Client';
import Facturation from './component/Facturation';
import SuiviFacture from './component/SuiviFacture';
import Dashboard from './component/Dashboard';
import Settings from './component/Settings'; // <--- AJOUTÉ
import Login from './component/Login'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, role, logout } = useAuth();
  const [pageActive, setPageActive] = useState('facturation');

  const s = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: "'Poppins', sans-serif" },
    sidebar: {
      width: '280px', backgroundColor: '#fff', borderRight: '1px solid #eef2ff',
      padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(65, 88, 208, 0.03)'
    },
    logo: {
      fontSize: '22px', fontWeight: '800', marginBottom: '40px', paddingLeft: '15px',
      background: 'linear-gradient(45deg, #4158D0, #C850C0)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    navItem: (active) => ({
      padding: '14px 20px', borderRadius: '15px', marginBottom: '8px', cursor: 'pointer',
      transition: '0.3s', fontWeight: '600', fontSize: '14px',
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: active ? '#f0f3ff' : 'transparent',
      color: active ? '#4158D0' : '#a0aec0',
    }),
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' },
    topBar: {
      height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 40px', backgroundColor: 'transparent'
    },
    contentScroll: { flex: 1, padding: '0 40px 40px 40px', overflowY: 'auto' },
    badgeRole: {
      padding: '5px 12px', borderRadius: '8px', fontSize: '10px',
      backgroundColor: role === 'Admin' ? '#fff0f0' : '#eef2ff',
      color: role === 'Admin' ? '#ff7675' : '#4158D0',
      fontWeight: '900'
    },
    btnLogout: {
      marginTop: 'auto', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2',
      backgroundColor: '#fff', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer',
      transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }
  };

  const renduContenu = () => {
    switch (pageActive) {
      case 'dashboard': return role === 'Admin' ? <Dashboard /> : <Facturation />;
      case 'settings': return role === 'Admin' ? <Settings /> : <Facturation />; // <--- AJOUTÉ
      case 'facturation': return <Facturation />;
      case 'historique': return <SuiviFacture />;
      case 'articles': return <Article />;
      case 'clients': return <Client />;
      default: return <Facturation />;
    }
  };

  if (!user) return <Login />;

  return (
    <div style={s.layout}>
      <nav style={s.sidebar}>
        <div style={s.logo}>Billing Studio Pro</div>

        {role === 'Admin' && (
          <>
            <p style={{fontSize: '10px', color: '#cbd5e1', fontWeight: '800', marginLeft: '20px'}}>ADMINISTRATION</p>
            <div style={s.navItem(pageActive === 'dashboard')} onClick={() => setPageActive('dashboard')} className="nav-hover">
              📈 Dashboard Global
            </div>
            {/* NOUVEAU MENU SETTINGS */}
            <div style={s.navItem(pageActive === 'settings')} onClick={() => setPageActive('settings')} className="nav-hover">
              ⚙️ Paramètres CRUD
            </div>
          </>
        )}

        <p style={{fontSize: '10px', color: '#cbd5e1', fontWeight: '800', marginLeft: '20px', marginTop: '20px'}}>GESTION</p>
        
        <div style={s.navItem(pageActive === 'facturation')} onClick={() => setPageActive('facturation')} className="nav-hover">
          📄 Créer Facture
        </div>

        <div style={s.navItem(pageActive === 'historique')} onClick={() => setPageActive('historique')} className="nav-hover">
          📜 Suivi & Paiements
        </div>

        <div style={s.navItem(pageActive === 'articles')} onClick={() => setPageActive('articles')} className="nav-hover">
          📦 Catalogue Articles
        </div>

        <div style={s.navItem(pageActive === 'clients')} onClick={() => setPageActive('clients')} className="nav-hover">
          👥 Clients
        </div>

        <button style={s.btnLogout} onClick={logout} className="logout-hover">
          🚪 Déconnexion
        </button>
      </nav>

      <main style={s.main}>
        <header style={s.topBar}>
          <div style={{color: '#94a3b8', fontSize: '14px'}}>
            Bienvenue, <b>{user.email}</b> 👋
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
             <span style={s.badgeRole}>{role?.toUpperCase()}</span>
             <div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4158D0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                {role === 'Admin' ? 'A' : 'M'}
             </div>
          </div>
        </header>

        <div style={s.contentScroll}>
          <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            {renduContenu()}
          </div>
        </div>
      </main>

      <style>{`
        .nav-hover:hover { transform: translateX(8px); color: #4158D0 !important; }
        .logout-hover:hover { background-color: #fef2f2 !important; transform: scale(0.98); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}