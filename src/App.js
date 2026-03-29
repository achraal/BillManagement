import React, { useState } from 'react';
import Article from './component/Article';
import Client from './component/Client';
import Facturation from './component/Facturation';

function App() {
  // État pour gérer la navigation entre les pages
  const [pageActive, setPageActive] = useState('facturation');

  // --- STYLES DU DASHBOARD ---
  const s = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: "'Poppins', sans-serif" },

    // Barre latérale (Sidebar)
    sidebar: {
      width: '280px', backgroundColor: '#fff', borderRight: '1px solid #eef2ff',
      padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(65, 88, 208, 0.03)'
    },
    logo: {
      fontSize: '24px', fontWeight: '800', marginBottom: '50px', paddingLeft: '15px',
      background: 'linear-gradient(45deg, #4158D0, #C850C0)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    navItem: (active) => ({
      padding: '16px 20px', borderRadius: '15px', marginBottom: '10px', cursor: 'pointer',
      transition: '0.3s', fontWeight: '600', fontSize: '15px',
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: active ? '#f0f3ff' : 'transparent',
      color: active ? '#4158D0' : '#a0aec0',
    }),

    // Contenu principal
    main: { flex: 1, padding: '20px', overflowY: 'auto' },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '30px', padding: '0 20px'
    },
    userProfile: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }
  };

  // Fonction pour afficher le composant correspondant
  const renduContenu = () => {
    switch (pageActive) {
      case 'articles': return <Article />;
      case 'clients': return <Client />;
      case 'facturation': return <Facturation />;
      default: return <Facturation />;
    }
  };

  return (
    <div style={s.layout}>
      {/* 1. SIDEBAR DE NAVIGATION */}
      <nav style={s.sidebar}>
        <div style={s.logo}>Gestion des Facturations</div>

        <div
          style={s.navItem(pageActive === 'facturation')}
          onClick={() => setPageActive('facturation')}
          className="nav-hover"
        >
          📄 Facturation
        </div>

        <div
          style={s.navItem(pageActive === 'articles')}
          onClick={() => setPageActive('articles')}
          className="nav-hover"
        >
          📦 Stock & Articles
        </div>

        <div
          style={s.navItem(pageActive === 'clients')}
          onClick={() => setPageActive('clients')}
          className="nav-hover"
        >
          👥 Annuaire Clients
        </div>

        <div style={{ marginTop: 'auto', padding: '15px', fontSize: '12px', color: '#cbd5e1', textAlign: 'center' }}>
          © 2026 Chaimaa Achraf  <br /> Dveloppement Front-End Project
        </div>
      </nav>

      {/* 2. CONTENU PRINCIPAL */}
      <main style={s.main}>


        {/* Injection du composant actif */}
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          {renduContenu()}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
        
        .nav-hover:hover {
          background-color: #f8faff !important;
          color: #4158D0 !important;
          transform: translateX(5px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Personnalisation de la scrollbar pour tout le projet */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #4158D0; }
      `}</style>
    </div>
  );
}

export default App;