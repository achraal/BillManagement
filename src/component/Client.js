import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, push, onValue, remove } from "firebase/database";

function Client() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [adresse, setAdresse] = useState("");
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
        push(ref(db, 'clients'), { nom, email, tel, adresse });
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
        // Barre de saisie horizontale avec une bordure colorée discrète
        quickAdd: {
            display: 'flex', gap: '15px', backgroundColor: '#ffffff', padding: '20px',
            borderRadius: '20px', boxShadow: '0 10px 25px rgba(65, 88, 208, 0.1)',
            border: '1px solid #e0e6ff', marginBottom: '40px'
        },
        input: {
            flex: 1, padding: '12px 18px', backgroundColor: '#f0f2f9',
            border: 'none', borderRadius: '12px', color: '#333',
            outline: 'none', fontSize: '14px'
        },
        btnGradient: {
            padding: '0 30px', background: 'linear-gradient(45deg, #4158D0, #507ac8ff)',
            color: '#ffffff', border: 'none', borderRadius: '12px',
            fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(80, 156, 200, 0.4)'
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
        // Carte client avec un petit accent de couleur sur le côté
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

                {/* FORMULAIRE EN LIGNE */}
                <form onSubmit={validerFormulaire} style={s.quickAdd}>
                    <input style={s.input} placeholder="Nom Complet" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    <input style={s.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input style={s.input} placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
                    <button type="submit" style={s.btnGradient}>AJOUTER</button>
                </form>

                {/* GRILLE DE FICHES */}
                <div style={s.grid}>
                    {tousLesClients.map((c) => (
                        <div key={c.id} style={s.card} className="hover-card">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={s.avatar}>{c.nom.charAt(0).toUpperCase()}</div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '17px', color: '#2d3436' }}>{c.nom}</h3>
                                    <span style={{ fontSize: '11px', color: '#a0a0a0' }}>CLIENT ACTIF</span>
                                </div>
                            </div>

                            <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '8px' }}>
                                <span style={{ marginRight: '8px' }}>📧</span>{c.email || 'Non renseigné'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#636e72', marginBottom: '20px' }}>
                                <span style={{ marginRight: '8px' }}>📱</span>{c.tel || 'Non renseigné'}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f1f1', paddingTop: '15px' }}>
                                <span style={{ fontSize: '11px', color: '#b2bec3', fontStyle: 'italic' }}>
                                    {c.adresse || 'Sans adresse'}
                                </span>
                                <button
                                    onClick={() => remove(ref(db, `clients/${c.id}`))}
                                    style={{ background: '#fff0f0', border: 'none', color: '#ff7675', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .hover-card:hover { transform: translateY(-5px); boxShadow: 0 12px 30px rgba(65, 88, 208, 0.15) !important; }
        input:focus { background-color: #ffffff !important; border: 1px solid #4158D0 !important; }
      `}</style>
        </div>
    );
}

export default Client;