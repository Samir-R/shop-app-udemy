import { createContext, useState, useEffect, useContext } from 'react';
import services from '../services';
import { CategoriesContext } from './category.context';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const ProductContext = createContext({
  products: [],
  productWithAttributesToDisplay: null,
  setProductWithAttributesToDisplay: () => {},
  refreshProducts: () => {},
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productWithAttributesToDisplay, setProductWithAttributesToDisplay] = useState(null);
  const [displayErrorNoProductMenu, setDisplayErrorNoProductMenu] = useState(false);
  // const [productsCurrentCategory, setProductsCurrentCategory] = useState([]);
  // const { currentCategory } = useContext(CategoriesContext);

  // setProductsCurrentCategory(products.filter(product => product.categories === currentCategory.id))

  const refreshProducts = async () => {
    const productsList = await services.productService.getAllProducts();
    setProducts(productsList);
  };

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseErrorNoProductMenu = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDisplayErrorNoProductMenu(false);
  };

  const value = {
    products,
    productWithAttributesToDisplay,
    setProductWithAttributesToDisplay,
    setDisplayErrorNoProductMenu,
    refreshProducts,
  };
  return (
    <ProductContext.Provider value={value}>
      {children}
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={displayErrorNoProductMenu} autoHideDuration={6000} onClose={handleCloseErrorNoProductMenu}>
        <Alert
            onClose={handleCloseErrorNoProductMenu}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
        >
          Une erreur s'est produite, aucun menu trouvé pour ce produit
        </Alert>
      </Snackbar>
    </ProductContext.Provider>
  );
};
