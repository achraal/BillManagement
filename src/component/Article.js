// import React, { useState, useEffect } from 'react';
// import { jsonService } from '../services/jsonService';

// function Article() {
//     const [nom, setNom] = useState("");
//     const [prix, setPrix] = useState("");
//     const [categorieId, setCategorieId] = useState(1); 
//     const [tousLesArticles, setTousLesArticles] = useState([]);
//     const [categories, setCategories] = useState([]); 
//     const [recherche, setRecherche] = useState("");

//     // --- OBJETS DE STYLE (Indispensable pour éviter l'erreur "s is not defined") ---
//     const s = {
//         page: { minHeight: '100vh', backgroundColor: '#f4f7fe', padding: '40px' },
//         container: { maxWidth: '1200px', margin: '0 auto' },
//         gradientTitle: { fontSize: '36px', fontWeight: '800', color: '#4158D0', marginBottom: '10px' },
//         formCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', display: 'flex', gap: '15px', marginBottom: '40px' },
//         input: { padding: '12px 20px', borderRadius: '15px', border: '1px solid #eef2f7', flex: 1 },
//         btnGradient: { padding: '12px 30px', borderRadius: '15px', background: 'linear-gradient(45deg, #4158D0, #C850C0)', color: '#fff', border: 'none', cursor: 'pointer' },
//         grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
//         productCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '25px', borderTop: '5px solid #4158D0' },
//         price: { fontSize: '26px', fontWeight: '800', color: '#4158D0' },
//         tag: { padding: '6px 14px', borderRadius: '12px', fontSize: '11px', background: '#eef2ff', color: '#4158D0' }
//     };

//     useEffect(() => {
//         const loadData = async () => {
//             const articles = await jsonService.getArticles();
//             const cats = await jsonService.getCategories();
//             setTousLesArticles(articles);
//             setCategories(cats);
//         };
//         loadData();
//     }, []);

//     const ajouterArticle = async (e) => {
//         e.preventDefault();
//         if (!nom || !prix) return;

//         const nouvelArticle = {
//             designation: nom,
//             prix_unitaire: Number(prix),
//             categorie_id: Number(categorieId)
//         };

//         const saved = await jsonService.addArticle(nouvelArticle);
//         setTousLesArticles([...tousLesArticles, saved]);
//         setNom(""); setPrix(""); 
//     };

//     const getCategorieNom = (id) => {
//         const cat = categories.find(c => c.id === Number(id));
//         return cat ? cat.nom : "Chargement...";
//     };

//     return (
//         <div style={s.page}>
//             <div style={s.container}>
//                 <h1 style={s.gradientTitle}>Gestion des Articles (ADMIN)</h1> 
                
//                 <form onSubmit={ajouterArticle} style={s.formCard}>
//                     <input style={s.input} placeholder="Désignation" value={nom} onChange={(e) => setNom(e.target.value)} required />
//                     <input style={s.input} type="number" placeholder="Prix (DH)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                    
//                     <select 
//                         style={{ ...s.input, flex: 0.6 }} 
//                         value={categorieId} 
//                         onChange={(e) => setCategorieId(e.target.value)}
//                     >
//                         {categories.map(cat => (
//                             <option key={cat.id} value={cat.id}>{cat.nom}</option>
//                         ))}
//                     </select>
                    
//                     <button type="submit" style={s.btnGradient}>AJOUTER</button>
//                 </form>

//                 <div style={s.grid}>
//                     {tousLesArticles
//                         .filter(a => a.designation.toLowerCase().includes(recherche.toLowerCase()))
//                         .map((art) => (
//                         <div key={art.id} style={s.productCard}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                 <span style={s.tag}>{getCategorieNom(art.categorie_id)}</span>
//                                 <button onClick={() => jsonService.deleteArticle(art.id).then(() => setTousLesArticles(tousLesArticles.filter(x => x.id !== art.id)))}>×</button>
//                             </div>
//                             <h3>{art.designation}</h3>
//                             <div style={s.price}>{art.prix_unitaire} DH</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Article;
import React, { useState, useEffect } from 'react';
import { jsonService } from '../services/jsonService';

function Article() {
    const [nom, setNom] = useState("");
    const [prix, setPrix] = useState("");
    const [categorieId, setCategorieId] = useState("1");
    const [tousLesArticles, setTousLesArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const articles = await jsonService.getArticles();
                const cats = await jsonService.getCategories();
                setTousLesArticles(articles);
                setCategories(cats);
                if (cats.length > 0) setCategorieId(cats[0].id);
            } catch (error) {
                console.error("Erreur de chargement:", error);
            }
        };
        loadData();
    }, []);

    const ajouterArticle = async (e) => {
    e.preventDefault();
    if (!nom || !prix) return;

    const nouvelArticle = {
        designation: nom,
        prix_unitaire: Number(prix),
        // Conversion en Number pour correspondre au JSON
        categorie_id: Number(categorieId) 
    };

    const saved = await jsonService.addArticle(nouvelArticle);
    setTousLesArticles([...tousLesArticles, saved]);
    setNom(""); 
    setPrix("");
    setIsAdding(false);
};

    const supprimerArticle = async (id) => {
        if (window.confirm("Supprimer cet article ?")) {
            await jsonService.deleteArticle(id);
            setTousLesArticles(tousLesArticles.filter(x => x.id !== id));
        }
    };

    const getCategorieNom = (art) => {
    if (art.categorie_id) {
        // On force la comparaison entre nombres
        const cat = categories.find(c => Number(c.id) === Number(art.categorie_id));
        return cat ? cat.nom : "Non classé"; 
    }
    return "Général";
};

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Search (TON CODE ORIGINAL) */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 py-4 shadow-sm">
                <div className="flex items-center gap-6 flex-1">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-900/20 placeholder:text-slate-400 font-body outline-none" 
                            placeholder="Search in ledger..." 
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 font-body">The Ledger</span>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">TL</div>
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto">
                {/* Hero (TON CODE ORIGINAL) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block font-body">Curation Hub</span>
                        <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2 font-headline">Article Management</h2>
                        <p className="text-slate-500 text-lg max-w-lg font-body">Manage designations, categories, and financial anchors.</p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg shadow-lg hover:shadow-blue-900/20 transition-all font-bold active:scale-95"
                    >
                        <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
                        <span>{isAdding ? 'Cancel' : 'Add Article'}</span>
                    </button>
                </div>

                {/* Formulaire d'ajout (TON CODE ORIGINAL) */}
                {isAdding && (
                    <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-xl font-bold text-primary mb-6 font-headline">New Catalog Entry</h3>
                        <form onSubmit={ajouterArticle} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input 
                                className="bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-900/20 outline-none font-body" 
                                placeholder="Désignation" 
                                value={nom} 
                                onChange={(e) => setNom(e.target.value)} 
                                required 
                            />
                            <input 
                                className="bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-900/20 font-bold outline-none font-body" 
                                type="number" 
                                placeholder="Prix (DH)" 
                                value={prix} 
                                onChange={(e) => setPrix(e.target.value)} 
                                required 
                            />
                            <select 
                                className="bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-900/20 outline-none font-body"
                                value={categorieId} 
                                onChange={(e) => setCategorieId(Number(e.target.value))}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>
                            <button type="submit" className="bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-container transition-colors shadow-md font-body text-sm">
                                Confirm Addition
                            </button>
                        </form>
                    </div>
                )}

                {/* Table (TON CODE ORIGINAL) */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                    <table className="w-full text-left border-collapse font-body">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Designation</th>
                                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Category</th>
                                <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Unit Price</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tousLesArticles
                                .filter(a => a.designation.toLowerCase().includes(recherche.toLowerCase()))
                                .map((art) => (
                                    <tr key={art.id} className="group hover:bg-slate-50 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">inventory_2</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary font-headline text-sm">{art.designation}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">SKU: {art.id.toString().substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {getCategorieNom(art)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-primary text-lg">{art.prix_unitaire?.toLocaleString()} <span className="text-[10px] text-slate-400">DH</span></p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => supprimerArticle(art.id)}
                                                className="p-2 text-slate-300 hover:text-on-error-container hover:bg-error-container rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Article;