// Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import LoggedOutView from './LoggedOutView';

const Logout = () => {
    const navigate = useNavigate();
    const clearUserData = useAuthStore((state) => state.logout);

    useEffect(() => {
        const handleLogout = async () => {
            await clearUserData(); // Appel de la fonction logout du store
            navigate('/login'); // Redirection après la déconnexion
        };
        handleLogout();
    }, [clearUserData, navigate]);

    return <LoggedOutView title="You have been logged out" />;
};

export default Logout;
