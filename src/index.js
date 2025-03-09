import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { UserProvider } from './contexts/user.context';
import { CategoriesProvider } from './contexts/category.context';
import { ProductProvider } from './contexts/product.context';
import { CartProvider } from './contexts/cart.context';

import './index.scss';
import { ThemeCustomProvider } from './contexts/theme-custom.context';
import {ShopShippingProvider} from "./contexts/shop-shipping.context";

const rootElement = document.getElementById('root');

render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ShopShippingProvider>
          <CategoriesProvider>
            <ProductProvider>
              <CartProvider>
                <ThemeCustomProvider>
                  <App />
                </ThemeCustomProvider>
              </CartProvider>
            </ProductProvider>
          </CategoriesProvider>
        </ShopShippingProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
