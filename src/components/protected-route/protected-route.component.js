// src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuth from '../../hooks/use-auth.hook';

/**
 * Composant pour protéger les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Si pas connecté, rediriger vers login en conservant la page d'origine
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si connecté, afficher le contenu
  return children;
};

export default ProtectedRoute;
