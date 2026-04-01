// import React, { useState, useEffect } from 'react';
// import { jsonService } from '../services/jsonService';

// function Settings() {
//     const [articles, setArticles] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [nouvelArticle, setNouvelArticle] = useState({ designation: '', prix_unitaire: '', categorie: '' });
//     const [editionId, setEditionId] = useState(null); // ID de l'article en cours d'édition

//     useEffect(() => {
//         chargerDonnees();
//     }, []);

//     const chargerDonnees = () => {
//         jsonService.getArticles().then(setArticles);
//         fetch('http://localhost:3001/categories').then(res => res.json()).then(setCategories);
//     };

//     // Préparer le formulaire pour la modification
//     const preparerEdition = (article) => {
//         setEditionId(article.id);
//         setNouvelArticle({
//             designation: article.designation,
//             prix_unitaire: article.prix_unitaire,
//             categorie: article.categorie || ''
//         });
//     };

//     const annulerEdition = () => {
//         setEditionId(null);
//         setNouvelArticle({ designation: '', prix_unitaire: '', categorie: '' });
//     };

//     const soumettreFormulaire = (e) => {
//         e.preventDefault();
//         const articleData = { ...nouvelArticle, prix_unitaire: Number(nouvelArticle.prix_unitaire) };

//         if (editionId) {
//             // MODE UPDATE (PUT)
//             fetch(`http://localhost:3001/articles/${editionId}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(articleData)
//             }).then(() => {
//                 annulerEdition();
//                 chargerDonnees();
//             });
//         } else {
//             // MODE AJOUT (POST)
//             fetch('http://localhost:3001/articles', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(articleData)
//             }).then(() => {
//                 setNouvelArticle({ designation: '', prix_unitaire: '', categorie: '' });
//                 chargerDonnees();
//             });
//         }
//     };

//     const supprimerArticle = (id) => {
//         if(window.confirm("Supprimer cet article ?")) {
//             fetch(`http://localhost:3001/articles/${id}`, { method: 'DELETE' }).then(chargerDonnees);
//         }
//     };

//     const s = {
//         card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
//         input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' },
//         btn: (isEdit) => ({ 
//             padding: '12px 20px', 
//             backgroundColor: isEdit ? '#f59e0b' : '#4158D0', 
//             color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
//         }),
//         btnAction: { border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '10px' }
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>⚙️ Paramètres & Catalogue</h2>

//             {/* FORMULAIRE (AJOUT OU ÉDITION) */}
//             <div style={{ ...s.card, borderLeft: editionId ? '5px solid #f59e0b' : '5px solid #4158D0' }}>
//                 <h3 style={{ marginBottom: '15px' }}>{editionId ? "Modifier l'article" : "Ajouter un Article"}</h3>
//                 <form onSubmit={soumettreFormulaire} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
//                     <input style={s.input} placeholder="Désignation" value={nouvelArticle.designation} onChange={e => setNouvelArticle({...nouvelArticle, designation: e.target.value})} required />
//                     <input style={s.input} type="number" placeholder="Prix HT" value={nouvelArticle.prix_unitaire} onChange={e => setNouvelArticle({...nouvelArticle, prix_unitaire: e.target.value})} required />
//                     <select style={s.input} value={nouvelArticle.categorie} onChange={e => setNouvelArticle({...nouvelArticle, categorie: e.target.value})}>
//                         <option value="">Catégorie...</option>
//                         {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
//                     </select>
//                     <button type="submit" style={s.btn(editionId)}>
//                         {editionId ? "💾 Enregistrer" : "➕ Ajouter"}
//                     </button>
//                     {editionId && (
//                         <button type="button" onClick={annulerEdition} style={{ ...s.btn(false), backgroundColor: '#94a3b8' }}>
//                             Annuler
//                         </button>
//                     )}
//                 </form>
//             </div>

//             {/* LISTE */}
//             <div style={s.card}>
//                 <h3 style={{ marginBottom: '15px' }}>Catalogue Actuel ({articles.length})</h3>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead>
//                         <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
//                             <th style={{ padding: '12px' }}>DÉSIGNATION</th>
//                             <th>CATÉGORIE</th>
//                             <th>PRIX HT</th>
//                             <th style={{ textAlign: 'right' }}>ACTIONS</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {articles.map(a => (
//                             <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                                 <td style={{ padding: '15px 12px', fontWeight: '600' }}>{a.designation}</td>
//                                 <td style={{ color: '#64748b' }}>{a.categorie || '-'}</td>
//                                 <td style={{ fontWeight: 'bold', color: '#4158D0' }}>{a.prix_unitaire} DH</td>
//                                 <td style={{ textAlign: 'right' }}>
//                                     <button onClick={() => preparerEdition(a)} style={{ ...s.btnAction, color: '#f59e0b' }}>Modifier</button>
//                                     <button onClick={() => supprimerArticle(a.id)} style={{ ...s.btnAction, color: '#ef4444' }}>Supprimer</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Settings;

import React, { useState, useEffect } from 'react';
import { jsonService } from '../services/jsonService';

function Settings() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nouvelArticle, setNouvelArticle] = useState({ designation: '', prix_unitaire: '', categorie_id: '' });
    const [editionId, setEditionId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
    setLoading(true);
    try {
        const dataArticles = await jsonService.getArticles();
        // Vérifie si c'est bien un tableau, sinon met un tableau vide
        setArticles(Array.isArray(dataArticles) ? dataArticles : []);
        
        const resCat = await fetch('http://localhost:3001/categories');
        const dataCat = await resCat.json();

        // Sécurité CRITIQUE : on vérifie que c'est un tableau
        if (Array.isArray(dataCat)) {
            setCategories(dataCat);
        } else if (dataCat && dataCat.categories) { 
            // Au cas où json-server renvoie l'objet complet
            setCategories(dataCat.categories);
        } else {
            setCategories([]);
        }
    } catch (err) {
        console.error("Erreur de synchronisation:", err);
        setCategories([]); // Éviter que l'UI plante
    } finally {
        setLoading(false);
    }
};

    const preparerEdition = (article) => {
    setEditionId(article.id);
    setNouvelArticle({
        designation: article.designation,
        prix_unitaire: article.prix_unitaire,
        categorie_id: article.categorie_id || '' // Utilise categorie_id ici
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

    const annulerEdition = () => {
        setEditionId(null);
        setNouvelArticle({ designation: '', prix_unitaire: '', categorie: '' });
    };

    const soumettreFormulaire = async (e) => {
    if (e) e.preventDefault();
    if (!nouvelArticle.designation || !nouvelArticle.prix_unitaire) return;

    // 1. On prépare l'objet de base (sans l'ID pour l'instant)
    const articleData = {
        designation: nouvelArticle.designation,
        prix_unitaire: Number(nouvelArticle.prix_unitaire),
        categorie_id: Number(nouvelArticle.categorie_id)
    };

    // 2. Si c'est une création (pas d'editionId), on calcule le nouvel ID numérique
    if (!editionId) {
        const dernierId = articles.length > 0 
            ? Math.max(...articles.map(a => Number(a.id))) 
            : 0;
        articleData.id = (dernierId + 1)
    }

    const url = editionId ? `http://localhost:3001/articles/${editionId}` : 'http://localhost:3001/articles';
    const method = editionId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        });

        if (response.ok) {
            annulerEdition();
            chargerDonnees();
        }
    } catch (err) {
        alert("Erreur lors de la sauvegarde.");
    }
};

    const supprimerArticle = async (id) => {
        if (window.confirm("Supprimer cet article définitivement ?")) {
            try {
                await fetch(`http://localhost:3001/articles/${id}`, { method: 'DELETE' });
                chargerDonnees();
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <main className="flex-1 flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 py-4 shadow-sm">
                <div>
                    <h2 className="text-xl font-headline font-bold text-primary">Global Configuration</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestion du catalogue articles</p>
                </div>
                <div className="flex gap-3">
                    {editionId && (
                        <button onClick={annulerEdition} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
                            Discard Edition
                        </button>
                    )}
                    <button 
                        onClick={soumettreFormulaire}
                        disabled={!nouvelArticle.designation || !nouvelArticle.prix_unitaire}
                        className="px-6 py-2 bg-primary disabled:bg-slate-300 text-white rounded-xl text-sm font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {editionId ? 'Save Changes' : 'Create Article'}
                    </button>
                </div>
            </header>

            <section className="p-10 max-w-7xl mx-auto w-full space-y-10">
                <div className="grid grid-cols-12 gap-8">
                    
                    {/* LEFT: Formulaire */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className={`bg-white p-8 rounded-2xl shadow-sm border-t-4 transition-all ${editionId ? 'border-amber-500 shadow-amber-100' : 'border-primary'}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <span className={`material-symbols-outlined ${editionId ? 'text-amber-500' : 'text-primary'}`}>
                                    {editionId ? 'edit_note' : 'add_circle'}
                                </span>
                                <h3 className="font-headline font-bold text-slate-700">
                                    {editionId ? 'Modify Record' : 'New Entry'}
                                </h3>
                            </div>

                            <form onSubmit={soumettreFormulaire} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Désignation</label>
                                    <input 
                                        className="w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm py-3.5 px-4 transition-all"
                                        placeholder="ex: Laptop Dell XPS"
                                        value={nouvelArticle.designation}
                                        onChange={e => setNouvelArticle({...nouvelArticle, designation: e.target.value})}
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prix HT (DH)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm py-3.5 px-4 font-bold"
                                        placeholder="0.00"
                                        value={nouvelArticle.prix_unitaire}
                                        onChange={e => setNouvelArticle({...nouvelArticle, prix_unitaire: e.target.value})}
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catégorie</label>
                                    <select 
                                        className="w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm py-3.5 px-4 appearance-none cursor-pointer"
                                        value={nouvelArticle.categorie_id}
                                        onChange={e => setNouvelArticle({...nouvelArticle, categorie_id: Number(e.target.value)})}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.nom}</option> 
                                        ))}
                                    </select>
                                    
                                </div>
                            </form>
                        </div>

                        {/* Status Card */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 bg-white/10 rounded-lg material-symbols-outlined text-secondary">database</span>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Inventory Status</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-4xl font-headline font-extrabold">{articles.length}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Articles référencés</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2 ${loading ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                                    {loading ? 'SYNCING...' : 'LIVE'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Table */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                                <h3 className="font-headline font-bold text-slate-700">Master Catalogue</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Connected to local node</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-50">
                                            <th className="text-left px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Désignation</th>
                                            <th className="text-left px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catégorie</th>
                                            <th className="text-left px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prix Unit.</th>
                                            <th className="text-right px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {articles.map(a => (
                                            <tr key={a.id} className={`hover:bg-slate-50/80 transition-colors group ${editionId === a.id ? 'bg-amber-50/50' : ''}`}>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-slate-700">{a.designation}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                                                        {categories.find(c => Number(c.id) === Number(a.categorie_id))?.nom || 'Général'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-extrabold text-primary">{Number(a.prix_unitaire).toLocaleString()} DH</p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => preparerEdition(a)}
                                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                            title="Modifier"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => supprimerArticle(a.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Supprimer"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {articles.length === 0 && !loading && (
                                    <div className="p-20 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-200">inventory</span>
                                        <p className="text-sm italic">Aucun article trouvé dans la base.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}

export default Settings;