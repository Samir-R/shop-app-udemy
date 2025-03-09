import {createContext, useEffect, useState} from 'react';
import services from "../services";

export const ShopShippingContext = createContext({
  shopsList: [],
  shop: null,
  setShop: () => {},
  deliveryMethod: null,
  setDeliveryMethod: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {},
  deliveryHour: null,
  setDeliveryHour: () => {},
});

export const ShopShippingProvider = ({ children }) => {
  const [shopsList, setShopsList] = useState([]);
  const [shop, setShop] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryHour, setDeliveryHour] = useState(null);

  useEffect(() => {
    const getShopsList = async () => {
      const list = await services.shopService.getShopsList();
      setShopsList(list);
    };

    getShopsList();
  }, []);

  const value = {
    shopsList,
    shop,
    setShop,
    deliveryMethod,
    setDeliveryMethod,
    deliveryDate,
    setDeliveryDate,
    deliveryHour,
    setDeliveryHour,
  };
  return (
    <ShopShippingContext.Provider value={value}>
      {children}
    </ShopShippingContext.Provider>
  );
};
