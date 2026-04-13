// src/contexts/checkout.context.jsx

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import services from "../services";

const CHECKOUT_STORAGE_KEY = 'checkout_data';
const CHECKOUT_TIMESTAMP_KEY = 'checkout_timestamp';
const CHECKOUT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export const CheckoutContext = createContext({
  // Shop & Shipping (ancien ShopShippingContext)
  shopsList: [],
  shop: null,
  setShop: () => {},
  deliveryMethod: null,
  setDeliveryMethod: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {},
  deliveryHour: null,
  setDeliveryHour: () => {},

  // Form data
  formData: {},
  updateFormData: () => {},
  clearFormData: () => {},
});

export const CheckoutProvider = ({ children }) => {
  const [shopsList, setShopsList] = useState([]);
  const [shop, setShop] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryHour, setDeliveryHour] = useState(null);
  const [formData, setFormData] = useState({});

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        const timestamp = localStorage.getItem(CHECKOUT_TIMESTAMP_KEY);

        if (savedData && timestamp) {
          const elapsed = Date.now() - parseInt(timestamp, 10);

          if (elapsed < CHECKOUT_EXPIRY_MS) {
            const parsed = JSON.parse(savedData);
            setFormData(parsed.formData || {});
            setShop(parsed.shop || null);
            setDeliveryMethod(parsed.deliveryMethod || null);
            setDeliveryDate(parsed.deliveryDate || null);
            setDeliveryHour(parsed.deliveryHour || null);
          } else {
            // Données expirées, les supprimer
            clearStorage();
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du checkout:', error);
        clearStorage();
      }
    };

    loadFromStorage();
  }, []);

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    const saveToStorage = () => {
      try {
        const dataToSave = {
          formData,
          shop,
          deliveryMethod,
          deliveryDate,
          deliveryHour,
        };

        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(dataToSave));
        localStorage.setItem(CHECKOUT_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données du checkout:', error);
      }
    };

    // Ne sauvegarder que si on a des données
    if (Object.keys(formData).length > 0 || shop || deliveryMethod) {
      saveToStorage();
    }
  }, [formData, shop, deliveryMethod, deliveryDate, deliveryHour]);

  // Charger la liste des shops
  useEffect(() => {
    const getShopsList = async () => {
      const list = await services.shopService.getShopsList();
      setShopsList(list);
    };

    getShopsList();
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    localStorage.removeItem(CHECKOUT_TIMESTAMP_KEY);
  }, []);

  const updateFormData = useCallback((newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  const clearFormData = useCallback(() => {
    setFormData({});
    setShop(null);
    setDeliveryMethod(null);
    setDeliveryDate(null);
    setDeliveryHour(null);
    clearStorage();
  }, [clearStorage]);

  const value = {
    // Shop & Shipping
    shopsList,
    shop,
    setShop,
    deliveryMethod,
    setDeliveryMethod,
    deliveryDate,
    setDeliveryDate,
    deliveryHour,
    setDeliveryHour,

    // Form data
    formData,
    updateFormData,
    clearFormData,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
