import { createContext, useState, useEffect, useContext } from 'react';
import services from '../services';
import { CategoriesContext } from './category.context';

export const ProductContext = createContext({
  products: [],
  // productsCurrentCategory: [],
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  // const [productsCurrentCategory, setProductsCurrentCategory] = useState([]);
  // const { currentCategory } = useContext(CategoriesContext);

  // setProductsCurrentCategory(products.filter(product => product.categories === currentCategory.id))

  useEffect(() => {
    const getAllProducts = async () => {
      const productsList = await services.productService.getAllProducts();
      setProducts(productsList);
    };

    getAllProducts();
  }, []);

  const value = { 
    products,
    // productsCurrentCategory,
  };
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
