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

const rootElement = document.getElementById('root');

render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CategoriesProvider>
          <ProductProvider>
            <CartProvider>
              <ThemeCustomProvider>
                <App />
              </ThemeCustomProvider>
            </CartProvider>
          </ProductProvider>
        </CategoriesProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
