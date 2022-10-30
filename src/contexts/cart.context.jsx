import { createContext, useState, useEffect, useReducer } from 'react';

const CART_REDUCER_TYPE = {
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  CLEAR_CART_ITEM: 'CLEAR_CART_ITEM',
  TOGGLE_CART_VISIBILITY: 'TOGGLE_CART_VISIBILITY',
}
const cartReducer = (state, action) => {
console.log('cartReducer');
console.log(state);
console.log(action);
  switch (action.type) {
    case CART_REDUCER_TYPE.ADD_CART_ITEM:
      const itemExisting = state.cartItems.find((cartItem) => cartItem.id === action.payload.id)     
      let newCartItems;
      if(itemExisting) {
        newCartItems = state.cartItems.map((cartItem) => {
          return cartItem.id === itemExisting.id
          ? { ...cartItem, quantity: itemExisting.quantity + 1 }
          : { ...cartItem }
        })
      } else {
        newCartItems = [
          ...state.cartItems,
          { ...action.payload, quantity: 1 }
        ]
      }
      return {
        ...state,
        cartCount: state.cartCount + 1,
        cartTotal: state.cartTotal + action.payload.price,
        cartItems: newCartItems
      };
    case CART_REDUCER_TYPE.REMOVE_CART_ITEM:
      const itemToRemoveExisting = state.cartItems.find((cartItem) => cartItem.id === action.payload.id)     
      if(itemToRemoveExisting) {
        let newCartItemsAfterRemove;
        if(itemToRemoveExisting.quantity === 1) {
          newCartItemsAfterRemove = state.cartItems.filter((cartItem) => cartItem.id !== itemToRemoveExisting.id)
        } else {
          newCartItemsAfterRemove = state.cartItems.map((cartItem) => {
            return cartItem.id === itemToRemoveExisting.id
            ? { ...cartItem, quantity: itemToRemoveExisting.quantity - 1 }
            : { ...cartItem }
          })
        }

        return {
          ...state,
          cartCount: state.cartCount - 1,
          cartTotal: state.cartTotal - action.payload.price,
          cartItems: newCartItemsAfterRemove
        };
      } 
      return { ...state };
    case CART_REDUCER_TYPE.CLEAR_CART_ITEM:
      const itemToClearExisting = state.cartItems.find((cartItem) => cartItem.id === action.payload.id)     
      if(itemToClearExisting) {
        const newCartItemsAfterClear = state.cartItems.filter((cartItem) => cartItem.id !== itemToClearExisting.id)

        return {
          ...state,
          cartCount: state.cartCount - itemToClearExisting.quantity,
          cartTotal: state.cartTotal - (itemToClearExisting.price * itemToClearExisting.quantity),
          cartItems: newCartItemsAfterClear
        };
      } 
      return { ...state };
    case CART_REDUCER_TYPE.TOGGLE_CART_VISIBILITY:
      return { 
        ...state,
        isCartOpen: !state.isCartOpen
      };
    default:
      break;
  }
}

// const addCartItem = (cartItems, productToAdd) => {
//   const existingCartItem = cartItems.find(
//     (cartItem) => cartItem.id === productToAdd.id
//   );

//   if (existingCartItem) {
//     return cartItems.map((cartItem) =>
//       cartItem.id === productToAdd.id
//         ? { ...cartItem, quantity: cartItem.quantity + 1 }
//         : cartItem
//     );
//   }

//   return [...cartItems, { ...productToAdd, quantity: 1 }];
// };

// const removeCartItem = (cartItems, cartItemToRemove) => {
//   // find the cart item to remove
//   const existingCartItem = cartItems.find(
//     (cartItem) => cartItem.id === cartItemToRemove.id
//   );

//   // check if quantity is equal to 1, if it is remove that item from the cart
//   if (existingCartItem.quantity === 1) {
//     return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
//   }

//   // return back cartitems with matching cart item with reduced quantity
//   return cartItems.map((cartItem) =>
//     cartItem.id === cartItemToRemove.id
//       ? { ...cartItem, quantity: cartItem.quantity - 1 }
//       : cartItem
//   );
// };

// const clearCartItem = (cartItems, cartItemToClear) =>
//   cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

export const CartProvider = ({ children }) => {
  // const [isCartOpen, setIsCartOpen] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  // const [cartCount, setCartCount] = useState(0);
  // const [cartTotal, setCartTotal] = useState(0);

  // useEffect(() => {
  //   const newCartCount = cartItems.reduce(
  //     (total, cartItem) => total + cartItem.quantity,
  //     0
  //   );
  //   setCartCount(newCartCount);
  // }, [cartItems]);

  // useEffect(() => {
  //   const newCartTotal = cartItems.reduce(
  //     (total, cartItem) => total + cartItem.quantity * cartItem.price,
  //     0
  //   );
  //   setCartTotal(newCartTotal);
  // }, [cartItems]);
  const [{ isCartOpen, cartItems, cartCount, cartTotal }, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  const addItemToCart = (productToAdd) => {
    // setCartItems(addCartItem(cartItems, productToAdd));
    dispatch({ type: CART_REDUCER_TYPE.ADD_CART_ITEM, payload: productToAdd});
  };

  const removeItemToCart = (cartItemToRemove) => {
    // setCartItems(removeCartItem(cartItems, cartItemToRemove));
    dispatch({ type: CART_REDUCER_TYPE.REMOVE_CART_ITEM, payload: cartItemToRemove});
  };

  const clearItemFromCart = (cartItemToClear) => {
    // setCartItems(clearCartItem(cartItems, cartItemToClear));
    dispatch({ type: CART_REDUCER_TYPE.CLEAR_CART_ITEM, payload: cartItemToClear});
  };

  const setIsCartOpen = () => {
    // setCartItems(clearCartItem(cartItems, cartItemToClear));
    dispatch({ type: CART_REDUCER_TYPE.TOGGLE_CART_VISIBILITY });
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
