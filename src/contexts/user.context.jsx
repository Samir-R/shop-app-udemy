// src/contexts/UserContext.jsx

import { createContext, useEffect, useReducer, useCallback } from 'react';
import services from "../services";

export const UserContext = createContext({
  currentUser: null,
  currentUserGuest: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
  verifyEmail: () => {},
  resendVerificationEmail: () => {},
  changePassword: () => {},
  updateUser: () => {},
  refreshUser: () => {},
  setGuestUser: () => {},
  resetGuestUser: () => {},
  handleUnauthenticated: () => {},
  onUnauthenticated: null,
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_GUEST_USER: 'SET_GUEST_USER',
  RESET_GUEST_USER: 'RESET_GUEST_USER',
  LOGOUT: 'LOGOUT',
};

const INITIAL_STATE = {
  currentUser: null,
  currentUserGuest: null,
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
        currentUserGuest: null, // Réinitialiser l'invité si un utilisateur se connecte
      };

    case USER_ACTION_TYPES.SET_GUEST_USER:
      return {
        ...state,
        currentUserGuest: payload,
        currentUser: null, // Assurer que currentUser et currentUserGuest ne coexistent pas
      };

    case USER_ACTION_TYPES.RESET_GUEST_USER:
      return {
        ...state,
        currentUserGuest: null,
      };

    case USER_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        currentUser: null,
        currentUserGuest: null,
      };

    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

export const UserProvider = ({ children, onUnauthenticated }) => {
  const [{ currentUser, currentUserGuest }, dispatch] = useReducer(
      userReducer,
      INITIAL_STATE
  );

  // Actions - Pas besoin de useCallback pour ces fonctions simples
  // car elles utilisent dispatch qui a une référence stable
  const setCurrentUser = (user) => {
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user });
  };

  /**
   * Déconnexion
   */
  const logout = useCallback(() => {
    services.userService.logout();
    dispatch({ type: USER_ACTION_TYPES.LOGOUT });
  }, []);

  /**
   * Gérer les erreurs 401 (non authentifié)
   */
  const handleUnauthenticated = useCallback(() => {
    logout();
    if (onUnauthenticated) {
      onUnauthenticated();
    }
  }, [logout, onUnauthenticated]);

  /**
   * Inscription
   */
  const register = useCallback(async (userData) => {
    try {
      const result = await services.userService.register(userData);

      return {
        success: true,
        message: result.message,
        user: result.user,
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(async (email, password) => {
    try {
      // Étape 1: Login pour obtenir le token
      const result = await services.userService.login(email, password);
      console.log('🔍 User après login:', result.user);

      // Étape 2: Récupérer le profil complet depuis l'API
      try {
        const profile = await services.userService.getProfile();
        console.log('🔍 Profile complet récupéré après login:', profile);
        setCurrentUser(profile);
      } catch (profileErr) {
        // Si getProfile échoue, utiliser les données du login
        console.warn('Impossible de récupérer le profil, utilisation des données du login');
        setCurrentUser(result.user);
      }

      return { success: true };
    } catch (err) {
      // Gérer l'erreur 401
      if (err.status === 401) {
        handleUnauthenticated();
      }

      const errorMessage = err.message || 'Identifiants invalides';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, [handleUnauthenticated]);

  /**
   * Mot de passe oublié
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      await services.userService.forgotPassword(email);

      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi de l\'email';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  /**
   * Réinitialiser le mot de passe
   */
  const resetPassword = useCallback(async (token, password, passwordConfirm) => {
    try {
      await services.userService.resetPassword(token, password, passwordConfirm);

      return {
        success: true,
        message: 'Votre mot de passe a été réinitialisé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la réinitialisation';
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, []);

  /**
   * Vérifier l'email
   */
  const verifyEmail = useCallback(async (token) => {
    try {
      await services.userService.verifyEmail(token);

      return {
        success: true,
        message: 'Votre email a été vérifié avec succès.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Token invalide ou expiré';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  /**
   * Renvoyer l'email de vérification
   */
  const resendVerificationEmail = useCallback(async (email) => {
    try {
      await services.userService.resendVerificationEmail(email);

      return {
        success: true,
        message: 'Un nouvel email de vérification a été envoyé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  /**
   * Changer le mot de passe
   */
  const changePassword = useCallback(async (currentPassword, newPassword, newPasswordConfirm) => {
    try {
      await services.userService.changePassword(currentPassword, newPassword, newPasswordConfirm);

      return {
        success: true,
        message: 'Votre mot de passe a été modifié.',
      };
    } catch (err) {
      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
          errors: {},
        };
      }

      const errorMessage = err.message || 'Erreur lors du changement';
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, [handleUnauthenticated]);

  /**
   * Mettre à jour les informations de l'utilisateur
   */
  const updateUser = useCallback(async (customerId, userData) => {
    try {
      const result = await services.userService.updateUser(customerId, userData);
      // Mettre à jour currentUser dans le contexte
      if (result) {
        setCurrentUser(result);
      }

      return {
        success: true,
        message: result.message || 'Vos informations ont été mises à jour.',
        user: result.user,
      };
    } catch (err) {
      console.error('❌ Erreur dans updateUser (contexte):', err);

      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
          errors: {},
        };
      }

      const errorMessage = err.message || 'Erreur lors de la mise à jour';
      console.log('📝 Message d\'erreur à retourner:', errorMessage);

      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, [handleUnauthenticated]);

  /**
   * Rafraîchir le profil utilisateur
   */
  const refreshUser = useCallback(async () => {
    try {
      const profile = await services.userService.getProfile();
      setCurrentUser(profile);
      return { success: true };
    } catch (err) {
      // Si erreur 401, l'utilisateur sera déconnecté automatiquement
      if (err.status === 401) {
        handleUnauthenticated();
      }
      return { success: false };
    }
  }, [handleUnauthenticated]); // handleUnauthenticated utilise dispatch qui est stable

  /**
   * Définir un utilisateur invité
   */
  const setGuestUser = (guestData) => {
    dispatch({ type: USER_ACTION_TYPES.SET_GUEST_USER, payload: guestData });
  };

  /**
   * Réinitialiser l'utilisateur invité
   */
  const resetGuestUser = () => {
    dispatch({ type: USER_ACTION_TYPES.RESET_GUEST_USER });
  };

  /**
   * Vérifier l'authentification au chargement
   */
  useEffect(() => {
    const initializeAuth = async () => {
      if (services.userService.isAuthenticated()) {
        try {
          // Récupérer le profil depuis l'API
          const profile = await services.userService.getProfile();
          console.log('🔍 Profile récupéré:', profile);
          setCurrentUser(profile);
        } catch (err) {
          // Si erreur, déconnecter
          console.error('Erreur initialisation auth:', err);
          services.userService.logout();
        }
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage

  const value = {
    currentUser,
    currentUserGuest,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    changePassword,
    updateUser,
    refreshUser,
    setGuestUser,
    resetGuestUser,
    handleUnauthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};