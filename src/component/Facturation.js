import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, onValue, push } from "firebase/database";
import { jsonService } from '../services/jsonService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Facturation() {
    const [clients, setClients] = useState([]);
    const [articles, setArticles] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState("");
    const [panier, setPanier] = useState([]);

    // 1. Chargement des données (Base 1: JSON Server / Base 2: Firebase)
    useEffect(() => {
        // Clients depuis Firebase
        const clientsRef = ref(db, 'clients');
        onValue(clientsRef, (snap) => {
            const d = snap.val();
            if (d) setClients(Object.entries(d).map(([id, v]) => ({ id, ...v })));
        });

        // Articles depuis JSON Server
        jsonService.getArticles().then(data => setArticles(data)).catch(err => console.error(err));
    }, []);

    // 2. Gestion du panier
    const ajouterAuPanier = (idArt) => {
        const art = articles.find(a => a.id === idArt);
        const existe = panier.find(p => p.id === idArt);
        if (existe) {
            setPanier(panier.map(p => p.id === idArt ? { ...p, qte: p.qte + 1 } : p));
        } else {
            setPanier([...panier, { ...art, qte: 1 }]);
        }
    };

    const supprimerDuPanier = (id) => {
        setPanier(panier.filter(p => p.id !== id));
    };

    // 3. Calculs
    const totalHT = panier.reduce((acc, curr) => acc + (Number(curr.prix_unitaire) * curr.qte), 0);
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    // 4. Fonction de validation (Firebase + PDF style Image)
    const validerEtGenererFacture = async () => {
        if (!clientSelectionne || panier.length === 0) {
            return alert("Veuillez sélectionner un client et au moins un article.");
        }

        const infosC = clients.find(c => c.id === clientSelectionne);
        const numeroFacture = `FR-${Date.now().toString().substring(7)}`;
        const dateAujourdhui = new Date().toLocaleDateString('fr-FR');

        const nouvelleFacture = {
            numero: numeroFacture,
            date_creation: new Date().toISOString(),
            client_id: clientSelectionne,
            client_nom: infosC.nom,
            articles: panier,
            total_ht: totalHT,
            tva: tva,
            total_ttc: totalTTC,
            statut: "En attente",
            validated_by_admin: false,
            date_depot: "",
            date_encaissement: "",
            type_virement: ""
        };

        try {
            // Sauvegarde Firebase
            await push(ref(db, 'factures'), nouvelleFacture);

            // Génération PDF (Inspiré de l'image Joanna Binet)
            const doc = new jsPDF();
            
            // Header Gauche (Vendeur)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("VOTRE ENTREPRISE", 15, 20);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text("Adresse de l'entreprise\n75000 Paris, France\nContact@entreprise.com", 15, 28);

            // Titre FACTURE Droite
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("FACTURE", 195, 20, { align: 'right' });

            // Infos Client et Facture
            doc.setFontSize(9);
            doc.text("Facturé à :", 15, 55);
            doc.setFont("helvetica", "bold");
            doc.text(infosC.nom, 15, 61);
            doc.setFont("helvetica", "normal");
            doc.text(infosC.adresse || "Adresse client", 15, 67);

            doc.setFont("helvetica", "bold");
            doc.text(`N° Facture : ${numeroFacture}`, 195, 55, { align: 'right' });
            doc.text(`Date : ${dateAujourdhui}`, 195, 62, { align: 'right' });

            // Tableau Articles
            autoTable(doc, {
                startY: 80,
                head: [['QTÉ', 'DÉSIGNATION', 'PRIX UNIT. HT', 'MONTANT HT']],
                body: panier.map(p => [p.qte, p.designation, p.prix_unitaire.toFixed(2), (p.prix_unitaire * p.qte).toFixed(2)]),
                theme: 'plain',
                styles: { fontSize: 8, cellPadding: 3 },
                headStyles: { fillColor: [250, 250, 250], textColor: [0, 0, 0], fontStyle: 'bold' },
                columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' } }
            });

            // Totaux
            let finalY = doc.lastAutoTable.finalY + 10;
            doc.text("Total HT", 140, finalY);
            doc.text(`${totalHT.toFixed(2)} DH`, 195, finalY, { align: 'right' });
            doc.text("TVA (20%)", 140, finalY + 6);
            doc.text(`${tva.toFixed(2)} DH`, 195, finalY + 6, { align: 'right' });
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.rect(138, finalY + 10, 60, 10);
            doc.text("TOTAL TTC", 142, finalY + 17);
            doc.text(`${totalTTC.toFixed(2)} DH`, 195, finalY + 17, { align: 'right' });

            // Signature
            doc.setFont("courier", "italic");
            doc.text("Signature", 170, finalY + 40);

            doc.save(`${numeroFacture}.pdf`);
            setPanier([]);
            setClientSelectionne("");
            alert("Facture enregistrée et PDF généré !");
        } catch (e) {
            alert("Erreur lors de l'enregistrement.");
        }
    };

    // --- STYLES INTERFACE ---
    const s = {
        mainGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', marginTop: '20px' },
        card: { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
        listScroll: { maxHeight: '400px', overflowY: 'auto', marginTop: '15px' },
        item: { display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
        btn: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(45deg, #4158D0, #C850C0)', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }
    };

    return (
        <div>
            <h1 style={{ color: '#1e293b', fontWeight: '800' }}>📄 Création de Facture</h1>
            
            <div style={s.mainGrid}>
                {/* GAUCHE : Sélection */}
                <div style={s.card}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>SÉLECTIONNER LE CLIENT</label>
                    <select 
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #eef2ff' }}
                        value={clientSelectionne}
                        onChange={(e) => setClientSelectionne(e.target.value)}
                    >
                        <option value="">-- Choisir un client --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>

                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>ARTICLES DISPONIBLES</label>
                    <div style={s.listScroll}>
                        {articles.map(a => (
                            <div key={a.id} style={s.item} onClick={() => ajouterAuPanier(a.id)}>
                                <span>{a.designation}</span>
                                <span style={{ fontWeight: 'bold', color: '#4158D0' }}>{a.prix_unitaire} DH</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DROITE : Panier / Résumé */}
                <div style={s.card}>
                    <h3 style={{ marginBottom: '15px' }}>Détails de la facture</h3>
                    <div style={{ minHeight: '200px' }}>
                        {panier.map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>{p.designation} x{p.qte}</span>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{(p.prix_unitaire * p.qte).toFixed(2)} DH</span>
                                    <button onClick={() => supprimerDuPanier(p.id)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total HT</span><span>{totalHT.toFixed(2)} DH</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#4158D0', marginTop: '10px' }}>
                            <span>TOTAL TTC</span><span>{totalTTC.toFixed(2)} DH</span>
                        </div>
                    </div>

                    <button style={s.btn} onClick={validerEtGenererFacture}>
                        VALIDER ET TÉLÉCHARGER PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Facturation;