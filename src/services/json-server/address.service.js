// src/services/addressService.js

import CoreService from "../core/core.service";

/**
 * Service pour gérer les adresses des customers
 */
export default class AddressService extends CoreService {
  constructor(apiUrl) {
    if (!apiUrl) {
      throw new Error('Missing apiUrl argument for AddressService constructor');
    }
    super(apiUrl);
  }

  get endpointUrl() {
    return `${this.apiUrl}/v1/customer/addresses`;
  }

  /**
   * Récupérer les adresses du customer connecté avec pagination
   * @param {number} page - Numéro de page (commence à 1)
   * @param {number} itemsPerPage - Nombre d'éléments par page (défaut: 5)
   */
  async getAddresses(page = 1, itemsPerPage = 5) {
    try {
      const { data } = await this.httpGet(
        `${this.endpointUrl}?page=${page}&itemsPerPage=${itemsPerPage}&order[isFavorite]=desc&order[id]=desc`
      );
      console.log('getAddresses');
      console.log(data);
      return {
        items: data?.addresses || [],
        totalItems: data?.pagination?.total || 0,
        currentPage: data?.pagination?.page || 1,
        itemsPerPage: data?.pagination?.itemsPerPage || itemsPerPage,
      };
    } catch (error) {
      console.error('Erreur récupération adresses:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Récupérer une adresse spécifique par son ID
   */
  async getAddress(addressId) {
    try {
      const { data } = await this.httpGet(`${this.endpointUrl}/${addressId}`);
      return data;
    } catch (error) {
      console.error('Erreur récupération adresse:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Créer une nouvelle adresse
   */
  async createAddress(addressData) {
    try {
      const { data } = await this.httpPost(this.endpointUrl, {
        name: addressData.name,
        street1: addressData.street1,
        street2: addressData.street2 || null,
        city: addressData.city,
        zipcode: addressData.zipcode,
        country: addressData.country || 'France',
        isFavorite: addressData.isFavorite || false,
      });
      return data;
    } catch (error) {
      console.error('Erreur création adresse:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Mettre à jour une adresse existante
   */
  async updateAddress(addressId, addressData) {
    try {
      const { data } = await this.httpPatch(
        `${this.endpointUrl}/${addressId}`,
        {
          name: addressData.name,
          street1: addressData.street1,
          street2: addressData.street2 || null,
          city: addressData.city,
          zipcode: addressData.zipcode,
          country: addressData.country,
          isFavorite: addressData.isFavorite,
        }
      );
      return data;
    } catch (error) {
      console.error('Erreur mise à jour adresse:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Supprimer une adresse
   */
  async deleteAddress(addressId) {
    try {
      const { data } = await this.httpDelete(`${this.endpointUrl}/${addressId}`);
      return data;
    } catch (error) {
      console.error('Erreur suppression adresse:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }

  /**
   * Définir une adresse comme adresse par défaut
   */
  async setDefaultAddress(addressId) {
    try {
      const { data } = await this.httpPost(`${this.endpointUrl}/${addressId}/set-default`);
      return data;
    } catch (error) {
      console.error('Erreur définition adresse par défaut:', error);
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
        errors: error.response?.data?.errors || {},
      };
    }
  }
}
