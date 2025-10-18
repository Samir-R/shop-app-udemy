// src/contexts/UserContext.jsx

import { createContext, useEffect, useReducer, useCallback } from 'react';
import services from "../services";

export const UserContext = createContext({
  currentUser: null,
  isLoading: true,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
  verifyEmail: () => {},
  resendVerificationEmail: () => {},
  changePassword: () => {},
  refreshUser: () => {},
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
};

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  error: null,
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
        isLoading: false,
        error: null,
      };

    case USER_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };

    case USER_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
        isLoading: false,
      };

    case USER_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case USER_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
        error: null,
      };

    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

export const UserProvider = ({ children }) => {
  const [{ currentUser, isLoading, error }, dispatch] = useReducer(
      userReducer,
      INITIAL_STATE
  );

  // Actions
  const setCurrentUser = useCallback((user) => {
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: USER_ACTION_TYPES.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTION_TYPES.CLEAR_ERROR });
  }, []);

  /**
   * Inscription
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      clearError();

      const result = await services.userService.register(userData);

      return {
        success: true,
        message: result.message,
        user: result.user,
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

  /**
   * Connexion
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      clearError();

      const result = await services.userService.login(email, password);
      setCurrentUser(result.user);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Identifiants invalides';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setCurrentUser, setError, setLoading]);

  /**
   * Déconnexion
   */
  const logout = useCallback(() => {
    services.userService.logout();
    dispatch({ type: USER_ACTION_TYPES.LOGOUT });
  }, []);

  /**
   * Mot de passe oublié
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      clearError();

      await services.userService.forgotPassword(email);

      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi de l\'email';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

  /**
   * Réinitialiser le mot de passe
   */
  const resetPassword = useCallback(async (token, password, passwordConfirm) => {
    try {
      setLoading(true);
      clearError();

      await services.userService.resetPassword(token, password, passwordConfirm);

      return {
        success: true,
        message: 'Votre mot de passe a été réinitialisé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la réinitialisation';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

  /**
   * Vérifier l'email
   */
  const verifyEmail = useCallback(async (token) => {
    try {
      setLoading(true);
      clearError();

      await services.userService.verifyEmail(token);

      return {
        success: true,
        message: 'Votre email a été vérifié avec succès.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Token invalide ou expiré';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

  /**
   * Renvoyer l'email de vérification
   */
  const resendVerificationEmail = useCallback(async (email) => {
    try {
      setLoading(true);
      clearError();

      await services.userService.resendVerificationEmail(email);

      return {
        success: true,
        message: 'Un nouvel email de vérification a été envoyé.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'envoi';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

  /**
   * Changer le mot de passe
   */
  const changePassword = useCallback(async (currentPassword, newPassword, newPasswordConfirm) => {
    try {
      setLoading(true);
      clearError();

      await services.userService.changePassword(currentPassword, newPassword, newPasswordConfirm);

      return {
        success: true,
        message: 'Votre mot de passe a été modifié.',
      };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du changement';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    } finally {
      setLoading(false);
    }
  }, [clearError, setError, setLoading]);

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
        logout();
      }
      return { success: false };
    }
  }, [logout, setCurrentUser]);

  /**
   * Vérifier l'authentification au chargement
   */
  useEffect(() => {
    const initializeAuth = async () => {
      if (services.userService.isAuthenticated()) {
        try {
          // Récupérer le profil depuis l'API
          const profile = await services.userService.getProfile();
          setCurrentUser(profile);
        } catch (err) {
          // Si erreur, déconnecter
          console.error('Erreur initialisation auth:', err);
          services.userService.logout();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setCurrentUser, setLoading]);

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    changePassword,
    refreshUser,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};