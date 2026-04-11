// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { ref, onValue, update } from "firebase/database";
// import { useAuth } from '../contexts/AuthContext'; // <--- AJOUTER CET IMPORT

// function SuiviFacture() {
//     const { role } = useAuth(); // <--- RÉCUPÉRER LE RÔLE ICI
//     const [factures, setFactures] = useState([]);
//     const [recherche, setRecherche] = useState("");

//     // 1. Synchronisation temps réel
//     useEffect(() => {
//         const facturesRef = ref(db, 'factures');
//         const unsubscribe = onValue(facturesRef, (snap) => {
//             const data = snap.val();
//             if (data) {
//                 const liste = Object.entries(data).map(([id, v]) => ({
//                     id,
//                     ...v
//                 }));
//                 setFactures(liste.reverse()); 
//             } else {
//                 setFactures([]);
//             }
//         });
//         return () => unsubscribe();
//     }, []);

//     // 2. Mise à jour Firebase
//     const modifierChamp = (idFacture, champ, valeur) => {
//         const factureRef = ref(db, `factures/${idFacture}`);
//         update(factureRef, { [champ]: valeur })
//             .catch((error) => {
//                 alert("Erreur : " + error.message);
//             });
//     };

//     // 3. Filtrage
//     const facturesFiltrees = factures.filter(f => 
//         f.numero?.toLowerCase().includes(recherche.toLowerCase()) ||
//         (f.client_nom && f.client_nom.toLowerCase().includes(recherche.toLowerCase()))
//     );

//     const s = {
//         container: { padding: '30px' },
//         header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
//         inputSearch: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #eef2ff', width: '300px', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
//         table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
//         th: { padding: '15px', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' },
//         tr: { backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(65, 88, 208, 0.04)', borderRadius: '15px' },
//         td: { padding: '15px', fontSize: '14px', color: '#1e293b' },
//         badge: (statut) => ({
//             padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold',
//             backgroundColor: statut === 'Payée' ? '#ecfdf5' : statut === 'Rejetée' ? '#fff1f2' : '#fefce8',
//             color: statut === 'Payée' ? '#10b981' : statut === 'Rejetée' ? '#f43f5e' : '#ca8a04',
//             border: 'none', outline: 'none'
//         }),
//         select: { padding: '8px', borderRadius: '8px', border: '1px solid #eef2ff', backgroundColor: '#f8faff' },
//         dateInput: { padding: '8px', borderRadius: '8px', border: '1px solid #eef2ff', fontSize: '12px' }
//     };

//     return (
//         <div style={s.container}>
//             <div style={s.header}>
//                 <h2 style={{ color: '#1e293b', fontWeight: '800' }}>📜 Suivi & Paiements</h2>
//                 <input 
//                     style={s.inputSearch} 
//                     placeholder="Rechercher..." 
//                     value={recherche}
//                     onChange={(e) => setRecherche(e.target.value)}
//                 />
//             </div>

//             <table style={s.table}>
//                 <thead>
//                     <tr>
//                         <th style={s.th}>Facture</th>
//                         <th style={s.th}>Client</th>
//                         <th style={s.th}>Statut</th>
//                         <th style={s.th}>Dépôt</th>
//                         <th style={s.th}>Encaissement</th>
//                         <th style={s.th}>Type</th>
//                         <th style={s.th}>Total TTC</th>
//                         <th style={s.th}>Validation Admin</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {facturesFiltrees.map((f) => (
//                         <tr key={f.id} style={s.tr}>
//                             <td style={{ ...s.td, fontWeight: '700', borderRadius: '15px 0 0 15px' }}>{f.numero}</td>
//                             <td style={s.td}>{f.client_nom || "N/A"}</td>
                            
//                             <td>
//                                 <select 
//                                     style={s.badge(f.statut)}
//                                     value={f.statut || "En attente"}
//                                     onChange={(e) => modifierChamp(f.id, 'statut', e.target.value)}
//                                 >
//                                     <option value="En attente">En attente</option>
//                                     <option value="Payée">Payée</option>
//                                     <option value="Rejetée">Rejetée</option>
//                                 </select>
//                             </td>

//                             <td>
//                                 <input type="date" style={s.dateInput} value={f.date_depot || ""}
//                                     onChange={(e) => modifierChamp(f.id, 'date_depot', e.target.value)} />
//                             </td>

//                             <td>
//                                 <input type="date" style={s.dateInput} value={f.date_encaissement || ""}
//                                     onChange={(e) => modifierChamp(f.id, 'date_encaissement', e.target.value)} />
//                             </td>

//                             <td>
//                                 <select style={s.select} value={f.type_virement || ""}
//                                     onChange={(e) => modifierChamp(f.id, 'type_virement', e.target.value)}>
//                                     <option value="">Choisir...</option>
//                                     <option value="Virement">Virement</option>
//                                     <option value="Chèque">Chèque</option>
//                                     <option value="Espèces">Espèces</option>
//                                 </select>
//                             </td>

//                             <td style={{ ...s.td, fontWeight: '800', color: '#4158D0' }}>
//                                 {Number(f.total_ttc || 0).toLocaleString()} DH
//                             </td>

//                             <td style={{ ...s.td, borderRadius: '0 15px 15px 0' }}>
//                                 {role === 'Admin' ? (
//                                     <button 
//                                         onClick={() => modifierChamp(f.id, 'validated_by_admin', !f.validated_by_admin)}
//                                         style={{
//                                             padding: '8px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
//                                             backgroundColor: f.validated_by_admin ? '#dcfce7' : '#fee2e2',
//                                             color: f.validated_by_admin ? '#166534' : '#991b1b',
//                                             fontWeight: 'bold', fontSize: '12px'
//                                         }}
//                                     >
//                                         {f.validated_by_admin ? "✅ Validée" : "⏳ Valider"}
//                                     </button>
//                                 ) : (
//                                     <span style={{ fontSize: '12px', color: f.validated_by_admin ? '#10b981' : '#94a3b8' }}>
//                                         {f.validated_by_admin ? "✅ Approuvée" : "⏳ En attente"}
//                                     </span>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default SuiviFacture;

import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue, update } from "firebase/database";
import { useAuth } from '../contexts/AuthContext';

function SuiviFacture() {
    const { role } = useAuth();
    const [factures, setFactures] = useState([]);
    const [recherche, setRecherche] = useState("");

    // 1. Synchronisation temps réel
    useEffect(() => {
        const facturesRef = ref(db, 'factures');
        const unsubscribe = onValue(facturesRef, (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.entries(data).map(([id, v]) => ({
                    id,
                    ...v
                }));
                setFactures(liste.reverse());
            } else {
                setFactures([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Mise à jour Firebase
    const modifierChamp = (idFacture, champ, valeur) => {
        const factureRef = ref(db, `factures/${idFacture}`);
        update(factureRef, { [champ]: valeur })
            .catch((error) => alert("Erreur : " + error.message));
    };

    // 3. Filtrage
    const facturesFiltrees = factures.filter(f => 
        f.numero?.toLowerCase().includes(recherche.toLowerCase()) ||
        (f.client_nom && f.client_nom.toLowerCase().includes(recherche.toLowerCase()))
    );

    // Calculs rapides pour le "Bento Grid"
    const totalEnAttente = factures.filter(f => f.statut !== 'Payée').reduce((acc, f) => acc + Number(f.total_ttc || 0), 0);
    const totalRecouvre = factures.filter(f => f.statut === 'Payée').reduce((acc, f) => acc + Number(f.total_ttc || 0), 0);

    return (
        <main className="p-8 space-y-8 flex-1 bg-background">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Suivi des Factures</h2>
                    <p className="text-slate-500 font-body text-sm">Gérez vos flux de trésorerie et le statut de vos paiements en temps réel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input 
                            type="text"
                            className="bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 font-body min-w-[250px]"
                            placeholder="Rechercher une facture..."
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Quick Metrics Bento */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total En Attente</p>
                    <p className="text-2xl font-headline font-bold text-primary">{totalEnAttente.toLocaleString()} DH</p>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recouvré ce mois</p>
                    <p className="text-2xl font-headline font-bold text-secondary">{totalRecouvre.toLocaleString()} DH</p>
                </div>
                <div className="p-6 bg-primary-container rounded-xl shadow-lg text-white">
                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Volume Global</p>
                    <p className="text-2xl font-headline font-bold">{(totalEnAttente + totalRecouvre).toLocaleString()} DH</p>
                </div>
            </section>

            {/* Main Table Section */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-slate-100/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">N° Facture</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Client</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Statut</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Détails Paiement</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total TTC</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Validation Admin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-body">
                        {facturesFiltrees.map((f) => (
                            <tr key={f.id} className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-primary font-headline tracking-tight">{f.numero}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {f.client_nom ? f.client_nom.substring(0, 2).toUpperCase() : "??"}
                                        </div>
                                        <span className="text-sm font-semibold text-on-surface">{f.client_nom || "N/A"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <select 
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer ${
                                            f.statut === 'Payée' ? 'bg-secondary-container/20 text-on-secondary-container' : 
                                            f.statut === 'Rejetée' ? 'bg-error-container/20 text-error' : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                        value={f.statut || "En attente"}
                                        onChange={(e) => modifierChamp(f.id, 'statut', e.target.value)}
                                    >
                                        <option value="En attente">En attente</option>
                                        <option value="Payée">Payée</option>
                                        <option value="Rejetée">Rejetée</option>
                                    </select>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Dépôt:</span>
                                            <input type="date" className="text-xs border-none p-0 bg-transparent focus:ring-0 font-medium" 
                                                   value={f.date_depot || ""} onChange={(e) => modifierChamp(f.id, 'date_depot', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Mode:</span>
                                            <select className="text-xs border-none p-0 bg-transparent focus:ring-0 font-medium"
                                                    value={f.type_virement || ""} onChange={(e) => modifierChamp(f.id, 'type_virement', e.target.value)}>
                                                <option value="">N/A</option>
                                                <option value="Virement">Virement</option>
                                                <option value="Chèque">Chèque</option>
                                                <option value="Espèces">Espèces</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-on-surface">
                                        {Number(f.total_ttc || 0).toLocaleString()} DH
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    {role === 'Admin' ? (
                                        <button 
                                            onClick={() => modifierChamp(f.id, 'validated_by_admin', !f.validated_by_admin)}
                                            className={`group/btn relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 border ${
                                                f.validated_by_admin 
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100' 
                                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-primary/30 hover:text-primary'
                                            }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${f.validated_by_admin ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            {f.validated_by_admin ? "Validée" : "En attente"}
                                            
                                            {/* Effet de survol pour l'admin */}
                                            <span className="material-symbols-outlined text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1">
                                                {f.validated_by_admin ? 'published_with_changes' : 'check_circle'}
                                            </span>
                                        </button>
                                    ) : (
                                        // Vue pour les non-admins (Simple Badge)
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${
                                            f.validated_by_admin 
                                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-500' 
                                            : 'bg-slate-50 border-slate-100 text-slate-300'
                                        }`}>
                                            <span className="material-symbols-outlined text-sm">
                                                {f.validated_by_admin ? 'verified' : 'pending'}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {f.validated_by_admin ? "Approuvée" : "En cours"}
                                            </span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Footer Table (Pagination Simulée) */}
                <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {facturesFiltrees.length} Factures répertoriées
                    </p>
                </div>
            </section>
        </main>
    );
}

export default SuiviFacture;