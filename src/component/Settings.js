import React, { useState, useEffect } from 'react';
import { jsonService } from '../services/jsonService';

function Settings() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nouvelArticle, setNouvelArticle] = useState({ designation: '', prix_unitaire: '', categorie: '' });
    const [editionId, setEditionId] = useState(null); // ID de l'article en cours d'édition

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = () => {
        jsonService.getArticles().then(setArticles);
        fetch('http://localhost:3001/categories').then(res => res.json()).then(setCategories);
    };

    // Préparer le formulaire pour la modification
    const preparerEdition = (article) => {
        setEditionId(article.id);
        setNouvelArticle({
            designation: article.designation,
            prix_unitaire: article.prix_unitaire,
            categorie: article.categorie || ''
        });
    };

    const annulerEdition = () => {
        setEditionId(null);
        setNouvelArticle({ designation: '', prix_unitaire: '', categorie: '' });
    };

    const soumettreFormulaire = (e) => {
        e.preventDefault();
        const articleData = { ...nouvelArticle, prix_unitaire: Number(nouvelArticle.prix_unitaire) };

        if (editionId) {
            // MODE UPDATE (PUT)
            fetch(`http://localhost:3001/articles/${editionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            }).then(() => {
                annulerEdition();
                chargerDonnees();
            });
        } else {
            // MODE AJOUT (POST)
            fetch('http://localhost:3001/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            }).then(() => {
                setNouvelArticle({ designation: '', prix_unitaire: '', categorie: '' });
                chargerDonnees();
            });
        }
    };

    const supprimerArticle = (id) => {
        if(window.confirm("Supprimer cet article ?")) {
            fetch(`http://localhost:3001/articles/${id}`, { method: 'DELETE' }).then(chargerDonnees);
        }
    };

    const s = {
        card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
        input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' },
        btn: (isEdit) => ({ 
            padding: '12px 20px', 
            backgroundColor: isEdit ? '#f59e0b' : '#4158D0', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
        }),
        btnAction: { border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '10px' }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>⚙️ Paramètres & Catalogue</h2>

            {/* FORMULAIRE (AJOUT OU ÉDITION) */}
            <div style={{ ...s.card, borderLeft: editionId ? '5px solid #f59e0b' : '5px solid #4158D0' }}>
                <h3 style={{ marginBottom: '15px' }}>{editionId ? "Modifier l'article" : "Ajouter un Article"}</h3>
                <form onSubmit={soumettreFormulaire} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <input style={s.input} placeholder="Désignation" value={nouvelArticle.designation} onChange={e => setNouvelArticle({...nouvelArticle, designation: e.target.value})} required />
                    <input style={s.input} type="number" placeholder="Prix HT" value={nouvelArticle.prix_unitaire} onChange={e => setNouvelArticle({...nouvelArticle, prix_unitaire: e.target.value})} required />
                    <select style={s.input} value={nouvelArticle.categorie} onChange={e => setNouvelArticle({...nouvelArticle, categorie: e.target.value})}>
                        <option value="">Catégorie...</option>
                        {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                    </select>
                    <button type="submit" style={s.btn(editionId)}>
                        {editionId ? "💾 Enregistrer" : "➕ Ajouter"}
                    </button>
                    {editionId && (
                        <button type="button" onClick={annulerEdition} style={{ ...s.btn(false), backgroundColor: '#94a3b8' }}>
                            Annuler
                        </button>
                    )}
                </form>
            </div>

            {/* LISTE */}
            <div style={s.card}>
                <h3 style={{ marginBottom: '15px' }}>Catalogue Actuel ({articles.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
                            <th style={{ padding: '12px' }}>DÉSIGNATION</th>
                            <th>CATÉGORIE</th>
                            <th>PRIX HT</th>
                            <th style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(a => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px 12px', fontWeight: '600' }}>{a.designation}</td>
                                <td style={{ color: '#64748b' }}>{a.categorie || '-'}</td>
                                <td style={{ fontWeight: 'bold', color: '#4158D0' }}>{a.prix_unitaire} DH</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => preparerEdition(a)} style={{ ...s.btnAction, color: '#f59e0b' }}>Modifier</button>
                                    <button onClick={() => supprimerArticle(a.id)} style={{ ...s.btnAction, color: '#ef4444' }}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Settings;