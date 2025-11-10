// src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuth from '../../hooks/use-auth.hook';

/**
 * Composant pour protéger les routes nécessitant une authentification
 *
 * Note: isLoading a été supprimé du contexte pour éviter les re-renders inutiles.
 * L'authentification est maintenant vérifiée uniquement via currentUser.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Si pas connecté, rediriger vers login en conservant la page d'origine
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si connecté, afficher le contenu
  return children;
};

export default ProtectedRoute;
