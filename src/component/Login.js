import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(email, password);
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    const s = {
        container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #4158D0, #C850C0)' },
        card: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '350px', textAlign: 'center' },
        input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
        button: { width: '100%', padding: '12px', backgroundColor: '#4158D0', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
    };

    return (
        <div style={s.container}>
            <div style={s.card}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Connexion</h2>
                {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" style={s.input} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Mot de passe" style={s.input} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" style={s.button}>Se connecter</button>
                </form>
            </div>
        </div>
    );
}

export default Login;