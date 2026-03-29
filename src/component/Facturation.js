import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Facturation() {
    const [clients, setClients] = useState([]);
    const [articles, setArticles] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState("");
    const [panier, setPanier] = useState([]);

    useEffect(() => {
        onValue(ref(db, 'clients'), (snap) => {
            const d = snap.val();
            if (d) setClients(Object.entries(d).map(([id, v]) => ({ id, ...v })));
        });
        onValue(ref(db, 'articles'), (snap) => {
            const d = snap.val();
            if (d) setArticles(Object.entries(d).map(([id, v]) => ({ id, ...v })));
        });
    }, []);

    const ajouterAuPanier = (idArt) => {
        const art = articles.find(a => a.id === idArt);
        const existe = panier.find(p => p.id === idArt);
        if (existe) {
            setPanier(panier.map(p => p.id === idArt ? { ...p, qte: p.qte + 1 } : p));
        } else {
            setPanier([...panier, { ...art, qte: 1 }]);
        }
    };

    const totalHT = panier.reduce((acc, curr) => acc + (Number(curr.prix_unitaire) * curr.qte), 0);
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    const genererLePDF = () => {
        if (!clientSelectionne || panier.length === 0) return alert("Sélectionnez un client et des articles !");
        const infosC = clients.find(c => c.id === clientSelectionne);
        const doc = new jsPDF();

        // --- CONFIGURATION DU PDF ---
        doc.setFillColor(65, 88, 208);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22); doc.setTextColor(255, 255, 255);
        doc.text("FACTURE", 14, 25);
        doc.setFontSize(10);
        doc.text("Émise le : " + new Date().toLocaleDateString(), 14, 33);

        doc.setTextColor(0, 0, 0); doc.setFontSize(11);
        doc.setFont(undefined, 'bold'); doc.text("DESTINATAIRE :", 14, 55);
        doc.setFont(undefined, 'normal');
        doc.text(infosC.nom.toUpperCase(), 14, 62);
        doc.text(infosC.email || "Email non renseigné", 14, 68);

        doc.setFont(undefined, 'bold'); doc.text("TOTAL À PAYER :", 140, 55);
        doc.setFont(undefined, 'normal'); doc.text(totalTTC.toFixed(2) + " DH", 140, 62);

        const colonnes = ["Désignation", "Prix Unit.", "Qté", "Total HT"];
        const lignes = panier.map(p => [
            p.designation,
            Number(p.prix_unitaire).toFixed(2) + " DH",
            p.qte,
            (p.prix_unitaire * p.qte).toFixed(2) + " DH"
        ]);

        autoTable(doc, {
            startY: 80, head: [colonnes], body: lignes, theme: 'striped',
            headStyles: { fillColor: [65, 88, 208], fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 4 }
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        const xRight = 140;
        doc.setFontSize(10); doc.setTextColor(100);
        doc.text("Total Hors Taxes :", xRight, finalY);
        doc.text(totalHT.toFixed(2) + " DH", 195, finalY, { align: 'right' });
        doc.text("TVA (20%) :", xRight, finalY + 8);
        doc.text(tva.toFixed(2) + " DH", 195, finalY + 8, { align: 'right' });
        doc.setDrawColor(200); doc.line(xRight, finalY + 12, 195, finalY + 12);
        doc.setFontSize(12); doc.setTextColor(65, 88, 208); doc.setFont(undefined, 'bold');
        doc.text("TOTAL TTC :", xRight, finalY + 20);
        doc.text(totalTTC.toFixed(2) + " DH", 195, finalY + 20, { align: 'right' });

        doc.save(`Facture_${infosC.nom}.pdf`);
    };

    const s = {
        page: { minHeight: '100vh', backgroundColor: '#f4f7fe', padding: '40px', fontFamily: "'Poppins', sans-serif" },
        container: { maxWidth: '1200px', margin: '0 auto' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' },
        card: { backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(65, 88, 208, 0.08)', border: '1px solid #eef2ff' },
        gradientTitle: {
            fontSize: '34px', fontWeight: '800', textAlign: 'center', marginBottom: '40px',
            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        },
        select: { width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #eef2ff', backgroundColor: '#fafcff', outline: 'none', marginBottom: '30px', cursor: 'pointer' },
        articleItem: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '15px', backgroundColor: '#f9fbff', border: '1px solid #f1f5f9',
            borderRadius: '16px', marginBottom: '12px', cursor: 'pointer', transition: '0.2s'
        },
        btnGradient: {
            width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
            color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(200, 80, 192, 0.3)', marginTop: '20px'
        }
    };

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.gradientTitle}>Générateur de Factures</h1>

                <div style={s.grid}>
                    {/* COLONNE GAUCHE : SÉLECTION */}
                    <div style={s.card}>
                        <h3 style={{ color: '#4158D0', marginBottom: '25px' }}>🛒 Sélection des éléments</h3>

                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#a0aec0', marginLeft: '5px' }}>CLIENT DESTINATAIRE</label>
                        <select style={s.select} value={clientSelectionne} onChange={(e) => setClientSelectionne(e.target.value)}>
                            <option value="">Choisir un client dans la liste...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>

                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#a0aec0', marginLeft: '5px' }}>LISTE DES ARTICLES DISPONIBLES</label>
                        <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '10px', marginTop: '10px' }}>
                            {articles.map(a => (
                                <div key={a.id} onClick={() => ajouterAuPanier(a.id)} className="item-hover" style={s.articleItem}>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{a.designation}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.categorie}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '800', color: '#4158D0' }}>{Number(a.prix_unitaire).toFixed(2)} DH</div>
                                        <div style={{ fontSize: '10px', color: '#4158D0', fontWeight: '700' }}>+ AJOUTER</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLONNE DROITE : RÉCAPITULATIF */}
                    <div style={s.card}>
                        <h3 style={{ color: '#2d3436', marginBottom: '20px', borderBottom: '2px solid #f4f7fe', paddingBottom: '10px' }}>Résumé Facture</h3>

                        <div style={{ minHeight: '220px' }}>
                            {panier.map(p => (
                                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{p.designation} <span style={{ color: '#4158D0' }}>x{p.qte}</span></span>
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{(p.prix_unitaire * p.qte).toFixed(2)} DH</span>
                                </div>
                            ))}
                            {panier.length === 0 && <div style={{ textAlign: 'center', color: '#cbd5e1', marginTop: '70px' }}>Sélectionnez des articles</div>}
                        </div>

                        <div style={{ backgroundColor: '#f8f9ff', padding: '20px', borderRadius: '20px', marginTop: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}><span>Total HT</span><span>{totalHT.toFixed(2)} DH</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}><span>TVA (20%)</span><span>{tva.toFixed(2)} DH</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #fff', paddingTop: '15px' }}>
                                <span style={{ fontWeight: '800', fontSize: '18px' }}>TOTAL TTC</span>
                                <span style={{ fontWeight: '800', fontSize: '18px', color: '#4158D0' }}>{totalTTC.toFixed(2)} DH</span>
                            </div>
                        </div>

                        <button style={s.btnGradient} onClick={genererLePDF}>TÉLÉCHARGER LE PDF</button>
                        {panier.length > 0 && <button onClick={() => setPanier([])} style={{ width: '100%', background: 'none', border: 'none', color: '#ff7675', marginTop: '15px', cursor: 'pointer', fontWeight: '600' }}>Réinitialiser le panier</button>}
                    </div>
                </div>
            </div>
            <style>{`
        .item-hover:hover { background-color: #eef2ff !important; transform: translateX(5px); border-color: #4158D0 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; borderRadius: 10px; }
      `}</style>
        </div>
    );
}

export default Facturation;