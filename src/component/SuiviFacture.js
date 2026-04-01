import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue, update } from "firebase/database";
import { useAuth } from '../contexts/AuthContext'; // <--- AJOUTER CET IMPORT

function SuiviFacture() {
    const { role } = useAuth(); // <--- RÉCUPÉRER LE RÔLE ICI
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
            .catch((error) => {
                alert("Erreur : " + error.message);
            });
    };

    // 3. Filtrage
    const facturesFiltrees = factures.filter(f => 
        f.numero?.toLowerCase().includes(recherche.toLowerCase()) ||
        (f.client_nom && f.client_nom.toLowerCase().includes(recherche.toLowerCase()))
    );

    const s = {
        container: { padding: '30px' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        inputSearch: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #eef2ff', width: '300px', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
        table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
        th: { padding: '15px', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' },
        tr: { backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(65, 88, 208, 0.04)', borderRadius: '15px' },
        td: { padding: '15px', fontSize: '14px', color: '#1e293b' },
        badge: (statut) => ({
            padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold',
            backgroundColor: statut === 'Payée' ? '#ecfdf5' : statut === 'Rejetée' ? '#fff1f2' : '#fefce8',
            color: statut === 'Payée' ? '#10b981' : statut === 'Rejetée' ? '#f43f5e' : '#ca8a04',
            border: 'none', outline: 'none'
        }),
        select: { padding: '8px', borderRadius: '8px', border: '1px solid #eef2ff', backgroundColor: '#f8faff' },
        dateInput: { padding: '8px', borderRadius: '8px', border: '1px solid #eef2ff', fontSize: '12px' }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <h2 style={{ color: '#1e293b', fontWeight: '800' }}>📜 Suivi & Paiements</h2>
                <input 
                    style={s.inputSearch} 
                    placeholder="Rechercher..." 
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
            </div>

            <table style={s.table}>
                <thead>
                    <tr>
                        <th style={s.th}>Facture</th>
                        <th style={s.th}>Client</th>
                        <th style={s.th}>Statut</th>
                        <th style={s.th}>Dépôt</th>
                        <th style={s.th}>Encaissement</th>
                        <th style={s.th}>Type</th>
                        <th style={s.th}>Total TTC</th>
                        <th style={s.th}>Validation Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {facturesFiltrees.map((f) => (
                        <tr key={f.id} style={s.tr}>
                            <td style={{ ...s.td, fontWeight: '700', borderRadius: '15px 0 0 15px' }}>{f.numero}</td>
                            <td style={s.td}>{f.client_nom || "N/A"}</td>
                            
                            <td>
                                <select 
                                    style={s.badge(f.statut)}
                                    value={f.statut || "En attente"}
                                    onChange={(e) => modifierChamp(f.id, 'statut', e.target.value)}
                                >
                                    <option value="En attente">En attente</option>
                                    <option value="Payée">Payée</option>
                                    <option value="Rejetée">Rejetée</option>
                                </select>
                            </td>

                            <td>
                                <input type="date" style={s.dateInput} value={f.date_depot || ""}
                                    onChange={(e) => modifierChamp(f.id, 'date_depot', e.target.value)} />
                            </td>

                            <td>
                                <input type="date" style={s.dateInput} value={f.date_encaissement || ""}
                                    onChange={(e) => modifierChamp(f.id, 'date_encaissement', e.target.value)} />
                            </td>

                            <td>
                                <select style={s.select} value={f.type_virement || ""}
                                    onChange={(e) => modifierChamp(f.id, 'type_virement', e.target.value)}>
                                    <option value="">Choisir...</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Chèque">Chèque</option>
                                    <option value="Espèces">Espèces</option>
                                </select>
                            </td>

                            <td style={{ ...s.td, fontWeight: '800', color: '#4158D0' }}>
                                {Number(f.total_ttc || 0).toLocaleString()} DH
                            </td>

                            <td style={{ ...s.td, borderRadius: '0 15px 15px 0' }}>
                                {role === 'Admin' ? (
                                    <button 
                                        onClick={() => modifierChamp(f.id, 'validated_by_admin', !f.validated_by_admin)}
                                        style={{
                                            padding: '8px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                            backgroundColor: f.validated_by_admin ? '#dcfce7' : '#fee2e2',
                                            color: f.validated_by_admin ? '#166534' : '#991b1b',
                                            fontWeight: 'bold', fontSize: '12px'
                                        }}
                                    >
                                        {f.validated_by_admin ? "✅ Validée" : "⏳ Valider"}
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '12px', color: f.validated_by_admin ? '#10b981' : '#94a3b8' }}>
                                        {f.validated_by_admin ? "✅ Approuvée" : "⏳ En attente"}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SuiviFacture;