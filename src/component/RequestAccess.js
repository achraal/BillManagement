import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseConfig'; // Import de ta config Firebase
import { ref, push, serverTimestamp } from "firebase/database"; // Outils Realtime Database

function RequestAccess() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); // État pour gérer l'attente
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: '',
        reason: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. On définit la référence dans la base de données
            const demandesRef = ref(db, 'demandes_acces');

            // 2. On envoie les données avec un timestamp (date d'envoi)
            await push(demandesRef, {
                ...formData,
                date: serverTimestamp(),
                statut: "en_attente"
            });

            console.log("Demande enregistrée dans Firebase !");
            setSubmitted(true);
        } catch (error) {
            console.error("Erreur Firebase:", error);
            alert("Une erreur est survenue lors de l'envoi.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,#e0e0ff_0%,#f8f9fa_40%,#edeeef_100%)]">
                <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl p-10 shadow-xl text-center border-t-4 border-primary animate-in fade-in zoom-in duration-300">
                    <span className="material-symbols-outlined text-green-500 text-6xl mb-4">check_circle</span>
                    <h2 className="font-headline text-2xl font-bold text-primary mb-2">Demande Envoyée</h2>
                    <p className="text-on-surface-variant mb-8 text-sm">Votre demande d'accès a été enregistrée dans notre système. Vous recevrez une réponse prochainement.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-all"
                    >
                        Retour au Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0e0ff_0%,#f8f9fa_40%,#edeeef_100%)]">

            <div className="fixed top-0 right-0 p-12 opacity-5 lg:opacity-10 pointer-events-none select-none">
                <span className="material-symbols-outlined text-[300px] text-primary">person_add</span>
            </div>

            <main className="w-full max-w-[480px] flex flex-col gap-8 z-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-xl shadow-lg mb-4 cursor-pointer" onClick={() => navigate('/login')}>
                        <span className="material-symbols-outlined text-white text-4xl">receipt_long</span>
                    </div>
                    <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">Request Access</h1>
                    <p className="text-on-surface-variant font-medium">Rejoignez l'écosystème The Ledger</p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_20px_40px_rgba(0,6,102,0.06)] relative overflow-hidden border border-white/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-headline text-xl font-semibold text-primary">Formulaire de demande</h2>
                            <p className="text-xs text-on-surface-variant">Remplissez les informations pour obtenir vos identifiants.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nom Complet</label>
                            <input
                                required
                                className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-2 border-transparent focus:border-primary/40 outline-none transition-all"
                                type="text"
                                placeholder="Jean Dupont"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Email Professionnel</label>
                            <input
                                required
                                className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-2 border-transparent focus:border-primary/40 outline-none transition-all"
                                type="email"
                                placeholder="jean.dupont@entreprise.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Département</label>
                            <select
                                required
                                className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-2 border-transparent focus:border-primary/40 outline-none transition-all"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Sélectionner un service</option>
                                <option value="sales">Ventes / Commercial</option>
                                <option value="inventory">Gestion des Stocks</option>
                                <option value="admin">Administration</option>
                                <option value="it">Support Technique</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Motif de la demande</label>
                            <textarea
                                required
                                className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-2 border-transparent focus:border-primary/40 outline-none transition-all min-h-[100px] resize-none"
                                placeholder="Pourquoi avez-vous besoin d'accéder au catalogue ?"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all mt-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? "Envoi en cours..." : "Envoyer la demande"}
                        </button>
                    </form>
                </div>

                <footer className="flex justify-center items-center gap-2">
                    <p className="text-sm text-on-surface-variant">Déjà un compte ?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold text-primary hover:underline underline-offset-4"
                    >
                        Se connecter
                    </button>
                </footer>
            </main>
        </div>
    );
}

export default RequestAccess;