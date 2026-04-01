import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, role } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && role !== 'Admin') {
        return <Navigate to="/facturation" />; // Redirige si pas admin
    }

    return children;
};