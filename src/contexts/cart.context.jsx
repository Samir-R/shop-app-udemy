import { createContext, useEffect, useState } from 'react';


const addCartItem = (cartItems, productToAdd) => {
    // find if cartItems contains
    const existingCartItem = cartItems.find(cartItem => cartItem.id === productToAdd.id);
    
    // If found, increment qty
    if(existingCartItem) {
        return cartItems.map((cartItem) => cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
        );
    }

    // return new array with modified cartItems/ new cart item
    return [ ...cartItems, { ...productToAdd, quantity: 1} ];
}

const subCartItem = (cartItems, productToSub) => {
    // find if cartItems contains
    const existingCartItem = cartItems.find(cartItem => cartItem.id === productToSub.id);
    
    // If found, decrement qty
    if(existingCartItem) {
      if(existingCartItem.quantity === 1) {
        return removeCartItem(cartItems, productToSub)
      }

      return cartItems.map((cartItem) => cartItem.id === productToSub.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
      );
    }

    // return new array with modified cartItems/ new cart item
    return [ ...cartItems ];
}

const removeCartItem = (cartItems, productToRemove) => {
  console.log('on remove');
    // find if cartItems contains
    const existingCartItem = cartItems.find(cartItem => cartItem.id === productToRemove.id);
    
    // If found, remove product
    if(existingCartItem) {
        return cartItems.filter((cartItem) => cartItem.id !== productToRemove.id);
    }

    // return new array with modified cartItems/ new cart item
    return [ ...cartItems ];
}

export const CartContext = createContext({
  isCartOpen: false,
  setIsOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  subItemToCart: () => {},
  removeItemToCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  }

  const subItemToCart = (productToSub) => {
    setCartItems(subCartItem(cartItems, productToSub));
  }

  const removeItemToCart = (productToRemove) => {
    setCartItems(removeCartItem(cartItems, productToRemove));
  }

  useEffect(() => {
    const newCartCount = cartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
    );
    setCartCount(newCartCount);
  }, [cartItems])

  useEffect(() => {
    const cartTotal = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    setCartTotal(cartTotal);
  }, [cartItems])
  
  
  const value = { isCartOpen, setIsCartOpen, addItemToCart, subItemToCart, removeItemToCart, cartItems, cartCount, cartTotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
