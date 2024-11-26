// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from "./compenents/Dashbord"; // Assurez-vous que le chemin est correct
import Login from './views/login'; // Assurez-vous que le chemin est correct
import Logout from './views/logout'; // Importez le composant Logout
import RapportTable from './compenents/Pages/Rapports/RapportTable'; // Importez le composant RapportTable
import TablesProjet from './compenents/Pages/Rapports/Projets/TablesProjet'; // Importez le composant TablesProjet
import { useAuthStore } from './store/auth'; // Import your authentication store
import UserTables from "./compenents/composant/Admin/userTables";
import Profile from "./compenents/Pages/Rapports/usersProfile/Profile";
import DashboardUser from './compenents/DashboardUser';
import NavBarUser from './compenents/NavBarUser';
import RapportUser from './compenents/Pages/Rapports/RapportUser';
import EmployerProile from './compenents/Pages/Rapports/usersProfile/EmployerProile';
import AjoutRapport from './compenents/Pages/Rapports/AjoutRapport';

// Protected Route Component
// const ProtectedRoute = ({ children, roleRequired }) => {
//     const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
//     const userRole = useAuthStore((state) => state.role); // Récupération du rôle de l'utilisateur
//     console.log(isLoggedIn);
    
//     if (!isLoggedIn) {
//         return <Navigate to="/login" replace />;
//     }

//     // Redirection vers le tableau de bord de l'utilisateur si le rôle ne correspond pas
//     if (roleRequired && userRole !== roleRequired) {
//         return <Navigate to={userRole === 'admin' ? '/dashboard' : '/dashboard_user'} replace />;
//     }

//     return children;
// };

const ProtectedRoute = ({ children, roleRequired }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
    const userRole = useAuthStore((state) => state.role);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Redirection vers le tableau de bord de l'utilisateur si le rôle ne correspond pas
    if (roleRequired && userRole !== roleRequired) {
        return <Navigate to={userRole === 'admin' ? '/dashboard' : '/dashboard_user'} replace />;
    }

    return children;
};

export default function App() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
    const userRole = useAuthStore((state) => state.role);

    return (
        <Router>
            <Routes>
                {/* Route principale conditionnelle en fonction du rôle */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            userRole === 'admin' ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Navigate to="/dashboard_user" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Routes de connexion et déconnexion */}
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

                {/* Routes pour l'administrateur */}
                <Route path="/dashboard" element={<ProtectedRoute roleRequired="admin"><Dashboard /></ProtectedRoute>} />
                <Route path="/rapport" element={<ProtectedRoute roleRequired="admin"><RapportTable /></ProtectedRoute>} />
                <Route path="/tables-projet" element={<ProtectedRoute roleRequired="admin"><TablesProjet /></ProtectedRoute>} />
                <Route path="/employer" element={<ProtectedRoute roleRequired="admin"><UserTables /></ProtectedRoute>} />
                <Route path="/profil" element={<ProtectedRoute roleRequired="admin"><Profile /></ProtectedRoute>} />

                {/* Routes pour les employeurs */}
                <Route path="/dashboard_user" element={<ProtectedRoute roleRequired="employer"><DashboardUser /></ProtectedRoute>} />
                <Route path="/navbar_user" element={<ProtectedRoute roleRequired="employer"><NavBarUser /></ProtectedRoute>} />
                <Route path="/rapport_user" element={<ProtectedRoute roleRequired="employer"><RapportUser /></ProtectedRoute>} />
                <Route path="/employer_profile" element={<ProtectedRoute roleRequired="employer"><EmployerProile /></ProtectedRoute>} />
                <Route path="/ajout_rapport" element={<ProtectedRoute roleRequired="employer"><AjoutRapport /></ProtectedRoute>} />

                {/* Redirection pour toute route inconnue */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}
