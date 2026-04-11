// // // import React, { useState } from 'react';
// // // import Article from './component/Article';
// // // import Client from './component/Client';
// // // import Facturation from './component/Facturation';
// // // import SuiviFacture from './component/SuiviFacture';
// // // import Dashboard from './component/Dashboard';
// // // import Settings from './component/Settings'; // <--- AJOUTÉ
// // // import Login from './component/Login'; 
// // // import { AuthProvider, useAuth } from './contexts/AuthContext';

// // // function AppContent() {
// // //   const { user, role, logout } = useAuth();
// // //   const [pageActive, setPageActive] = useState('facturation');

// // //   const s = {
// // //     layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: "'Poppins', sans-serif" },
// // //     sidebar: {
// // //       width: '280px', backgroundColor: '#fff', borderRight: '1px solid #eef2ff',
// // //       padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(65, 88, 208, 0.03)'
// // //     },
// // //     logo: {
// // //       fontSize: '22px', fontWeight: '800', marginBottom: '40px', paddingLeft: '15px',
// // //       background: 'linear-gradient(45deg, #4158D0, #C850C0)',
// // //       WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
// // //     },
// // //     navItem: (active) => ({
// // //       padding: '14px 20px', borderRadius: '15px', marginBottom: '8px', cursor: 'pointer',
// // //       transition: '0.3s', fontWeight: '600', fontSize: '14px',
// // //       display: 'flex', alignItems: 'center', gap: '12px',
// // //       backgroundColor: active ? '#f0f3ff' : 'transparent',
// // //       color: active ? '#4158D0' : '#a0aec0',
// // //     }),
// // //     main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' },
// // //     topBar: {
// // //       height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
// // //       padding: '0 40px', backgroundColor: 'transparent'
// // //     },
// // //     contentScroll: { flex: 1, padding: '0 40px 40px 40px', overflowY: 'auto' },
// // //     badgeRole: {
// // //       padding: '5px 12px', borderRadius: '8px', fontSize: '10px',
// // //       backgroundColor: role === 'Admin' ? '#fff0f0' : '#eef2ff',
// // //       color: role === 'Admin' ? '#ff7675' : '#4158D0',
// // //       fontWeight: '900'
// // //     },
// // //     btnLogout: {
// // //       marginTop: 'auto', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2',
// // //       backgroundColor: '#fff', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer',
// // //       transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
// // //     }
// // //   };

// // //   const renduContenu = () => {
// // //     switch (pageActive) {
// // //       case 'dashboard': return role === 'Admin' ? <Dashboard /> : <Facturation />;
// // //       case 'settings': return role === 'Admin' ? <Settings /> : <Facturation />; // <--- AJOUTÉ
// // //       case 'facturation': return <Facturation />;
// // //       case 'historique': return <SuiviFacture />;
// // //       case 'articles': return <Article />;
// // //       case 'clients': return <Client />;
// // //       default: return <Facturation />;
// // //     }
// // //   };

// // //   if (!user) return <Login />;

// // //   return (
// // //     <div style={s.layout}>
// // //       <nav style={s.sidebar}>
// // //         <div style={s.logo}>Billing Studio Pro</div>

// // //         {role === 'Admin' && (
// // //           <>
// // //             <p style={{fontSize: '10px', color: '#cbd5e1', fontWeight: '800', marginLeft: '20px'}}>ADMINISTRATION</p>
// // //             <div style={s.navItem(pageActive === 'dashboard')} onClick={() => setPageActive('dashboard')} className="nav-hover">
// // //               📈 Dashboard Global
// // //             </div>
// // //             {/* NOUVEAU MENU SETTINGS */}
// // //             <div style={s.navItem(pageActive === 'settings')} onClick={() => setPageActive('settings')} className="nav-hover">
// // //               ⚙️ Paramètres CRUD
// // //             </div>
// // //           </>
// // //         )}

// // //         <p style={{fontSize: '10px', color: '#cbd5e1', fontWeight: '800', marginLeft: '20px', marginTop: '20px'}}>GESTION</p>

// // //         <div style={s.navItem(pageActive === 'facturation')} onClick={() => setPageActive('facturation')} className="nav-hover">
// // //           📄 Créer Facture
// // //         </div>

// // //         <div style={s.navItem(pageActive === 'historique')} onClick={() => setPageActive('historique')} className="nav-hover">
// // //           📜 Suivi & Paiements
// // //         </div>

// // //         <div style={s.navItem(pageActive === 'articles')} onClick={() => setPageActive('articles')} className="nav-hover">
// // //           📦 Catalogue Articles
// // //         </div>

// // //         <div style={s.navItem(pageActive === 'clients')} onClick={() => setPageActive('clients')} className="nav-hover">
// // //           👥 Clients
// // //         </div>

// // //         <button style={s.btnLogout} onClick={logout} className="logout-hover">
// // //           🚪 Déconnexion
// // //         </button>
// // //       </nav>

// // //       <main style={s.main}>
// // //         <header style={s.topBar}>
// // //           <div style={{color: '#94a3b8', fontSize: '14px'}}>
// // //             Bienvenue, <b>{user.email}</b> 👋
// // //           </div>
// // //           <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
// // //              <span style={s.badgeRole}>{role?.toUpperCase()}</span>
// // //              <div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4158D0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
// // //                 {role === 'Admin' ? 'A' : 'M'}
// // //              </div>
// // //           </div>
// // //         </header>

// // //         <div style={s.contentScroll}>
// // //           <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
// // //             {renduContenu()}
// // //           </div>
// // //         </div>
// // //       </main>

// // //       <style>{`
// // //         .nav-hover:hover { transform: translateX(8px); color: #4158D0 !important; }
// // //         .logout-hover:hover { background-color: #fef2f2 !important; transform: scale(0.98); }
// // //         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }

// // // export default function App() {
// // //   return (
// // //     <AuthProvider>
// // //       <AppContent />
// // //     </AuthProvider>
// // //   );
// // // }

// // //import React, { useState } from 'react';
// // //import Article from './component/Article';
// // //import Client from './component/Client';
// // //import Facturation from './component/Facturation';
// // //import SuiviFacture from './component/SuiviFacture';
// // //import Dashboard from './component/Dashboard';
// // //import Settings from './component/Settings';
// // //import Login from './component/Login'; 
// // //import { AuthProvider, useAuth } from './contexts/AuthContext';

// // //function AppContent() {
// // //const { user, role, logout } = useAuth();
// // //const [pageActive, setPageActive] = useState('facturation');

// // //const renduContenu = () => {
// // //switch (pageActive) {
// // //case 'dashboard': return role === 'Admin' ? <Dashboard /> : <Facturation />;
// // //case 'settings': return role === 'Admin' ? <Settings /> : <Facturation />;
// // //case 'facturation': return <Facturation />;
// // //case 'historique': return <SuiviFacture />;
// // //case 'articles': return <Article />;
// // //case 'clients': return <Client />;
// // //default: return <Facturation />;
// // //}
// // //};

// // //const NavItem = ({ id, icon, label, adminOnly = false }) => {
// // //if (adminOnly && role !== 'Admin') return null;
// // //const active = pageActive === id;
// // //return (
// // //<div 
// // //onClick={() => setPageActive(id)}
// // //className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 rounded-xl mb-1 group
// // //${active 
// // //? 'bg-primary text-white shadow-lg shadow-blue-900/20' 
// // //: 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
// // //>
// // //<span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
// // //{icon}
// // //</span>
// // //<span className="font-bold text-sm tracking-tight">{label}</span>
// // //</div>
// // //);
// // //};

// // //if (!user) return <Login />;

// // //return (
// // //<div className="flex min-h-screen bg-[#f8f9fa] font-body">
// // //{/* SIDEBAR FIXED */}
// // //<nav className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
// // //<div className="p-8">
// // //<div className="flex items-center gap-3 mb-10">
// // //<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
// // //<span className="material-symbols-outlined">account_balance_wallet</span>
// // //</div>
// // //<span className="text-xl font-black text-primary tracking-tighter">The Ledger</span>
// // //</div>

// // //<div className="space-y-8">
// // //{role === 'Admin' && (
// // //<div>
// // //<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Administration</p>
// // //<NavItem id="dashboard" icon="analytics" label="Dashboard Global" />
// // //<NavItem id="settings" icon="settings_suggest" label="Paramètres CRUD" />
// // //</div>
// // //)}

// // //<div>
// // //<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Gestion</p>
// // //<NavItem id="facturation" icon="description" label="Créer Facture" />
// // //<NavItem id="historique" icon="history_edu" label="Suivi & Paiements" />
// // //<NavItem id="articles" icon="inventory_2" label="Catalogue Articles" />
// // //<NavItem id="clients" icon="group" label="Clients" />
// // //</div>
// // //</div>
// // //</div>

// // //{/* LOGOUT AT BOTTOM */}
// // //<div className="mt-auto p-8 border-t border-slate-50">
// // //<button 
// // //onClick={logout}
// // //className="flex items-center justify-center gap-3 w-full py-3 border border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
// // //>
// // //<span className="material-symbols-outlined text-[18px]">logout</span>
// // //Déconnexion
// // //</button>
// // //</div>
// // //</nav>

// // //{/* MAIN CONTENT AREA */}
// // //<div className="flex-1 ml-72">
// // //<header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
// // //<div className="flex items-center gap-2">
// // //<span className="text-slate-400 text-sm">Bienvenue,</span>
// // //<span className="text-primary font-bold text-sm">{user.email}</span>
// // //<span className="text-slate-300">|</span>
// // //<span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{role}</span>
// // //</div>

// // //<div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black overflow-hidden">
// // // {role === 'Admin' ? 'A' : 'M'}
// // //</div>
// // //</header>

// // //<div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
// // //{renduContenu()}
// // //</div>
// // //</div>
// // //</div>
// // //);
// // //}

// // //export default function App() {
// // //return (
// // //<AuthProvider>
// // //<AppContent />
// // //</AuthProvider>
// // //);
// // //}










// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
// // import Article from './component/Article';
// // import Client from './component/Client';
// // import Facturation from './component/Facturation';
// // import SuiviFacture from './component/SuiviFacture';
// // import Dashboard from './component/Dashboard';
// // import Settings from './component/Settings';
// // import Login from './component/Login';
// // import { AuthProvider, useAuth } from './contexts/AuthContext';

// // function AppContent() {
// //   const { user, role, logout } = useAuth();

// //   // Composant pour protéger les routes Admin
// //   const AdminRoute = ({ children }) => {
// //     return role === 'Admin' ? children : <Navigate to="/facturation" />;
// //   };

// //   const NavItem = ({ to, icon, label, adminOnly = false }) => {
// //     if (adminOnly && role !== 'Admin') return null;

// //     return (
// //       <NavLink
// //         to={to}
// //         className={({ isActive }) => `
// //           flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 rounded-xl mb-1 group
// //           ${isActive
// //             ? 'bg-primary text-white shadow-lg shadow-blue-900/20'
// //             : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}
// //         `}
// //       >
// //         {({ isActive }) => (
// //           <>
// //             <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
// //               {icon}
// //             </span>
// //             <span className="font-bold text-sm tracking-tight">{label}</span>
// //           </>
// //         )}
// //       </NavLink>
// //     );
// //   };

// //   if (!user) return <Login />;

// //   return (
// //     <div className="flex min-h-screen bg-[#f8f9fa] font-body">
// //       {/* SIDEBAR FIXED */}
// //       <nav className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
// //         <div className="p-8">
// //           <div className="flex items-center gap-3 mb-10">
// //             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
// //               <span className="material-symbols-outlined">account_balance_wallet</span>
// //             </div>
// //             <span className="text-xl font-black text-primary tracking-tighter">The Ledger</span>
// //           </div>

// //           <div className="space-y-8">
// //             {role === 'Admin' && (
// //               <div>
// //                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Administration</p>
// //                 <NavItem to="/dashboard" icon="analytics" label="Dashboard Global" adminOnly />
// //                 <NavItem to="/settings" icon="settings_suggest" label="Paramètres CRUD" adminOnly />
// //               </div>
// //             )}

// //             <div>
// //               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Gestion</p>
// //               <NavItem to="/facturation" icon="description" label="Créer Facture" />
// //               <NavItem to="/historique" icon="history_edu" label="Suivi & Paiements" />
// //               <NavItem to="/articles" icon="inventory_2" label="Catalogue Articles" />
// //               <NavItem to="/clients" icon="group" label="Clients" />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-auto p-8 border-t border-slate-50">
// //           <button
// //             onClick={logout}
// //             className="flex items-center justify-center gap-3 w-full py-3 border border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
// //           >
// //             <span className="material-symbols-outlined text-[18px]">logout</span>
// //             Déconnexion
// //           </button>
// //         </div>
// //       </nav>

// //       {/* MAIN CONTENT AREA */}
// //       <div className="flex-1 ml-72">
// //         <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
// //           <div className="flex items-center gap-2">
// //             <span className="text-slate-400 text-sm">Bienvenue,</span>
// //             <span className="text-primary font-bold text-sm">{user.email}</span>
// //             <span className="text-slate-300">|</span>
// //             <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{role}</span>
// //           </div>

// //           <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black overflow-hidden">
// //             {role === 'Admin' ? 'A' : 'M'}
// //           </div>
// //         </header>

// //         <main className="p-8">
// //           <Routes>
// //             {/* Routes Publiques/Standard */}
// //             <Route path="/facturation" element={<Facturation />} />
// //             <Route path="/historique" element={<SuiviFacture />} />
// //             <Route path="/articles" element={<Article />} />
// //             <Route path="/clients" element={<Client />} />

// //             {/* Routes Admin Protégées */}
// //             <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
// //             <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />

// //             {/* Redirection par défaut */}
// //             <Route path="/" element={<Navigate to="/facturation" replace />} />
// //             <Route path="*" element={<Navigate to="/facturation" replace />} />
// //           </Routes>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <Router>
// //         <AppContent />
// //       </Router>
// //     </AuthProvider>
// //   );
// // }



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
// import Article from './component/Article';
// import Client from './component/Client';
// import Facturation from './component/Facturation';
// import SuiviFacture from './component/SuiviFacture';
// import Dashboard from './component/Dashboard'; // Dashboard Admin existant
// import ManagerDashboard from './component/ManagerDashboard';
// import Settings from './component/Settings';
// import Login from './component/Login';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// function AppContent() {
//   const { user, role, logout } = useAuth();

//   // Composant pour protéger les routes STRICTEMENT Admin (comme Settings)
//   const AdminOnlyRoute = ({ children }) => {
//     return role === 'Admin' ? children : <Navigate to="/facturation" />;
//   };

//   const NavItem = ({ to, icon, label }) => {
//     return (
//       <NavLink
//         to={to}
//         className={({ isActive }) => `
//           flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 rounded-xl mb-1 group
//           ${isActive
//             ? 'bg-primary text-white shadow-lg shadow-blue-900/20'
//             : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}
//         `}
//       >
//         {({ isActive }) => (
//           <>
//             <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
//               {icon}
//             </span>
//             <span className="font-bold text-sm tracking-tight">{label}</span>
//           </>
//         )}
//       </NavLink>
//     );
//   };

//   if (!user) return <Login />;

//   return (
//     <div className="flex min-h-screen bg-[#f8f9fa] font-body">
//       {/* SIDEBAR FIXED */}
//       <nav className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
//         <div className="p-8">
//           <div className="flex items-center gap-3 mb-10">
//             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
//               <span className="material-symbols-outlined">account_balance_wallet</span>
//             </div>
//             <span className="text-xl font-black text-primary tracking-tighter">The Ledger</span>
//           </div>

//           <div className="space-y-8">
//             {/* SECTION DYNAMIQUE SELON LE RÔLE */}
//             <div>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
//                 {role === 'Admin' ? 'Administration' : 'Mon Espace'}
//               </p>

//               {/* Le lien Dashboard est maintenant visible par les deux, mais mène au même URL */}
//               <NavItem to="/dashboard" icon="analytics" label={role === 'Admin' ? "Dashboard Global" : "M.Dashboard"} />

//               {/* Seul l'admin voit les paramètres CRUD */}
//               {role === 'Admin' && (
//                 <NavItem to="/settings" icon="settings_suggest" label="Paramètres CRUD" />
//               )}
//             </div>

//             <div>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Gestion</p>
//               <NavItem to="/facturation" icon="description" label="Créer Facture" />
//               <NavItem to="/historique" icon="history_edu" label="Suivi & Paiements" />
//               <NavItem to="/articles" icon="inventory_2" label="Catalogue Articles" />
//               <NavItem to="/clients" icon="group" label="Clients" />
//             </div>
//           </div>
//         </div>

//         <div className="mt-auto p-8 border-t border-slate-50">
//           <button
//             onClick={logout}
//             className="flex items-center justify-center gap-3 w-full py-3 border border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
//           >
//             <span className="material-symbols-outlined text-[18px]">logout</span>
//             Déconnexion
//           </button>
//         </div>
//       </nav>

//       {/* MAIN CONTENT AREA */}
//       <div className="flex-1 ml-72">
//         <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
//           <div className="flex items-center gap-2">
//             <span className="text-slate-400 text-sm">Bienvenue,</span>
//             <span className="text-primary font-bold text-sm">{user.email}</span>
//             <span className="text-slate-300">|</span>
//             <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{role}</span>
//           </div>

//           <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black overflow-hidden">
//             {role === 'Admin' ? 'A' : 'M'}
//           </div>
//         </header>

//         <main className="p-8">
//           <Routes>
//             <Route path="/facturation" element={<Facturation />} />
//             <Route path="/historique" element={<SuiviFacture />} />
//             <Route path="/articles" element={<Article />} />
//             <Route path="/clients" element={<Client />} />

//             {/* LOGIQUE DE DASHBOARD : On affiche le bon composant selon le rôle sur la même route */}
//             <Route
//               path="/dashboard"
//               element={role === 'Admin' ? <Dashboard /> : <ManagerDashboard />}
//             />

//             {/* Route Admin Protégée strictement */}
//             <Route path="/settings" element={<AdminOnlyRoute><Settings /></AdminOnlyRoute>} />

//             {/* Redirection intelligente par défaut */}
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Article from './component/Article';
import Client from './component/Client';
import Facturation from './component/Facturation';
import SuiviFacture from './component/SuiviFacture';
import Dashboard from './component/Dashboard';
import ManagerDashboard from './component/ManagerDashboard';
import Settings from './component/Settings';
import Login from './component/Login';
import RequestAccess from './component/RequestAccess'; // <--- Importation du nouveau composant
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, role, logout } = useAuth();

  // Protection des routes Admin
  const AdminOnlyRoute = ({ children }) => {
    return role === 'Admin' ? children : <Navigate to="/facturation" />;
  };

  const NavItem = ({ to, icon, label }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 rounded-xl mb-1 group
          ${isActive
            ? 'bg-primary text-white shadow-lg shadow-blue-900/20'
            : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}
        `}
      >
        {({ isActive }) => (
          <>
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
              {icon}
            </span>
            <span className="font-bold text-sm tracking-tight">{label}</span>
          </>
        )}
      </NavLink>
    );
  };

  // --- MODIFICATION ICI ---
  // Si l'utilisateur n'est PAS connecté, on gère uniquement Login et RequestAccess
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/request-access" element={<RequestAccess />} />
        {/* Si l'URL ne correspond à rien et qu'on n'est pas connecté -> Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  // -------------------------

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-body">
      {/* SIDEBAR FIXED */}
      <nav className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xl font-black text-primary tracking-tighter">The Ledger</span>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
                {role === 'Admin' ? 'Administration' : 'Mon Espace'}
              </p>
              <NavItem to="/dashboard" icon="analytics" label={role === 'Admin' ? "Dashboard Global" : "M.Dashboard"} />
              {role === 'Admin' && (
                <NavItem to="/settings" icon="settings_suggest" label="Paramètres CRUD" />
              )}
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Gestion</p>
              <NavItem to="/facturation" icon="description" label="Créer Facture" />
              <NavItem to="/historique" icon="history_edu" label="Suivi & Paiements" />
              <NavItem to="/articles" icon="inventory_2" label="Catalogue Articles" />
              <NavItem to="/clients" icon="group" label="Clients" />
            </div>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full py-3 border border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-72">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Bienvenue,</span>
            <span className="text-primary font-bold text-sm">{user.email}</span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{role}</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black overflow-hidden">
            {role === 'Admin' ? 'A' : 'M'}
          </div>
        </header>

        <main className="p-8">
          <Routes>
            <Route path="/facturation" element={<Facturation />} />
            <Route path="/historique" element={<SuiviFacture />} />
            <Route path="/articles" element={<Article />} />
            <Route path="/clients" element={<Client />} />
            <Route
              path="/dashboard"
              element={role === 'Admin' ? <Dashboard /> : <ManagerDashboard />}
            />
            <Route path="/settings" element={<AdminOnlyRoute><Settings /></AdminOnlyRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}