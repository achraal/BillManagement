import React, { useState, useEffect } from 'react';
import { jsonService } from '../services/jsonService';

function Article() {
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState("");
    const [categorieId, setCategorieId] = useState(1); 
    const [tousLesArticles, setTousLesArticles] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [recherche, setRecherche] = useState("");

    // --- OBJETS DE STYLE (Indispensable pour éviter l'erreur "s is not defined") ---
    const s = {
        page: { minHeight: '100vh', backgroundColor: '#f4f7fe', padding: '40px' },
        container: { maxWidth: '1200px', margin: '0 auto' },
        gradientTitle: { fontSize: '36px', fontWeight: '800', color: '#4158D0', marginBottom: '10px' },
        formCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', display: 'flex', gap: '15px', marginBottom: '40px' },
        input: { padding: '12px 20px', borderRadius: '15px', border: '1px solid #eef2f7', flex: 1 },
        btnGradient: { padding: '12px 30px', borderRadius: '15px', background: 'linear-gradient(45deg, #4158D0, #C850C0)', color: '#fff', border: 'none', cursor: 'pointer' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
        productCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '25px', borderTop: '5px solid #4158D0' },
        price: { fontSize: '26px', fontWeight: '800', color: '#4158D0' },
        tag: { padding: '6px 14px', borderRadius: '12px', fontSize: '11px', background: '#eef2ff', color: '#4158D0' }
    };

    useEffect(() => {
        const loadData = async () => {
            const articles = await jsonService.getArticles();
            const cats = await jsonService.getCategories();
            setTousLesArticles(articles);
            setCategories(cats);
        };
        loadData();
    }, []);

    const ajouterArticle = async (e) => {
        e.preventDefault();
        if (!nom || !prix) return;

        const nouvelArticle = {
            designation: nom,
            prix_unitaire: Number(prix),
            categorie_id: Number(categorieId)
        };

        const saved = await jsonService.addArticle(nouvelArticle);
        setTousLesArticles([...tousLesArticles, saved]);
        setNom(""); setPrix(""); 
    };

    const getCategorieNom = (id) => {
        const cat = categories.find(c => c.id === Number(id));
        return cat ? cat.nom : "Chargement...";
    };

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.gradientTitle}>Gestion des Articles (ADMIN)</h1> 
                
                <form onSubmit={ajouterArticle} style={s.formCard}>
                    <input style={s.input} placeholder="Désignation" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    <input style={s.input} type="number" placeholder="Prix (DH)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                    
                    <select 
                        style={{ ...s.input, flex: 0.6 }} 
                        value={categorieId} 
                        onChange={(e) => setCategorieId(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                    </select>
                    
                    <button type="submit" style={s.btnGradient}>AJOUTER</button>
                </form>

                <div style={s.grid}>
                    {tousLesArticles
                        .filter(a => a.designation.toLowerCase().includes(recherche.toLowerCase()))
                        .map((art) => (
                        <div key={art.id} style={s.productCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={s.tag}>{getCategorieNom(art.categorie_id)}</span>
                                <button onClick={() => jsonService.deleteArticle(art.id).then(() => setTousLesArticles(tousLesArticles.filter(x => x.id !== art.id)))}>×</button>
                            </div>
                            <h3>{art.designation}</h3>
                            <div style={s.price}>{art.prix_unitaire} DH</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Article;