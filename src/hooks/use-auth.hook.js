// src/hooks/useAuth.js

import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';

/**
 * Hook personnalisé pour accéder au contexte utilisateur
 * @returns {Object} Contexte utilisateur avec toutes les méthodes d'authentification
 */
export const useAuth = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }

  return context;
};

export default useAuth;
