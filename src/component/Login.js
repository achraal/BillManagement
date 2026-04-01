// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const { login } = useAuth();
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setError('');
//             await login(email, password);
//         } catch (err) {
//             setError("Email ou mot de passe incorrect.");
//         }
//     };

//     const s = {
//         container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #4158D0, #C850C0)' },
//         card: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '350px', textAlign: 'center' },
//         input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
//         button: { width: '100%', padding: '12px', backgroundColor: '#4158D0', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
//     };

//     return (
//         <div style={s.container}>
//             <div style={s.card}>
//                 <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Connexion</h2>
//                 {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <input type="email" placeholder="Email" style={s.input} onChange={(e) => setEmail(e.target.value)} required />
//                     <input type="password" placeholder="Mot de passe" style={s.input} onChange={(e) => setPassword(e.target.value)} required />
//                     <button type="submit" style={s.button}>Se connecter</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0e0ff_0%,#f8f9fa_40%,#edeeef_100%)]">
            
            {/* Background Decoration */}
            <div className="fixed top-0 right-0 p-12 opacity-5 lg:opacity-10 pointer-events-none select-none">
                <span className="material-symbols-outlined text-[300px] text-primary">account_balance_wallet</span>
            </div>

            <main className="w-full max-w-[440px] flex flex-col gap-8 z-10">
                
                {/* Brand Identity */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-xl shadow-lg mb-4">
                        <span className="material-symbols-outlined text-white text-4xl">receipt_long</span>
                    </div>
                    <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">The Ledger</h1>
                    <p className="text-on-surface-variant font-medium">Digital Curator for Modern Enterprise</p>
                </div>

                {/* Login Card */}
                <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_20px_40px_rgba(0,6,102,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1 mb-2">
                            <h2 className="font-headline text-xl font-semibold text-primary">Welcome Back</h2>
                            <p className="text-xs text-on-surface-variant">Please enter your credentials to access your account</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-error-container text-on-error-container text-xs rounded-lg border border-error/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-primary">
                                    mail
                                </span>
                                <input 
                                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                                    id="email"
                                    type="email"
                                    placeholder="name@organization.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                                    Password
                                </label>
                                <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-primary">
                                    lock
                                </span>
                                <input 
                                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button 
                            type="submit"
                            className="w-full py-4 px-6 mt-2 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                        >
                            Log In
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="flex flex-col items-center gap-6">
                    <p className="text-sm text-on-surface-variant">
                        Don't have an account? 
                        <a className="font-bold text-primary hover:underline underline-offset-4 ml-1" href="#">Request Access</a>
                    </p>
                    <div className="flex gap-8">
                        <a className="text-xs font-medium text-outline hover:text-on-surface-variant transition-colors" href="#">Privacy Policy</a>
                        <a className="text-xs font-medium text-outline hover:text-on-surface-variant transition-colors" href="#">Terms of Service</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default Login;