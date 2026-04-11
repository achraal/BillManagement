// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { ref, onValue } from "firebase/database";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

// function Dashboard() {
//     const [factures, setFactures] = useState([]);
//     const [statsMensuelles, setStatsMensuelles] = useState([]);

//     useEffect(() => {
//         const facturesRef = ref(db, 'factures');
//         onValue(facturesRef, (snap) => {
//             const data = snap.val();
//             if (data) {
//                 const liste = Object.values(data);
//                 setFactures(liste);
//                 calculerStats(liste);
//             }
//         });
//     }, []);

//     const calculerStats = (liste) => {
//         const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
//         const stats = moisNoms.map(m => ({ name: m, total: 0 }));

//         liste.forEach(f => {
//             const date = new Date(f.date_creation);
//             const moisIndex = date.getMonth();
//             if (f.statut === "Payée") {
//                 stats[moisIndex].total += f.total_ttc;
//             }
//         });
//         setStatsMensuelles(stats);
//     };

//     // Calcul des KPIs
//     const totalFactures = factures.length;
//     const totalEncaisse = factures.filter(f => f.statut === "Payée").reduce((acc, f) => acc + f.total_ttc, 0);
//     const facturesAttente = factures.filter(f => f.statut === "En attente").length;
//     const facturesRejetees = factures.filter(f => f.statut === "Rejetée").length;
//     const montantMoyen = totalFactures > 0 ? (totalEncaisse / totalFactures).toFixed(2) : 0;

//     const s = {
//         grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
//         card: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' },
//         label: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
//         value: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginTop: '10px' },
//         chartContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: '20px' }
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2 style={{ marginBottom: '25px', color: '#1e293b' }}>📊 Tableau de Bord Admin</h2>

//             {/* SECTION 1 : KPIs */}
//             <div style={s.grid}>
//                 <div style={s.card}>
//                     <div style={s.label}>Total Factures</div>
//                     <div style={s.value}>{totalFactures}</div>
//                 </div>
//                 <div style={{ ...s.card, borderBottom: '4px solid #10b981' }}>
//                     <div style={s.label}>Total Encaissé (DH)</div>
//                     <div style={{ ...s.value, color: '#10b981' }}>{totalEncaisse.toLocaleString()}</div>
//                 </div>
//                 <div style={{ ...s.card, borderBottom: '4px solid #f59e0b' }}>
//                     <div style={s.label}>En Attente</div>
//                     <div style={{ ...s.value, color: '#f59e0b' }}>{facturesAttente}</div>
//                 </div>
//                 <div style={{ ...s.card, borderBottom: '4px solid #ef4444' }}>
//                     <div style={s.label}>Rejetées</div>
//                     <div style={{ ...s.value, color: '#ef4444' }}>{facturesRejetees}</div>
//                 </div>
//                 <div style={s.card}>
//                     <div style={s.label}>Montant Moyen</div>
//                     <div style={s.value}>{montantMoyen} DH</div>
//                 </div>
//             </div>

//             {/* SECTION 2 : GRAPHIQUES */}
//             <div style={s.grid}>
//                 <div style={s.chartContainer}>
//                     <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>Chiffre d'Affaires Mensuel (Payé)</h3>
//                     <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <BarChart data={statsMensuelles}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
//                                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
//                                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
//                                 <Bar dataKey="total" radius={[4, 4, 0, 0]}>
//                                     {statsMensuelles.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4158D0' : '#C850C0'} />
//                                     ))}
//                                 </Bar>
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 <div style={s.chartContainer}>
//                     <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>Évolution des encaissements</h3>
//                     <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <LineChart data={statsMensuelles}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Line type="monotone" dataKey="total" stroke="#4158D0" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { ref, onValue } from "firebase/database";

// function Dashboard() {
//     const [factures, setFactures] = useState([]);
//     const [statsMensuelles, setStatsMensuelles] = useState([]);

//     useEffect(() => {
//         const facturesRef = ref(db, 'factures');
//         const unsubscribe = onValue(facturesRef, (snap) => {
//             const data = snap.val();
//             if (data) {
//                 const liste = Object.values(data);
//                 setFactures(liste);
//                 calculerStats(liste);
//             }
//         });
//         return () => unsubscribe();
//     }, []);

//     const calculerStats = (liste) => {
//     const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"];

//     // 1. Initialisation propre
//     const stats = moisNoms.map(m => ({ name: m, total: 0 }));

//     liste.forEach(f => {
//         // 2. Vérification du statut ET de l'existence de la date
//         if (f.date_creation && f.statut === "Payée") {
//             const date = new Date(f.date_creation);
//             const moisIndex = date.getMonth();

//             // 3. FORCE le type Number pour éviter les erreurs de calcul
//             const montant = Number(f.total_ttc) || 0;

//             if (moisIndex >= 0 && moisIndex < 12) {
//                 stats[moisIndex].total += montant;
//             }
//         }
//     });

//     setStatsMensuelles(stats);
// };

//     // Calcul des KPIs
//     const totalFacturesCount = factures.length;
//     const totalEncaisse = factures.filter(f => f.statut === "Payée").reduce((acc, f) => acc + f.total_ttc, 0);
//     const facturesAttente = factures.filter(f => f.statut === "En attente").length;
//     const facturesRejetees = factures.filter(f => f.statut === "Rejetée").length;

//     // Calcul pour le graphique
//     const maxCA = Math.max(...statsMensuelles.map(s => s.total), 1);

//     return (
//         <div className="min-h-screen bg-background">
//             {/* Header & Action - SANS ML-64 */}
//             <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-8 py-4 shadow-sm">
//                 <div className="flex items-center gap-4 flex-1">
//                     <h2 className="text-xl font-headline font-bold text-primary">System Overview</h2>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-headline font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/10 active:scale-95">
//                         Export Report
//                     </button>
//                 </div>
//             </header>

//             <div className="p-8 max-w-7xl mx-auto space-y-8">
//                 {/* KPI Bento Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {/* Total Factures */}
//                     <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className="p-3 rounded-lg bg-primary/5 text-primary">
//                                 <span className="material-symbols-outlined">description</span>
//                             </div>
//                         </div>
//                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Documents</p>
//                         <h3 className="text-2xl font-headline font-bold text-primary">{totalFacturesCount}</h3>
//                     </div>

//                     {/* Total Encaissé */}
//                     <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
//                                 <span className="material-symbols-outlined">payments</span>
//                             </div>
//                         </div>
//                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Revenue Encaissé</p>
//                         <h3 className="text-2xl font-headline font-bold text-primary">{totalEncaisse.toLocaleString()} DH</h3>
//                     </div>

//                     {/* En Attente */}
//                     <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
//                                 <span className="material-symbols-outlined">schedule</span>
//                             </div>
//                         </div>
//                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">En attente</p>
//                         <h3 className="text-2xl font-headline font-bold text-primary">{facturesAttente}</h3>
//                     </div>

//                     {/* Rejetées */}
//                     <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className="p-3 rounded-lg bg-red-50 text-red-600">
//                                 <span className="material-symbols-outlined">error_outline</span>
//                             </div>
//                         </div>
//                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rejetées</p>
//                         <h3 className="text-2xl font-headline font-bold text-primary">{facturesRejetees}</h3>
//                     </div>
//                 </div>

//                 {/* Charts & Analytics Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* CA mensuel */}
//                     <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-slate-100">
//                         <div className="flex justify-between items-center mb-10">
//                             <div>
//                                 <h4 className="text-lg font-headline font-bold text-primary">Performance Annuelle</h4>
//                                 <p className="text-sm text-slate-400">Chiffre d'affaires payé par mois</p>
//                             </div>
//                         </div>
//                         <div className="relative h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
//                             {statsMensuelles.map((m, i) => (
//                                 <div key={i} className="flex-1 group relative flex flex-col items-center gap-2">
//                                     <div 
//                                         className="w-full bg-primary/20 rounded-t-lg transition-all duration-500 group-hover:bg-primary"
//                                         style={{ height: `${(m.total / maxCA) * 100}%`, minHeight: m.total > 0 ? '4px' : '0' }}
//                                     >
//                                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                                             {m.total.toLocaleString()} DH
//                                         </div>
//                                     </div>
//                                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{m.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Quick Insights */}
//                     <div className="bg-primary text-white p-8 rounded-xl shadow-xl flex flex-col justify-between">
//                         <div>
//                             <h4 className="text-lg font-headline font-semibold mb-2">Santé Financière</h4>
//                             <p className="text-white/60 text-xs mb-8">Répartition des statuts</p>
//                             <div className="space-y-6">
//                                 <div>
//                                     <div className="flex justify-between text-xs font-bold mb-2">
//                                         <span>Payées</span>
//                                         <span>{totalFacturesCount ? ((factures.filter(f => f.statut === "Payée").length / totalFacturesCount) * 100).toFixed(0) : 0}%</span>
//                                     </div>
//                                     <div className="w-full h-1.5 bg-white/10 rounded-full">
//                                         <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${(factures.filter(f => f.statut === "Payée").length / totalFacturesCount) * 100}%` }}></div>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="flex justify-between text-xs font-bold mb-2">
//                                         <span>En attente</span>
//                                         <span>{totalFacturesCount ? ((facturesAttente / totalFacturesCount) * 100).toFixed(0) : 0}%</span>
//                                     </div>
//                                     <div className="w-full h-1.5 bg-white/10 rounded-full">
//                                         <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${(facturesAttente / totalFacturesCount) * 100}%` }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
//                             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Encaissement Total</p>
//                             <p className="text-xl font-headline font-bold text-white">{totalEncaisse.toLocaleString()} DH</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent Invoices Table */}
//                 <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
//                     <div className="p-8 flex justify-between items-center border-b border-slate-100">
//                         <h4 className="text-lg font-headline font-bold text-primary">Dernières Opérations</h4>
//                     </div>
//                     <div className="w-full overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="bg-slate-50/50">
//                                     <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">N° Invoice</th>
//                                     <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
//                                     <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant</th>
//                                     <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100">
//                                 {factures.slice(-5).reverse().map((f, i) => (
//                                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
//                                         <td className="px-8 py-5 text-sm font-bold text-primary font-headline">{f.numero}</td>
//                                         <td className="px-8 py-5 text-sm text-slate-600">{f.client_nom}</td>
//                                         <td className="px-8 py-5 text-sm font-extrabold text-primary">{f.total_ttc?.toLocaleString()} DH</td>
//                                         <td className="px-8 py-5">
//                                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
//                                                 f.statut === "Payée" ? "bg-emerald-50 text-emerald-700" : 
//                                                 f.statut === "En attente" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
//                                             }`}>
//                                                 {f.statut}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from "firebase/database";

function Dashboard() {
    const [factures, setFactures] = useState([]);
    const [statsMensuelles, setStatsMensuelles] = useState([]);

    useEffect(() => {
        const facturesRef = ref(db, 'factures');
        const unsubscribe = onValue(facturesRef, (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.values(data);
                setFactures(liste);
                calculerStats(liste);
            }
        });
        return () => unsubscribe();
    }, []);

    const calculerStats = (liste) => {
        const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"];
        const stats = moisNoms.map(m => ({ name: m, total: 0 }));

        liste.forEach(f => {
            if (f.date_creation && f.statut === "Payée") {
                const date = new Date(f.date_creation);
                const moisIndex = date.getMonth();
                const montant = Number(f.total_ttc) || 0;
                if (moisIndex >= 0 && moisIndex < 12) {
                    stats[moisIndex].total += montant;
                }
            }
        });

        setStatsMensuelles(stats);
    };

    const totalFacturesCount = factures.length;
    const totalEncaisse = factures.filter(f => f.statut === "Payée").reduce((acc, f) => acc + (Number(f.total_ttc) || 0), 0);
    const facturesAttente = factures.filter(f => f.statut === "En attente").length;
    const facturesRejetees = factures.filter(f => f.statut === "Rejetée").length;
    const maxCA = Math.max(...statsMensuelles.map(s => s.total), 1);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-8 py-4 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-xl font-headline font-bold text-primary">System Overview</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-headline font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/10 active:scale-95">
                        Export Report
                    </button>
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-primary/5 text-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Documents</p>
                        <h3 className="text-2xl font-headline font-bold text-primary">{totalFacturesCount}</h3>
                    </div>

                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Revenue Encaissé</p>
                        <h3 className="text-2xl font-headline font-bold text-primary">{totalEncaisse.toLocaleString()} DH</h3>
                    </div>

                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">En attente</p>
                        <h3 className="text-2xl font-headline font-bold text-primary">{facturesAttente}</h3>
                    </div>

                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-red-50 text-red-600">
                                <span className="material-symbols-outlined">error_outline</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rejetées</p>
                        <h3 className="text-2xl font-headline font-bold text-primary">{facturesRejetees}</h3>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CA Mensuel - Graphique corrigé */}
                    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h4 className="text-lg font-headline font-bold text-primary">Performance Annuelle</h4>
                                <p className="text-sm text-slate-400">Chiffre d'affaires payé par mois</p>
                            </div>
                        </div>

                        {/* Conteneur avec hauteur inline pour que les % fonctionnent */}
                        <div
                            className="relative flex items-end justify-between gap-2 sm:gap-4 px-2"
                            style={{ height: '256px' }}
                        >
                            {statsMensuelles.map((m, i) => {
                                const heightPercent = maxCA > 0 ? (m.total / maxCA) * 100 : 0;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 group relative flex flex-col items-center justify-end"
                                        style={{ height: '100%' }}
                                    >
                                        {/* Tooltip au hover */}
                                        {m.total > 0 && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {m.total.toLocaleString()} DH
                                            </div>
                                        )}

                                        {/* Barre dynamique */}
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-700"
                                            style={{
                                                height: heightPercent > 0 ? `${heightPercent}%` : '2px',
                                                minHeight: m.total > 0 ? '4px' : '2px',
                                                backgroundColor: m.total > 0 ? '#514cacff' : '#e2e8f0',
                                            }}
                                            onMouseEnter={e => { if (m.total > 0) e.currentTarget.style.backgroundColor = '#514cacff'; }}
                                            onMouseLeave={e => { if (m.total > 0) e.currentTarget.style.backgroundColor = '#514cacff'; }}
                                        />

                                        {/* Label mois */}
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-2 shrink-0">
                                            {m.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Santé Financière */}
                    <div className="bg-primary text-white p-8 rounded-xl shadow-xl flex flex-col justify-between">
                        <div>
                            <h4 className="text-lg font-headline font-semibold mb-2">Santé Financière</h4>
                            <p className="text-white/60 text-xs mb-8">Répartition des statuts</p>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>Payées</span>
                                        <span>
                                            {totalFacturesCount
                                                ? ((factures.filter(f => f.statut === "Payée").length / totalFacturesCount) * 100).toFixed(0)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                                        <div
                                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                                            style={{ width: `${totalFacturesCount ? (factures.filter(f => f.statut === "Payée").length / totalFacturesCount) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>En attente</span>
                                        <span>
                                            {totalFacturesCount
                                                ? ((facturesAttente / totalFacturesCount) * 100).toFixed(0)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-700"
                                            style={{ width: `${totalFacturesCount ? (facturesAttente / totalFacturesCount) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>Rejetées</span>
                                        <span>
                                            {totalFacturesCount
                                                ? ((facturesRejetees / totalFacturesCount) * 100).toFixed(0)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                                        <div
                                            className="h-full bg-red-400 rounded-full transition-all duration-700"
                                            style={{ width: `${totalFacturesCount ? (facturesRejetees / totalFacturesCount) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Encaissement Total</p>
                            <p className="text-xl font-headline font-bold text-white">{totalEncaisse.toLocaleString()} DH</p>
                        </div>
                    </div>
                </div>

                {/* Recent Invoices Table */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 flex justify-between items-center border-b border-slate-100">
                        <h4 className="text-lg font-headline font-bold text-primary">Dernières Opérations</h4>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">N° Invoice</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {factures.slice(-5).reverse().map((f, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-bold text-primary font-headline">{f.numero}</td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{f.client_nom}</td>
                                        <td className="px-8 py-5 text-sm font-extrabold text-primary">{Number(f.total_ttc)?.toLocaleString()} DH</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${f.statut === "Payée" ? "bg-emerald-50 text-emerald-700" :
                                                f.statut === "En attente" ? "bg-amber-50 text-amber-600" :
                                                    "bg-red-50 text-red-600"
                                                }`}>
                                                {f.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;