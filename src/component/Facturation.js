// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { ref, onValue, push } from "firebase/database";
// import { jsonService } from '../services/jsonService';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// function Facturation() {
//     const [clients, setClients] = useState([]);
//     const [articles, setArticles] = useState([]);
//     const [clientSelectionne, setClientSelectionne] = useState("");
//     const [panier, setPanier] = useState([]);

//     // 1. Chargement des données (Base 1: JSON Server / Base 2: Firebase)
//     useEffect(() => {
//         // Clients depuis Firebase
//         const clientsRef = ref(db, 'clients');
//         onValue(clientsRef, (snap) => {
//             const d = snap.val();
//             if (d) setClients(Object.entries(d).map(([id, v]) => ({ id, ...v })));
//         });

//         // Articles depuis JSON Server
//         jsonService.getArticles().then(data => setArticles(data)).catch(err => console.error(err));
//     }, []);

//     // 2. Gestion du panier
//     const ajouterAuPanier = (idArt) => {
//         const art = articles.find(a => a.id === idArt);
//         const existe = panier.find(p => p.id === idArt);
//         if (existe) {
//             setPanier(panier.map(p => p.id === idArt ? { ...p, qte: p.qte + 1 } : p));
//         } else {
//             setPanier([...panier, { ...art, qte: 1 }]);
//         }
//     };

//     const supprimerDuPanier = (id) => {
//         setPanier(panier.filter(p => p.id !== id));
//     };

//     // 3. Calculs
//     const totalHT = panier.reduce((acc, curr) => acc + (Number(curr.prix_unitaire) * curr.qte), 0);
//     const tva = totalHT * 0.20;
//     const totalTTC = totalHT + tva;

//     // 4. Fonction de validation (Firebase + PDF style Image)
//     const validerEtGenererFacture = async () => {
//         if (!clientSelectionne || panier.length === 0) {
//             return alert("Veuillez sélectionner un client et au moins un article.");
//         }

//         const infosC = clients.find(c => c.id === clientSelectionne);
//         const numeroFacture = `FR-${Date.now().toString().substring(7)}`;
//         const dateAujourdhui = new Date().toLocaleDateString('fr-FR');

//         const nouvelleFacture = {
//             numero: numeroFacture,
//             date_creation: new Date().toISOString(),
//             client_id: clientSelectionne,
//             client_nom: infosC.nom,
//             articles: panier,
//             total_ht: totalHT,
//             tva: tva,
//             total_ttc: totalTTC,
//             statut: "En attente",
//             validated_by_admin: false,
//             date_depot: "",
//             date_encaissement: "",
//             type_virement: ""
//         };

//         try {
//             // Sauvegarde Firebase
//             await push(ref(db, 'factures'), nouvelleFacture);

//             // Génération PDF (Inspiré de l'image Joanna Binet)
//             const doc = new jsPDF();

//             // Header Gauche (Vendeur)
//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(18);
//             doc.text("VOTRE ENTREPRISE", 15, 20);
//             doc.setFontSize(9);
//             doc.setFont("helvetica", "normal");
//             doc.text("Adresse de l'entreprise\n75000 Paris, France\nContact@entreprise.com", 15, 28);

//             // Titre FACTURE Droite
//             doc.setFontSize(16);
//             doc.setFont("helvetica", "bold");
//             doc.text("FACTURE", 195, 20, { align: 'right' });

//             // Infos Client et Facture
//             doc.setFontSize(9);
//             doc.text("Facturé à :", 15, 55);
//             doc.setFont("helvetica", "bold");
//             doc.text(infosC.nom, 15, 61);
//             doc.setFont("helvetica", "normal");
//             doc.text(infosC.adresse || "Adresse client", 15, 67);

//             doc.setFont("helvetica", "bold");
//             doc.text(`N° Facture : ${numeroFacture}`, 195, 55, { align: 'right' });
//             doc.text(`Date : ${dateAujourdhui}`, 195, 62, { align: 'right' });

//             // Tableau Articles
//             autoTable(doc, {
//                 startY: 80,
//                 head: [['QTÉ', 'DÉSIGNATION', 'PRIX UNIT. HT', 'MONTANT HT']],
//                 body: panier.map(p => [p.qte, p.designation, p.prix_unitaire.toFixed(2), (p.prix_unitaire * p.qte).toFixed(2)]),
//                 theme: 'plain',
//                 styles: { fontSize: 8, cellPadding: 3 },
//                 headStyles: { fillColor: [250, 250, 250], textColor: [0, 0, 0], fontStyle: 'bold' },
//                 columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' } }
//             });

//             // Totaux
//             let finalY = doc.lastAutoTable.finalY + 10;
//             doc.text("Total HT", 140, finalY);
//             doc.text(`${totalHT.toFixed(2)} DH`, 195, finalY, { align: 'right' });
//             doc.text("TVA (20%)", 140, finalY + 6);
//             doc.text(`${tva.toFixed(2)} DH`, 195, finalY + 6, { align: 'right' });

//             doc.setFontSize(11);
//             doc.setFont("helvetica", "bold");
//             doc.rect(138, finalY + 10, 60, 10);
//             doc.text("TOTAL TTC", 142, finalY + 17);
//             doc.text(`${totalTTC.toFixed(2)} DH`, 195, finalY + 17, { align: 'right' });

//             // Signature
//             doc.setFont("courier", "italic");
//             doc.text("Signature", 170, finalY + 40);

//             doc.save(`${numeroFacture}.pdf`);
//             setPanier([]);
//             setClientSelectionne("");
//             alert("Facture enregistrée et PDF généré !");
//         } catch (e) {
//             alert("Erreur lors de l'enregistrement.");
//         }
//     };

//     // --- STYLES INTERFACE ---
//     const s = {
//         mainGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', marginTop: '20px' },
//         card: { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
//         listScroll: { maxHeight: '400px', overflowY: 'auto', marginTop: '15px' },
//         item: { display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
//         btn: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(45deg, #4158D0, #C850C0)', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }
//     };

//     return (
//         <div>
//             <h1 style={{ color: '#1e293b', fontWeight: '800' }}>📄 Création de Facture</h1>

//             <div style={s.mainGrid}>
//                 {/* GAUCHE : Sélection */}
//                 <div style={s.card}>
//                     <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>SÉLECTIONNER LE CLIENT</label>
//                     <select 
//                         style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #eef2ff' }}
//                         value={clientSelectionne}
//                         onChange={(e) => setClientSelectionne(e.target.value)}
//                     >
//                         <option value="">-- Choisir un client --</option>
//                         {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
//                     </select>

//                     <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>ARTICLES DISPONIBLES</label>
//                     <div style={s.listScroll}>
//                         {articles.map(a => (
//                             <div key={a.id} style={s.item} onClick={() => ajouterAuPanier(a.id)}>
//                                 <span>{a.designation}</span>
//                                 <span style={{ fontWeight: 'bold', color: '#4158D0' }}>{a.prix_unitaire} DH</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* DROITE : Panier / Résumé */}
//                 <div style={s.card}>
//                     <h3 style={{ marginBottom: '15px' }}>Détails de la facture</h3>
//                     <div style={{ minHeight: '200px' }}>
//                         {panier.map(p => (
//                             <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                                 <span>{p.designation} x{p.qte}</span>
//                                 <div>
//                                     <span style={{ fontWeight: 'bold' }}>{(p.prix_unitaire * p.qte).toFixed(2)} DH</span>
//                                     <button onClick={() => supprimerDuPanier(p.id)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total HT</span><span>{totalHT.toFixed(2)} DH</span></div>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#4158D0', marginTop: '10px' }}>
//                             <span>TOTAL TTC</span><span>{totalTTC.toFixed(2)} DH</span>
//                         </div>
//                     </div>

//                     <button style={s.btn} onClick={validerEtGenererFacture}>
//                         VALIDER ET TÉLÉCHARGER PDF
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

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
    const [refInterne, setRefInterne] = useState("");

    useEffect(() => {
        const clientsRef = ref(db, 'clients');
        const unsubscribe = onValue(clientsRef, (snap) => {
            const d = snap.val();
            if (d) setClients(Object.entries(d).map(([id, v]) => ({ id, ...v })));
        });

        jsonService.getArticles()
            .then(data => setArticles(data))
            .catch(err => console.error("Erreur articles:", err));

        return () => unsubscribe();
    }, []);

    const ajouterAuPanier = (idArt) => {
        const art = articles.find(a => a.id === idArt);
        const nouvelleLigne = {
            ...art,
            qte: 1,
            cartId: Date.now() + Math.random()
        };
        setPanier([...panier, nouvelleLigne]);
    };

    const modifierQte = (cartId, nouvelleQte) => {
        const qte = parseInt(nouvelleQte);
        if (isNaN(qte) || qte < 1) return;
        setPanier(panier.map(p => p.cartId === cartId ? { ...p, qte: qte } : p));
    };

    const supprimerDuPanier = (cartId) => {
        setPanier(panier.filter(p => p.cartId !== cartId));
    };

    const totalHT = panier.reduce((acc, curr) => acc + (Number(curr.prix_unitaire) * curr.qte), 0);
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    const genererPDF = (infosC, numeroFacture) => {
        const doc = new jsPDF();

        // Regroupement des articles identiques pour le PDF
        const panierGroupe = panier.reduce((acc, item) => {
            const existing = acc.find(a => a.id === item.id);
            if (existing) {
                existing.qte += item.qte;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("The Ledger", 15, 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("75000 Paris, France", 15, 26);
        doc.text("Contac.TheLedger@entreprise.com", 15, 31);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("FACTURE", 140, 20);
        doc.setFontSize(10);
        doc.text(`N° Facture: ${numeroFacture}`, 140, 28);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 140, 34);

        doc.setFont("helvetica", "bold");
        doc.text("Facturé à :", 15, 55);
        doc.text(`${infosC.nom.toUpperCase()}`, 15, 62);
        doc.setFont("helvetica", "normal");
        doc.text(`${infosC.adresse || 'Adresse non renseignée'}`, 15, 68);

        autoTable(doc, {
            startY: 80,
            head: [['QTÉ', 'DÉSIGNATION', 'PRIX UNIT. HT', 'MONTANT HT']],
            body: panierGroupe.map(p => [
                p.qte,
                p.designation,
                `${Number(p.prix_unitaire).toFixed(2)}`,
                `${(p.prix_unitaire * p.qte).toFixed(2)}`
            ]),
            styles: { font: "helvetica", fontSize: 9 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            columnStyles: { 0: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
            theme: 'grid'
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        autoTable(doc, {
            startY: finalY,
            margin: { left: 120 },
            body: [
                ['Total HT', `${totalHT.toFixed(2)} DH`],
                ['TVA (20%)', `${tva.toFixed(2)} DH`],
                ['TOTAL TTC', `${totalTTC.toFixed(2)} DH`]
            ],
            styles: { font: "helvetica", fontSize: 10 },
            theme: 'plain'
        });

        doc.setFont("helvetica", "bold");
        doc.text("Signature", 150, doc.lastAutoTable.finalY + 20);

        // --- MODIFICATION ICI : NOM DU FICHIER = NUMÉRO DE FACTURE ---
        doc.save(`${numeroFacture}.pdf`);
    };

    const validerEtGenererFacture = async () => {
        if (!clientSelectionne || panier.length === 0) {
            return alert("Veuillez sélectionner un client et ajouter des articles.");
        }

        const infosC = clients.find(c => c.id === clientSelectionne);
        const numeroFacture = `FAC-${Math.floor(100000 + Math.random() * 900000)}`;

        const panierGroupe = panier.reduce((acc, item) => {
            const existing = acc.find(a => a.id === item.id);
            if (existing) {
                existing.qte += item.qte;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);

        const nouvelleFacture = {
            numero: numeroFacture,
            date_creation: new Date().toISOString(),
            client_id: clientSelectionne,
            client_nom: infosC.nom,
            articles: panierGroupe,
            total_ht: totalHT,
            tva: tva,
            total_ttc: totalTTC,
            statut: "En attente",
            ref_interne: refInterne
        };

        try {
            await push(ref(db, 'factures'), nouvelleFacture);
            genererPDF(infosC, numeroFacture);
            setPanier([]);
            setClientSelectionne("");
            setRefInterne("");
            alert("Facture générée avec succès !");
        } catch (e) {
            alert("Erreur lors de l'enregistrement.");
        }
    };

    const clientInfos = clients.find(c => c.id === clientSelectionne);

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 px-8 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="text-xl font-headline font-bold text-primary tracking-tight">Drafting Module</h2>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Édition de factures</p>
                </div>
                <button
                    onClick={validerEtGenererFacture}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-headline font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    Générer & Enregistrer
                </button>
            </header>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-50">
                            <h3 className="text-lg font-headline text-slate-800 font-semibold flex items-center gap-3 mb-8">
                                <span className="p-2 bg-primary/10 rounded-lg text-primary material-symbols-outlined">person</span>
                                Détails du Client
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Choisir un client</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                        value={clientSelectionne}
                                        onChange={(e) => setClientSelectionne(e.target.value)}
                                    >
                                        <option value="">Sélectionner dans la base...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Adresse de facturation</label>
                                    <div className="p-4 bg-slate-50 rounded-xl min-h-[90px] text-xs text-slate-500 leading-relaxed italic border border-dashed border-slate-200">
                                        {clientInfos ? clientInfos.adresse : "Veuillez sélectionner un client."}
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Référence Interne</label>
                                    <input
                                        className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="ex: PROJET-X"
                                        type="text"
                                        value={refInterne}
                                        onChange={(e) => setRefInterne(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-50">
                            <h3 className="text-lg font-headline text-slate-800 font-semibold mb-6 flex justify-between items-center">
                                Services Disponibles
                                <span className="text-[10px] bg-blue-50 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-bold">Catalogue</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {articles.map(a => (
                                    <button
                                        key={a.id}
                                        onClick={() => ajouterAuPanier(a.id)}
                                        className="p-4 border border-slate-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 text-left transition-all flex justify-between items-center group active:scale-[0.98]"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{a.designation}</p>
                                            <p className="text-xs font-bold text-primary mt-1">{Number(a.prix_unitaire).toLocaleString()} DH</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors">add_circle</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-[#1a237e] text-white rounded-2xl p-8 shadow-xl">
                            <h3 className="text-lg font-headline font-semibold flex items-center gap-3 mb-8">
                                <span className="material-symbols-outlined text-blue-300">analytics</span>
                                Résumé Financier
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-white/70">
                                    <span>Total HT</span>
                                    <span className="font-bold text-white">{totalHT.toLocaleString()} DH</span>
                                </div>
                                <div className="flex justify-between text-sm text-white/70">
                                    <span>TVA (20%)</span>
                                    <span className="font-bold text-white">{tva.toLocaleString()} DH</span>
                                </div>
                                <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300">Total TTC</p>
                                        <p className="text-3xl font-extrabold tracking-tighter mt-1">{totalTTC.toLocaleString()}</p>
                                    </div>
                                    <span className="text-sm font-bold mb-1 ml-1">DH</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50">
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">shopping_cart</span> Panier
                            </p>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                                {panier.map(p => (
                                    <div key={p.cartId} className="p-4 bg-slate-50 rounded-xl space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-slate-700 leading-tight">{p.designation}</span>
                                            <button onClick={() => supprimerDuPanier(p.cartId)} className="text-red-400 hover:text-red-600">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center bg-white border border-slate-100 rounded-lg p-1">
                                                <input
                                                    type="number"
                                                    value={p.qte}
                                                    onChange={(e) => modifierQte(p.cartId, e.target.value)}
                                                    className="w-10 text-xs font-bold border-none p-0 text-center focus:ring-0"
                                                />
                                            </div>
                                            <span className="text-xs font-extrabold text-primary">
                                                {(p.prix_unitaire * p.qte).toLocaleString()} DH
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {panier.length === 0 && <p className="text-center text-slate-400 text-xs italic py-4">Panier vide</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Facturation;