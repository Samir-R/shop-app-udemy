// src/contexts/AddressContext.jsx

import { createContext, useEffect, useReducer, useCallback, useContext } from 'react';
import services from "../services";
import { UserContext } from './user.context';

export const AddressContext = createContext({
  addresses: [],
  currentAddress: null,
  isLoading: false,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 5,
  getAddresses: () => {},
  createAddress: () => {},
  updateAddress: () => {},
  deleteAddress: () => {},
  setDefaultAddress: () => {},
  setCurrentAddress: () => {},
});

export const ADDRESS_ACTION_TYPES = {
  SET_ADDRESSES: 'SET_ADDRESSES',
  SET_CURRENT_ADDRESS: 'SET_CURRENT_ADDRESS',
  SET_LOADING: 'SET_LOADING',
  ADD_ADDRESS: 'ADD_ADDRESS',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  CLEAR_ADDRESSES: 'CLEAR_ADDRESSES',
  SET_ADDRESSES_AFTER_CREATE: 'SET_ADDRESSES_AFTER_CREATE',
};

const INITIAL_STATE = {
  addresses: [],
  currentAddress: null,
  isLoading: false,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 5,
};

const addressReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADDRESS_ACTION_TYPES.SET_ADDRESSES:
      // Rechargement normal des adresses avec pagination
      // - Si currentAddress existe, le garder (même s'il n'est pas dans la page actuelle)
      // - Sinon, sélectionner la favorite ou la première (première visite uniquement)
      let newCurrentAddress = state.currentAddress;

      if (!state.currentAddress && payload.items.length > 0) {
        // Première sélection uniquement : favorite ou première adresse
        newCurrentAddress = payload.items.find(addr => addr.isFavorite) || payload.items[0];
      }
      // Sinon, on garde currentAddress tel quel (même s'il n'est pas dans la page actuelle)

      return {
        ...state,
        addresses: payload.items,
        currentAddress: newCurrentAddress,
        totalItems: payload.totalItems,
        currentPage: payload.currentPage,
        itemsPerPage: payload.itemsPerPage,
        isLoading: false,
      };

    case ADDRESS_ACTION_TYPES.SET_ADDRESSES_AFTER_CREATE:
      // Après création d'une adresse avec pagination
      // 1. Si c'était la première adresse, la sélectionner
      // 2. Sinon, sélectionner l'adresse favorite (nouvelle ou existante)
      // 3. Sinon, garder currentAddress
      let newCurrentAfterCreate = state.currentAddress;

      const wasEmpty = state.addresses.length === 0;
      const favoriteAddr = payload.items.find(addr => addr.isFavorite);

      if (wasEmpty && payload.items.length > 0) {
        // C'était la première adresse créée, la sélectionner
        newCurrentAfterCreate = payload.items.find(addr => addr.isFavorite) || payload.items[0];
      } else if (favoriteAddr) {
        // Il y a une adresse favorite, la sélectionner
        newCurrentAfterCreate = favoriteAddr;
      } else if (state.currentAddress) {
        // Garder currentAddress mais avec les données à jour
        const updated = payload.items.find(addr => addr.id === state.currentAddress.id);
        newCurrentAfterCreate = updated || state.currentAddress;
      }

      return {
        ...state,
        addresses: payload.items,
        currentAddress: newCurrentAfterCreate,
        totalItems: payload.totalItems,
        currentPage: payload.currentPage,
        itemsPerPage: payload.itemsPerPage,
        isLoading: false,
      };

    case ADDRESS_ACTION_TYPES.SET_CURRENT_ADDRESS:
      return {
        ...state,
        currentAddress: payload,
      };

    case ADDRESS_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };

    case ADDRESS_ACTION_TYPES.ADD_ADDRESS:
      // Sélectionner la nouvelle adresse si c'est la première OU si isFavorite=true
      const shouldSelectNewAddress = state.addresses.length === 0 || payload.isFavorite;

      return {
        ...state,
        addresses: [...state.addresses, payload],
        currentAddress: shouldSelectNewAddress ? payload : state.currentAddress,
      };

    case ADDRESS_ACTION_TYPES.UPDATE_ADDRESS:
      // Si l'adresse modifiée est la currentAddress, la mettre à jour
      // Si l'adresse modifiée a isFavorite=true, elle devient la currentAddress
      const updatedCurrentAddress =
        payload.isFavorite ? payload :
        (state.currentAddress?.id === payload.id ? payload : state.currentAddress);

      return {
        ...state,
        addresses: state.addresses.map(addr =>
          addr.id === payload.id ? payload : addr
        ),
        currentAddress: updatedCurrentAddress,
      };

    case ADDRESS_ACTION_TYPES.DELETE_ADDRESS:
      // Si l'adresse supprimée était la currentAddress, sélectionner l'adresse favorite ou la première
      let newCurrentAfterDelete = state.currentAddress;
      if (state.currentAddress?.id === payload) {
        const remainingAddresses = state.addresses.filter(addr => addr.id !== payload);
        newCurrentAfterDelete = remainingAddresses.find(addr => addr.isFavorite) || remainingAddresses[0] || null;
      }

      return {
        ...state,
        addresses: state.addresses.filter(addr => addr.id !== payload),
        currentAddress: newCurrentAfterDelete,
      };

    case ADDRESS_ACTION_TYPES.CLEAR_ADDRESSES:
      return {
        ...state,
        addresses: [],
        currentAddress: null,
      };

    default:
      throw new Error(`Unhandled type ${type} in addressReducer`);
  }
};

export const AddressProvider = ({ children }) => {
  const [{ addresses, currentAddress, isLoading, totalItems, currentPage, itemsPerPage }, dispatch] = useReducer(
    addressReducer,
    INITIAL_STATE
  );

  const { currentUser, handleUnauthenticated } = useContext(UserContext);

  /**
   * Définir l'adresse courante pour la commande
   */
  const setCurrentAddress = useCallback((address) => {
    dispatch({ type: ADDRESS_ACTION_TYPES.SET_CURRENT_ADDRESS, payload: address });
  }, []);

  /**
   * Récupérer les adresses avec pagination
   */
  const getAddresses = useCallback(async (page = 1) => {
    if (!currentUser) {
      dispatch({ type: ADDRESS_ACTION_TYPES.CLEAR_ADDRESSES });
      return { success: false, message: 'Utilisateur non connecté' };
    }

    dispatch({ type: ADDRESS_ACTION_TYPES.SET_LOADING, payload: true });

    try {
      const result = await services.addressService.getAddresses(page, itemsPerPage);
      dispatch({ type: ADDRESS_ACTION_TYPES.SET_ADDRESSES, payload: result });
      return { success: true, ...result };
    } catch (err) {
      dispatch({ type: ADDRESS_ACTION_TYPES.SET_LOADING, payload: false });

      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
        };
      }

      const errorMessage = err.message || 'Erreur lors de la récupération des adresses';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, [currentUser, handleUnauthenticated, itemsPerPage]);

  /**
   * Créer une nouvelle adresse
   */
  const createAddress = useCallback(async (addressData) => {
    if (!currentUser) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    dispatch({ type: ADDRESS_ACTION_TYPES.SET_LOADING, payload: true });

    try {
      const result = await services.addressService.createAddress(addressData);

      // Recharger la première page après création avec l'action spécifique
      const paginatedResult = await services.addressService.getAddresses(1, itemsPerPage);
      dispatch({ type: ADDRESS_ACTION_TYPES.SET_ADDRESSES_AFTER_CREATE, payload: paginatedResult });

      return {
        success: true,
        message: result.message || 'Adresse ajoutée avec succès',
        address: result.address,
      };
    } catch (err) {
      dispatch({ type: ADDRESS_ACTION_TYPES.SET_LOADING, payload: false });

      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
          errors: {},
        };
      }

      const errorMessage = err.message || 'Erreur lors de la création de l\'adresse';
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, [currentUser, handleUnauthenticated, itemsPerPage]);

  /**
   * Mettre à jour une adresse
   */
  const updateAddress = useCallback(async (addressId, addressData) => {
    if (!currentUser) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    try {
      const result = await services.addressService.updateAddress(addressId, addressData);

      // Recharger toutes les adresses après modification
      await getAddresses();

      return {
        success: true,
        message: result.message || 'Adresse modifiée avec succès',
        address: result.address,
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

      const errorMessage = err.message || 'Erreur lors de la modification de l\'adresse';
      return {
        success: false,
        message: errorMessage,
        errors: err.errors || {},
      };
    }
  }, [currentUser, getAddresses, handleUnauthenticated]);

  /**
   * Supprimer une adresse
   */
  const deleteAddress = useCallback(async (addressId) => {
    if (!currentUser) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    try {
      const result = await services.addressService.deleteAddress(addressId);

      // Recharger toutes les adresses après suppression
      await getAddresses();

      return {
        success: true,
        message: result.message || 'Adresse supprimée avec succès',
      };
    } catch (err) {
      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
        };
      }

      const errorMessage = err.message || 'Erreur lors de la suppression de l\'adresse';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, [currentUser, getAddresses, handleUnauthenticated]);

  /**
   * Définir une adresse comme adresse par défaut
   */
  const setDefaultAddress = useCallback(async (addressId) => {
    if (!currentUser) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    try {
      const result = await services.addressService.setDefaultAddress(addressId);

      // Recharger toutes les adresses après modification
      await getAddresses();

      return {
        success: true,
        message: result.message || 'Adresse par défaut définie avec succès',
      };
    } catch (err) {
      // Gérer l'erreur 401 (non authentifié ou token expiré)
      if (err.status === 401) {
        handleUnauthenticated();
        return {
          success: false,
          message: 'Session expirée. Vous allez être redirigé vers la page de connexion.',
        };
      }

      const errorMessage = err.message || 'Erreur lors de la définition de l\'adresse par défaut';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, [currentUser, getAddresses, handleUnauthenticated]);

  /**
   * Vider les adresses quand l'utilisateur se déconnecte
   */
  useEffect(() => {
    if (!currentUser) {
      // Si pas d'utilisateur connecté, vider les adresses
      dispatch({ type: ADDRESS_ACTION_TYPES.CLEAR_ADDRESSES });
    }
  }, [currentUser]);

  const value = {
    addresses,
    currentAddress,
    isLoading,
    totalItems,
    currentPage,
    itemsPerPage,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setCurrentAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};
