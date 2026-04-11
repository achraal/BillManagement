import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from "firebase/database";
import { jsonService } from '../services/jsonService';

function ManagerDashboard() {
    const [stats, setStats] = useState({
        totalVentes: 0,
        nbFactures: 0,
        nbArticles: 0,
        recentes: []
    });

    useEffect(() => {
        // 1. Récupérer les factures depuis Firebase
        const facturesRef = ref(db, 'factures');
        const unsubFactures = onValue(facturesRef, (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.values(data);
                const total = liste.reduce((acc, curr) => acc + (curr.total_ttc || 0), 0);

                setStats(prev => ({
                    ...prev,
                    totalVentes: total,
                    nbFactures: liste.length,
                    recentes: liste.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation)).slice(0, 5)
                }));
            }
        });

        // 2. Récupérer le nombre d'articles
        jsonService.getArticles().then(arts => {
            setStats(prev => ({ ...prev, nbArticles: arts.length }));
        });

        return () => unsubFactures();
    }, []);

    return (
        <div className="p-8 bg-background min-h-screen">
            <div className="mb-10">
                <h2 className="text-3xl font-headline font-black text-primary">Manager Dashboard</h2>
                <p className="text-slate-500 font-body">Aperçu en temps réel des flux commerciaux.</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-primary rounded-xl">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ventes Totales</p>
                            <p className="text-2xl font-black text-primary">{stats.totalVentes.toLocaleString()} <span className="text-xs">DH</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Factures Émises</p>
                            <p className="text-2xl font-black text-slate-800">{stats.nbFactures}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Articles Catalogue</p>
                            <p className="text-2xl font-black text-slate-800">{stats.nbArticles}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des dernières factures */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-headline font-bold text-slate-800">Flux de Facturation Récents</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">5 DERNIÈRES</span>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Client</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase">Montant TTC</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {stats.recentes.map((f, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-primary">{f.client_nom}</p>
                                    <p className="text-[10px] text-slate-400">{f.numero}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {new Date(f.date_creation).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right font-black text-primary text-sm">
                                    {f.total_ttc?.toLocaleString()} DH
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagerDashboard;