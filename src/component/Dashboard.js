import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from "firebase/database";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

function Dashboard() {
    const [factures, setFactures] = useState([]);
    const [statsMensuelles, setStatsMensuelles] = useState([]);

    useEffect(() => {
        const facturesRef = ref(db, 'factures');
        onValue(facturesRef, (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.values(data);
                setFactures(liste);
                calculerStats(liste);
            }
        });
    }, []);

    const calculerStats = (liste) => {
        const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const stats = moisNoms.map(m => ({ name: m, total: 0 }));

        liste.forEach(f => {
            const date = new Date(f.date_creation);
            const moisIndex = date.getMonth();
            if (f.statut === "Payée") {
                stats[moisIndex].total += f.total_ttc;
            }
        });
        setStatsMensuelles(stats);
    };

    // Calcul des KPIs
    const totalFactures = factures.length;
    const totalEncaisse = factures.filter(f => f.statut === "Payée").reduce((acc, f) => acc + f.total_ttc, 0);
    const facturesAttente = factures.filter(f => f.statut === "En attente").length;
    const facturesRejetees = factures.filter(f => f.statut === "Rejetée").length;
    const montantMoyen = totalFactures > 0 ? (totalEncaisse / totalFactures).toFixed(2) : 0;

    const s = {
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
        card: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' },
        label: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
        value: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginTop: '10px' },
        chartContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: '20px' }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '25px', color: '#1e293b' }}>📊 Tableau de Bord Admin</h2>

            {/* SECTION 1 : KPIs */}
            <div style={s.grid}>
                <div style={s.card}>
                    <div style={s.label}>Total Factures</div>
                    <div style={s.value}>{totalFactures}</div>
                </div>
                <div style={{ ...s.card, borderBottom: '4px solid #10b981' }}>
                    <div style={s.label}>Total Encaissé (DH)</div>
                    <div style={{ ...s.value, color: '#10b981' }}>{totalEncaisse.toLocaleString()}</div>
                </div>
                <div style={{ ...s.card, borderBottom: '4px solid #f59e0b' }}>
                    <div style={s.label}>En Attente</div>
                    <div style={{ ...s.value, color: '#f59e0b' }}>{facturesAttente}</div>
                </div>
                <div style={{ ...s.card, borderBottom: '4px solid #ef4444' }}>
                    <div style={s.label}>Rejetées</div>
                    <div style={{ ...s.value, color: '#ef4444' }}>{facturesRejetees}</div>
                </div>
                <div style={s.card}>
                    <div style={s.label}>Montant Moyen</div>
                    <div style={s.value}>{montantMoyen} DH</div>
                </div>
            </div>

            {/* SECTION 2 : GRAPHIQUES */}
            <div style={s.grid}>
                <div style={s.chartContainer}>
                    <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>Chiffre d'Affaires Mensuel (Payé)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={statsMensuelles}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                    {statsMensuelles.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4158D0' : '#C850C0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={s.chartContainer}>
                    <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>Évolution des encaissements</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={statsMensuelles}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#4158D0" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;