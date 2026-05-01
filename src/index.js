import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';

import App from './App';
import { UserProvider } from './contexts/user.context';
import { AddressProvider } from './contexts/address.context';
import { CategoriesProvider } from './contexts/category.context';
import { ProductProvider } from './contexts/product.context';
import { CartProvider } from './contexts/cart.context';

import './index.scss';
import { ThemeCustomProvider } from './contexts/theme-custom.context';
import { CheckoutProvider } from "./contexts/checkout.context";
import {ShopShippingProvider} from "./contexts/shop-shipping.context";

const rootElement = document.getElementById('root');

/**
 * Wrapper pour accéder à useNavigate depuis UserProvider
 */
const AppWithProviders = () => {
  const navigate = useNavigate();

  const handleUnauthenticated = () => {
    navigate('/auth');
  };

  return (
    <UserProvider onUnauthenticated={handleUnauthenticated}>
      <AddressProvider>
        <ShopShippingProvider>
          <CheckoutProvider>
            <CategoriesProvider>
              <ProductProvider>
                <CartProvider>
                  <ThemeCustomProvider>
                    <App />
                  </ThemeCustomProvider>
                </CartProvider>
              </ProductProvider>
            </CategoriesProvider>
          </CheckoutProvider>
        </ShopShippingProvider>
      </AddressProvider>
    </UserProvider>
  );
};

render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWithProviders />
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
