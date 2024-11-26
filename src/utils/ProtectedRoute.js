import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuthStore(); // Accéder directement à l'utilisateur

  console.log('User:', user); // Vérifiez l'objet utilisateur

  if (!user) {
    // Rediriger l'utilisateur non connecté vers la page de connexion
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est admin et essaie d'accéder à une page réservée aux utilisateurs
  if (roleRequired === 'user' && user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Si l'utilisateur est non-admin et essaie d'accéder à une page réservée aux admins
  if (roleRequired === 'admin' && !user.isAdmin) {
    return <Navigate to="/user_dashboard" />;
  }

  // Si tout est correct, afficher le composant de la route
  return children;
};

export default ProtectedRoute;
