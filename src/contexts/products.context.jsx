import { createContext, useState, useEffect } from 'react';

import SHOP_DATA from '../shop-data.js';
import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils.js';

export const ProductsContext = createContext({
  products: {},
});

export const ProductsProvider = ({ children }) => {
  useEffect(() => {
    const getCollectionMap = async () => {
      const products = await getCategoriesAndDocuments('categories');
      console.log(products);
      setProducts(products);
    };
    getCollectionMap();
  }, [])
  
  const [products, setProducts] = useState({});
  const value = { products };
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
