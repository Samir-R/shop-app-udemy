// src/services/customerService.js

import CoreService from "../core/core.service";

const RESELLER_ID = process.env.REACT_APP_RESELLER_ID || '019a8ed6-d371-78f7-8560-9c6508e30fa0'; // ID de la boutique

/**
 * Service pour gérer l'authentification des customers
 */
export default class UserService extends CoreService {
  constructor(apiUrl) {
    if (!apiUrl) {
      throw new Error('Missing apiUrl argument for UserService constructor');
    }
    super(apiUrl);
    this.user = JSON.parse(localStorage.getItem('customer_user') || 'null');
  }

  get endpointUrl() {
    return `${this.apiUrl}/v1/customer`;
  }

  /**
   * Inscription d'un nouveau customer
   */
  async register(userData) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/register`,
        {
          shopId: RESELLER_ID, // Important : ID de la boutique
          email: userData.email,
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || null,
          birthDate: userData.birthDate || null,
          gender: userData.gender || null,
          newsletterSubscribed: userData.newsletterSubscribed || false,
          acceptTerms: true,
        },
        {},
        false // Pas d'authentification pour l'inscription
      );

      // L'inscription réussie retourne les infos user mais pas de token
      // Le customer doit vérifier son email avant de pouvoir se connecter
      return {
        success: true,
        user: data.user,
        message: 'Inscription réussie. Veuillez vérifier votre email.',
      };
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Connexion d'un customer
   */
  async login(email, password) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/login`,
        {
          shopId: RESELLER_ID, // Important : ID de la boutique
          email,
          password,
        },
        {},
        false // Pas d'authentification pour le login
      );

      // Stocker le token et les infos user
      this.user = data.user;
      localStorage.setItem('customer_token', data.token);
      localStorage.setItem('customer_user', JSON.stringify(data.user));

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Récupérer le profil du customer connecté
   */
  async getProfile() {
    try {
      const { data } = await this.httpGet(`${this.endpointUrl}/me`);

      // Mettre à jour les infos user en cache
      this.user = data.customer;
      localStorage.setItem('customer_user', JSON.stringify(data.customer));

      return data.customer;
    } catch (error) {
      console.error('Erreur récupération profil:', error);

      // Si erreur 401, déconnecter l'utilisateur
      if (error.response?.status === 401) {
        this.logout();
      }

      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Vérifier l'email avec le token reçu par email
   */
  async verifyEmail(token) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/verify-email`,
        { token },
        {},
        false // Pas d'authentification
      );
      return data;
    } catch (error) {
      console.error('Erreur vérification email:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(email) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/resend-verification`,
        { email, shopId: RESELLER_ID },
        {},
        false // Pas d'authentification
      );
      return data;
    } catch (error) {
      console.error('Erreur renvoi email:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/forgot-password`,
        { email },
        {},
        false // Pas d'authentification
      );
      return data;
    } catch (error) {
      console.error('Erreur mot de passe oublié:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Réinitialiser le mot de passe avec le token
   */
  async resetPassword(token, password, passwordConfirm) {
    try {
      const { data } = await this.httpPost(
        `${this.endpointUrl}/reset-password`,
        {
          token,
          password,
          passwordConfirm,
        },
        {},
        false // Pas d'authentification
      );
      return data;
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(currentPassword, newPassword, newPasswordConfirm) {
    try {
      const { data } = await this.httpPost(`${this.endpointUrl}/change-password`, {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      return data;
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Mettre à jour les informations de l'utilisateur connecté
   */
  async updateUser(customerId, userData) {
    try {
      const { data } = await this.httpPatch(
        // `${this.apiUrl}/customers/${customerId}`,
        `${this.endpointUrl}/me`,
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || null,
          newsletterSubscribed: userData.newsletterSubscribed || false,
        }
      );

      // Mettre à jour les infos user en cache
      if (data.customer) {
        this.user = data.customer;
        localStorage.setItem('customer_user', JSON.stringify(data.customer));
      }

      return data.customer;
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Déconnexion
   */
  logout() {
    this.user = null;
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return !!localStorage.getItem('customer_token');
  }

  /**
   * Récupérer le token actuel
   */
  getToken() {
    return localStorage.getItem('customer_token');
  }

  /**
   * Récupérer l'utilisateur actuel (depuis le cache)
   */
  getCurrentUser() {
    return this.user;
  }
}
