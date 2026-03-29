import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, push, onValue, remove } from "firebase/database";

function Article() {
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState("");
    // On ajoute des icônes directement dans les valeurs pour le look
    const [categorie, setCategorie] = useState("⚡ Technologie");
    const [tousLesArticles, setTousLesArticles] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [triType, setTriType] = useState("recent");

    useEffect(() => {
        const articlesRef = ref(db, 'articles');
        onValue(articlesRef, (snapshot) => {
            const donnees = snapshot.val();
            if (donnees) {
                const listeTemp = Object.entries(donnees).map(([id, valeur]) => ({
                    id,
                    ...valeur,
                    timestamp: Number(valeur.timestamp) || 0
                }));
                setTousLesArticles(listeTemp);
            } else { setTousLesArticles([]); }
        });
    }, []);

    const ajouterArticle = (e) => {
        e.preventDefault();
        if (!nom || !prix) return;

        push(ref(db, 'articles'), {
            designation: nom,
            prix_unitaire: Number(prix),
            categorie: categorie,
            timestamp: Date.now(), // CLÉ DE TRI UNIQUE ET PRÉCISE
            dateAjout: new Date().toLocaleDateString('fr-FR')
        });
        setNom(""); setPrix(""); // Reset formulaire
    };

    // --- LOGIQUE DE TRI ROBUSTE CORRIGÉE ---
    const articlesFiltres = tousLesArticles
        .filter(a => a.designation.toLowerCase().includes(recherche.toLowerCase()))
        .sort((a, b) => {
            if (triType === "recent") return b.timestamp - a.timestamp; // Plus grand (récent) en premier
            if (triType === "ancien") return a.timestamp - b.timestamp; // Plus petit (ancien) en premier
            if (triType === "prixAsc") return a.prix_unitaire - b.prix_unitaire; // Croissant
            if (triType === "prixDesc") return b.prix_unitaire - a.prix_unitaire; // Décroissant
            return 0;
        });

    // --- STYLES "SAAS COLORÉ" ---
    const s = {
        // Fond teinté d'un bleu très pâle pour le contraste
        page: { minHeight: '100vh', backgroundColor: '#f4f7fe', padding: '40px', fontFamily: "'Poppins', sans-serif" },
        container: { maxWidth: '1200px', margin: '0 auto' },

        // Titre en dégradé
        gradientTitle: {
            fontSize: '36px', fontWeight: '800',
            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
        },

        // Barre de recherche style "iOS" avec bordure discrète
        searchSection: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#fff', padding: '15px 25px', borderRadius: '50px',
            boxShadow: '0 5px 20px rgba(65, 88, 208, 0.08)', marginBottom: '30px',
            border: '1px solid #eef2ff'
        },

        // Formulaire compact et élégant (vibe Apple-style)
        formCard: {
            backgroundColor: '#fff', padding: '25px', borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(65, 88, 208, 0.1)', marginBottom: '40px',
            display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #eef2ff'
        },
        input: { padding: '12px 20px', borderRadius: '15px', border: '1px solid #eef2f7', backgroundColor: '#fafcff', outline: 'none', flex: 1, fontSize: '14px' },

        // Bouton en dégradé brillant
        btnGradient: {
            padding: '12px 30px', borderRadius: '15px', border: 'none',
            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
            color: '#fff', fontWeight: '600', cursor: 'pointer', transition: '0.3s',
            boxShadow: '0 4px 15px rgba(200, 80, 192, 0.4)'
        },

        // Grille de cartes
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },

        // Carte produit avec une petite bordure colorée discrète en haut
        productCard: {
            backgroundColor: '#fff', borderRadius: '24px', padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9',
            borderTop: '5px solid #4158D0', // Accent de couleur
            transition: 'all 0.3s ease', position: 'relative'
        },
        // Prix mis en valeur en bleu
        price: { fontSize: '26px', fontWeight: '800', color: '#4158D0', margin: '15px 0' },
        // Pastille de catégorie colorée
        tag: { padding: '6px 14px', borderRadius: '12px', fontSize: '11px', background: '#eef2ff', color: '#4158D0', fontWeight: 'bold', textTransform: 'uppercase' }
    };

    return (
        <div style={s.page}>
            <div style={s.container}>

                <h1 style={s.gradientTitle}>Catalogue du Stock</h1>
                <p style={{ color: '#718096', marginBottom: '40px', fontSize: '14px' }}>Supervisez, cherchez et triez vos produits en temps réel.</p>

                {/* 1. BARRE DE RECHERCHE & TRI (Style iOS) */}
                <div style={s.searchSection}>
                    <input
                        style={{ border: 'none', outline: 'none', fontSize: '16px', width: '60%', color: '#333' }}
                        placeholder="🔍 Recherche rapide..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Trier par :</span>
                        <select
                            style={{ border: 'none', background: '#eef2ff', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', color: '#4158D0', fontWeight: '600' }}
                            value={triType}
                            onChange={(e) => setTriType(e.target.value)}
                        >
                            <option value="recent">Plus récents</option>
                            <option value="ancien">Plus anciens</option>
                            <option value="prixAsc">Prix croissant</option>
                            <option value="prixDesc">Prix décroissant</option>
                        </select>
                    </div>
                </div>

                {/* 2. FORMULAIRE D'AJOUT (Style Apple/SaaS) */}
                <form onSubmit={ajouterArticle} style={s.formCard}>
                    <input style={s.input} placeholder="Désignation de l'article" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    <input style={s.input} type="number" placeholder="Prix (DH)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                    <select style={{ ...s.input, flex: 0.6 }} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                        <option value="⚡ Technologie">⚡ Technologie</option>
                        <option value="🛠️ Services">🛠️ Services</option>
                        <option value="📦 Fournitures">📦 Fournitures</option>
                    </select>
                    <button type="submit" style={s.btnGradient}>AJOUTER</button>
                </form>

                {/* 3. GRILLE DE CARTES PRODUITS FILTRÉS ET TRIÉS */}
                <div style={s.grid}>
                    {articlesFiltres.map((art) => (
                        <div key={art.id} style={s.productCard} className="card-hover">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={s.tag}>{art.categorie}</span>
                                <button
                                    onClick={() => remove(ref(db, `articles/${art.id}`))}
                                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '18px', transition: '0.2s' }}
                                    className="btn-delete"
                                >
                                    ×
                                </button>
                            </div>

                            <h3 style={{ fontSize: '19px', color: '#1e293b', margin: '15px 0 5px 0', fontWeight: '700' }}>{art.designation}</h3>
                            <p style={{ fontSize: '11px', color: '#a0aec0' }}>Référence: {art.id.substring(1, 7).toUpperCase()}</p>

                            <div style={s.price}>
                                {art.prix_unitaire.toLocaleString()} <span style={{ fontSize: '14px', color: '#718096' }}>DH</span>
                            </div>

                            <div style={{ fontSize: '11px', color: '#718096', textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontStyle: 'italic' }}>
                                Ajouté le {art.dateAjout}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Petit effet CSS au survol des cartes et boutons */}
            <style>{`
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(65, 88, 208, 0.1) !important;
          border-color: #e0e6ff;
        }
        .btn-delete:hover { color: #ff7675 !important; transform: scale(1.2); }
        button:hover { opacity: 0.9; }
        input:focus, select:focus { border-color: #4158D0 !important; background-color: #ffffff !important; }
      `}</style>
        </div>
    );
}

export default Article;