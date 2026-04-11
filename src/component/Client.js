// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { ref, push, onValue, remove } from "firebase/database";

// function Client() {
//     const [nom, setNom] = useState("");
//     const [email, setEmail] = useState("");
//     const [tel, setTel] = useState("");
//     const [adresse, setAdresse] = useState(""); // État déjà présent, on va l'utiliser
//     const [tousLesClients, setTousLesClients] = useState([]);

//     useEffect(() => {
//         const maBase = ref(db, 'clients');
//         onValue(maBase, (snapshot) => {
//             const donnees = snapshot.val();
//             if (donnees) {
//                 const listeTemp = Object.entries(donnees).map(([id, valeur]) => ({ id, ...valeur }));
//                 setTousLesClients(listeTemp);
//             } else { setTousLesClients([]); }
//         });
//     }, []);

//     const validerFormulaire = (e) => {
//         e.preventDefault();
//         // Ajout de l'adresse dans l'objet envoyé à Firebase
//         push(ref(db, 'clients'), { 
//             nom, 
//             email, 
//             tel, 
//             adresse,
//             dateAjout: new Date().toLocaleDateString('fr-FR') 
//         });
//         setNom(""); setEmail(""); setTel(""); setAdresse("");
//     };

//     const s = {
//         wrapper: { minHeight: '100vh', backgroundColor: '#f8f9ff', padding: '40px', fontFamily: "'Poppins', sans-serif" },
//         container: { maxWidth: '1100px', margin: '0 auto' },
//         header: {
//             fontSize: '32px', fontWeight: '800',
//             background: 'linear-gradient(45deg, #4158D0, #C850C0)',
//             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//             marginBottom: '30px'
//         },
//         quickAdd: {
//             display: 'flex', gap: '15px', backgroundColor: '#ffffff', padding: '20px',
//             borderRadius: '20px', boxShadow: '0 10px 25px rgba(65, 88, 208, 0.1)',
//             border: '1px solid #e0e6ff', marginBottom: '40px', flexWrap: 'wrap' // wrap pour mobile
//         },
//         input: {
//             flex: 1, minWidth: '150px', padding: '12px 18px', backgroundColor: '#f0f2f9',
//             border: 'none', borderRadius: '12px', color: '#333',
//             outline: 'none', fontSize: '14px'
//         },
//         btnGradient: {
//             padding: '0 30px', background: 'linear-gradient(45deg, #4158D0, #507ac8ff)',
//             color: '#ffffff', border: 'none', borderRadius: '12px',
//             fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(80, 156, 200, 0.4)',
//             minHeight: '45px'
//         },
//         grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
//         card: {
//             backgroundColor: '#ffffff', borderRadius: '22px', padding: '25px',
//             borderLeft: '6px solid #4158D0', boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
//             position: 'relative', transition: '0.3s'
//         },
//         avatar: {
//             width: '45px', height: '45px', borderRadius: '14px',
//             background: 'linear-gradient(45deg, #e0e6ff, #f5f7ff)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontWeight: 'bold', color: '#4158D0', fontSize: '20px', marginRight: '15px'
//         }
//     };

//     return (
//         <div style={s.wrapper}>
//             <div style={s.container}>
//                 <h1 style={s.header}>Espace Clients</h1>

//                 {/* FORMULAIRE MIS À JOUR AVEC CHAMP ADRESSE */}
//                 <form onSubmit={validerFormulaire} style={s.quickAdd}>
//                     <input style={s.input} placeholder="Nom Complet" value={nom} onChange={(e) => setNom(e.target.value)} required />
//                     <input style={s.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                     <input style={s.input} placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
//                     <input style={s.input} placeholder="📍 Adresse (Ville, Rue...)" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
//                     <button type="submit" style={s.btnGradient}>AJOUTER</button>
//                 </form>

//                 <div style={s.grid}>
//                     {tousLesClients.map((c) => (
//                         <div key={c.id} style={s.card} className="hover-card">
//                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//                                 <div style={s.avatar}>{c.nom ? c.nom.charAt(0).toUpperCase() : '?'}</div>
//                                 <div>
//                                     <h3 style={{ margin: 0, fontSize: '17px', color: '#2d3436' }}>{c.nom}</h3>
//                                     <span style={{ fontSize: '11px', color: '#4158D0', fontWeight: 'bold' }}>ID: {c.id.substring(1, 6).toUpperCase()}</span>
//                                 </div>
//                             </div>

//                             <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
//                                 <span style={{ marginRight: '8px' }}>📧</span>{c.email || 'Email non renseigné'}
//                             </div>
//                             <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
//                                 <span style={{ marginRight: '8px' }}>📱</span>{c.tel || 'Contact non renseigné'}
//                             </div>
//                             {/* Affichage de l'adresse plus visible */}
//                             <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '20px' }}>
//                                 <span style={{ marginRight: '8px' }}>📍</span>{c.adresse || 'Adresse non renseignée'}
//                             </div>

//                             <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f1f1', paddingTop: '15px' }}>
//                                 <button
//                                     onClick={() => remove(ref(db, `clients/${c.id}`))}
//                                     style={{ background: '#fff0f0', border: 'none', color: '#ff7675', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}
//                                 >
//                                     Supprimer le client
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <style>{`
//                 .hover-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(65, 88, 208, 0.15) !important; }
//                 input:focus { background-color: #ffffff !important; border: 1px solid #4158D0 !important; }
//                 button:active { transform: scale(0.95); }
//             `}</style>
//         </div>
//     );
// }

// export default Client;
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, push, onValue, remove } from "firebase/database";

function Client() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [adresse, setAdresse] = useState("");
    const [tousLesClients, setTousLesClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [recherche, setRecherche] = useState("");

    // --- LOGIQUE DE VALIDATION ---
    // Format Maroc : 05/06/07 suivi de 8 chiffres
    const telRegex = /^(05|06|07)\d{8}$/;
    const isTelValid = tel === "" || telRegex.test(tel);
    const isAdresseValid = adresse === "" || adresse.length >= 5;
    const isEmailValid = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    // Formulaire complet valide ?
    const isFormValid = nom.length >= 2 && telRegex.test(tel) && adresse.length >= 5 && isEmailValid;

    useEffect(() => {
        const maBase = ref(db, 'clients');
        const unsubscribe = onValue(maBase, (snapshot) => {
            const donnees = snapshot.val();
            if (donnees) {
                const listeTemp = Object.entries(donnees).map(([id, valeur]) => ({ id, ...valeur }));
                setTousLesClients(listeTemp.reverse());
            } else { setTousLesClients([]); }
        });
        return () => unsubscribe();
    }, []);

    const validerFormulaire = (e) => {
        e.preventDefault();
        if (!isFormValid) return; // Sécurité supplémentaire

        push(ref(db, 'clients'), {
            nom, email, tel, adresse,
            dateAjout: new Date().toLocaleDateString('fr-FR')
        });

        // Reset
        setNom(""); setEmail(""); setTel(""); setAdresse("");
        setShowModal(false);
    };

    const clientsFiltres = tousLesClients.filter(c =>
        c.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
        c.email?.toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {/* Header / Search */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 py-4 border-b border-slate-100/50">
                <div className="relative w-full max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                        className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="Rechercher un client..."
                        type="text"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto w-full flex-1">
                {/* Title & Add Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <nav className="flex items-center gap-2 text-xs font-label font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                            <span>Management</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-primary">Clients</span>
                        </nav>
                        <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Répertoire Clients</h2>
                        <p className="text-slate-500 mt-2 max-w-md">Gérez votre portefeuille client et la facturation centralisée.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg font-headline font-semibold text-sm shadow-lg hover:shadow-primary/20 transition-all active:scale-95 w-fit"
                    >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 700" }}>add</span>
                        Ajouter un Client
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50">
                        <p className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest mb-1">Total Clients</p>
                        <h3 className="text-3xl font-headline font-bold text-primary">{tousLesClients.length}</h3>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50">
                        <p className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest mb-1">Nouveaux (Mois)</p>
                        <h3 className="text-3xl font-headline font-bold text-secondary">3</h3>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50 bg-gradient-to-br from-primary to-primary-container text-white lg:col-span-1 sm:col-span-2">
                        <p className="text-xs font-label font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">Base de données</p>
                        <h3 className="text-3xl font-headline font-bold">Live</h3>
                        <p className="text-[10px] text-primary-fixed-dim/80 mt-4 italic">Synchronisé avec Firebase</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-slate-100/50">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low/50 text-[10px] font-label font-bold text-slate-400 uppercase tracking-[0.15em]">
                        <div className="col-span-4">Client / Organisation</div>
                        <div className="col-span-3">Contact</div>
                        <div className="col-span-3">Adresse</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-100/50">
                        {clientsFiltres.map((c) => (
                            <div key={c.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-surface-container-low/20 transition-all group">
                                <div className="sm:col-span-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary font-bold text-lg border border-primary-container/20">
                                        {c.nom?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-headline font-bold text-primary">{c.nom}</h4>
                                        <p className="text-[10px] text-slate-500 font-body uppercase">ID: {c.id.substring(1, 8)}</p>
                                    </div>
                                </div>
                                <div className="sm:col-span-3 text-xs">
                                    <p className="font-medium">{c.email || '—'}</p>
                                    <p className="text-slate-500 mt-1">{c.tel || '—'}</p>
                                </div>
                                <div className="sm:col-span-3 text-xs">
                                    <p className="line-clamp-1">{c.adresse || 'N/A'}</p>
                                    <p className="text-[11px] text-slate-500">Ajouté le {c.dateAjout}</p>
                                </div>
                                <div className="sm:col-span-2 flex justify-end">
                                    <button
                                        onClick={() => remove(ref(db, `clients/${c.id}`))}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal with Enhanced Validation */}
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 bg-surface-container-low flex items-center justify-between border-b border-slate-100/50">
                            <div>
                                <h3 className="text-xl font-headline font-bold text-primary">Nouveau Client</h3>
                                <p className="text-xs text-slate-500">Validation stricte des coordonnées.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-primary transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={validerFormulaire} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NOM */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest">Nom Complet</label>
                                        <input
                                            required
                                            className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                            type="text"
                                            placeholder="ex: Jean Dupont"
                                        />
                                    </div>
                                    {/* EMAIL */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest">Email</label>
                                        <input
                                            className={`w-full bg-surface-container-high border-2 rounded-lg px-4 py-3 text-sm outline-none transition-all ${!isEmailValid ? 'border-red-400' : 'border-transparent focus:border-primary/20'}`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="contact@client.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* TÉLÉPHONE */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest">Téléphone (Maroc)</label>
                                        <input
                                            required
                                            className={`w-full bg-surface-container-high border-2 rounded-lg px-4 py-3 text-sm outline-none transition-all ${!isTelValid ? 'border-red-400' : 'border-transparent focus:border-primary/20'}`}
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            type="tel"
                                            placeholder="0612345678"
                                        />
                                        {!isTelValid && <p className="text-[10px] text-red-500 font-bold uppercase">Format invalide (ex: 06...)</p>}
                                    </div>

                                    {/* ADRESSE */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-label font-bold text-slate-400 uppercase tracking-widest">Adresse Siège</label>
                                        <input
                                            required
                                            className={`w-full bg-surface-container-high border-2 rounded-lg px-4 py-3 text-sm outline-none transition-all ${!isAdresseValid ? 'border-red-400' : 'border-transparent focus:border-primary/20'}`}
                                            value={adresse}
                                            onChange={(e) => setAdresse(e.target.value)}
                                            type="text"
                                            placeholder="Rue, Ville, CP..."
                                        />
                                        {!isAdresseValid && <p className="text-[10px] text-red-500 font-bold uppercase">Adresse trop courte</p>}
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100/50">
                                    <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-500 font-headline font-semibold text-sm hover:bg-surface-container transition-colors rounded-lg" type="button">Annuler</button>
                                    <button
                                        disabled={!isFormValid}
                                        className={`px-8 py-2.5 font-headline font-semibold text-sm rounded-lg shadow-lg transition-all ${isFormValid ? 'bg-primary text-white hover:shadow-primary/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                        type="submit"
                                    >
                                        Créer le client
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Client;