import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { ref, push, onValue, remove } from "firebase/database";

function Client() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [adresse, setAdresse] = useState(""); // État déjà présent, on va l'utiliser
    const [tousLesClients, setTousLesClients] = useState([]);

    useEffect(() => {
        const maBase = ref(db, 'clients');
        onValue(maBase, (snapshot) => {
            const donnees = snapshot.val();
            if (donnees) {
                const listeTemp = Object.entries(donnees).map(([id, valeur]) => ({ id, ...valeur }));
                setTousLesClients(listeTemp);
            } else { setTousLesClients([]); }
        });
    }, []);

    const validerFormulaire = (e) => {
        e.preventDefault();
        // Ajout de l'adresse dans l'objet envoyé à Firebase
        push(ref(db, 'clients'), { 
            nom, 
            email, 
            tel, 
            adresse,
            dateAjout: new Date().toLocaleDateString('fr-FR') 
        });
        setNom(""); setEmail(""); setTel(""); setAdresse("");
    };

    const s = {
        wrapper: { minHeight: '100vh', backgroundColor: '#f8f9ff', padding: '40px', fontFamily: "'Poppins', sans-serif" },
        container: { maxWidth: '1100px', margin: '0 auto' },
        header: {
            fontSize: '32px', fontWeight: '800',
            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '30px'
        },
        quickAdd: {
            display: 'flex', gap: '15px', backgroundColor: '#ffffff', padding: '20px',
            borderRadius: '20px', boxShadow: '0 10px 25px rgba(65, 88, 208, 0.1)',
            border: '1px solid #e0e6ff', marginBottom: '40px', flexWrap: 'wrap' // wrap pour mobile
        },
        input: {
            flex: 1, minWidth: '150px', padding: '12px 18px', backgroundColor: '#f0f2f9',
            border: 'none', borderRadius: '12px', color: '#333',
            outline: 'none', fontSize: '14px'
        },
        btnGradient: {
            padding: '0 30px', background: 'linear-gradient(45deg, #4158D0, #507ac8ff)',
            color: '#ffffff', border: 'none', borderRadius: '12px',
            fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(80, 156, 200, 0.4)',
            minHeight: '45px'
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
        card: {
            backgroundColor: '#ffffff', borderRadius: '22px', padding: '25px',
            borderLeft: '6px solid #4158D0', boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
            position: 'relative', transition: '0.3s'
        },
        avatar: {
            width: '45px', height: '45px', borderRadius: '14px',
            background: 'linear-gradient(45deg, #e0e6ff, #f5f7ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: '#4158D0', fontSize: '20px', marginRight: '15px'
        }
    };

    return (
        <div style={s.wrapper}>
            <div style={s.container}>
                <h1 style={s.header}>Espace Clients</h1>

                {/* FORMULAIRE MIS À JOUR AVEC CHAMP ADRESSE */}
                <form onSubmit={validerFormulaire} style={s.quickAdd}>
                    <input style={s.input} placeholder="Nom Complet" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    <input style={s.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input style={s.input} placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
                    <input style={s.input} placeholder="📍 Adresse (Ville, Rue...)" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                    <button type="submit" style={s.btnGradient}>AJOUTER</button>
                </form>

                <div style={s.grid}>
                    {tousLesClients.map((c) => (
                        <div key={c.id} style={s.card} className="hover-card">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={s.avatar}>{c.nom ? c.nom.charAt(0).toUpperCase() : '?'}</div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '17px', color: '#2d3436' }}>{c.nom}</h3>
                                    <span style={{ fontSize: '11px', color: '#4158D0', fontWeight: 'bold' }}>ID: {c.id.substring(1, 6).toUpperCase()}</span>
                                </div>
                            </div>

                            <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
                                <span style={{ marginRight: '8px' }}>📧</span>{c.email || 'Email non renseigné'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
                                <span style={{ marginRight: '8px' }}>📱</span>{c.tel || 'Contact non renseigné'}
                            </div>
                            {/* Affichage de l'adresse plus visible */}
                            <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '20px' }}>
                                <span style={{ marginRight: '8px' }}>📍</span>{c.adresse || 'Adresse non renseignée'}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f1f1', paddingTop: '15px' }}>
                                <button
                                    onClick={() => remove(ref(db, `clients/${c.id}`))}
                                    style={{ background: '#fff0f0', border: 'none', color: '#ff7675', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}
                                >
                                    Supprimer le client
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .hover-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(65, 88, 208, 0.15) !important; }
                input:focus { background-color: #ffffff !important; border: 1px solid #4158D0 !important; }
                button:active { transform: scale(0.95); }
            `}</style>
        </div>
    );
}

export default Client;