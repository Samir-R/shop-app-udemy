// src/services/customerService.js

const API_BASE_URL = 'https://localhost:4435';
const RESELLER_ID = process.env.REACT_APP_RESELLER_ID || 10; // ID de la boutique

/**
 * Service pour gérer l'authentification des customers
 */
export default class UserService {
  constructor() {
    this.token = localStorage.getItem('customer_token');
    this.user = JSON.parse(localStorage.getItem('customer_user') || 'null');
  }

  /**
   * Configuration des headers pour les requêtes
   */
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Gestion des erreurs API
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || data.message || 'Une erreur est survenue',
        errors: data.errors || {},
      };
    }

    return data;
  }

  /**
   * Inscription d'un nouveau customer
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reseller_id: RESELLER_ID, // Important : ID de la boutique
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
        }),
      });

      const data = await this.handleResponse(response);

      // L'inscription réussie retourne les infos user mais pas de token
      // Le customer doit vérifier son email avant de pouvoir se connecter
      return {
        success: true,
        user: data.user,
        message: 'Inscription réussie. Veuillez vérifier votre email.',
      };
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion d'un customer
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reseller_id: RESELLER_ID, // Important : ID de la boutique
          email,
          password,
        }),
      });

      const data = await this.handleResponse(response);

      // Stocker le token et les infos user
      this.token = data.token;
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
      throw error;
    }
  }

  /**
   * Récupérer le profil du customer connecté
   */
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/me`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await this.handleResponse(response);

      // Mettre à jour les infos user en cache
      this.user = data;
      localStorage.setItem('customer_user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      
      // Si erreur 401, déconnecter l'utilisateur
      if (error.status === 401) {
        this.logout();
      }
      
      throw error;
    }
  }

  /**
   * Vérifier l'email avec le token reçu par email
   */
  async verifyEmail(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/verify-email`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ token }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur vérification email:', error);
      throw error;
    }
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/resend-verification`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur renvoi email:', error);
      throw error;
    }
  }

  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/forgot-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur mot de passe oublié:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe avec le token
   */
  async resetPassword(token, password, passwordConfirm) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/reset-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          token,
          password,
          passwordConfirm,
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(currentPassword, newPassword, newPasswordConfirm) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/change-password`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newPasswordConfirm,
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      throw error;
    }
  }

  /**
   * Déconnexion
   */
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Récupérer le token actuel
   */
  getToken() {
    return this.token;
  }

  /**
   * Récupérer l'utilisateur actuel (depuis le cache)
   */
  getCurrentUser() {
    return this.user;
  }
}

// Export d'une instance unique (singleton)
// export default new CustomerService();
