import {createContext, useContext, useState, useReducer, useEffect} from 'react';
import services from '../services';
import { createAction } from '../utils/reducer/reducer.utils';
import {ShopShippingContext} from './shop-shipping.context';

const DELIVERY_FEES = 500;

const addCartItem = (cartItems, productToAdd) => {
  // const existingCartItem = !productToAdd.attributesSelected && cartItems.find(
  //   (cartItem) => cartItem.id === productToAdd.id
  // );
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.reference === productToAdd.reference
  );
  const quantityToAdd = productToAdd.quantityToAdd || 1;

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      // cartItem.id === productToAdd.id
      cartItem.reference === productToAdd.reference
        ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: quantityToAdd }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    // (cartItem) => cartItem.id === cartItemToRemove.id
    (cartItem) => cartItem.reference === cartItemToRemove.reference
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.reference !== cartItemToRemove.reference);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    // cartItem.id === cartItemToRemove.id
    cartItem.reference === cartItemToRemove.reference
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const CART_ACTION_TYPES = {
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  SET_CART_COUNT: 'SET_CART_COUNT',
  SET_CART_TOTAL: 'SET_CART_TOTAL',
};

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotalWithoutPromotions: 0,
};

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        ...payload,
      };
    default:
      throw new Error(`Unhandled type ${type} in cartReducer`);
  }
};

const computeCartTotal = (cartTotalWithoutPromotions, promotionsApplied) => {
  const sorted = [...promotionsApplied].sort((a, b) => a.sort - b.sort);
  return sorted.reduce((total, promo) => {
    if (promo.discountPercent !== null) {
      return Math.round(total * (1 - promo.discountPercent / 100));
    }
    if (promo.discountAmount !== null) {
      return total - promo.discountAmount;
    }
    return total;
  }, cartTotalWithoutPromotions);
};

const isPromotionValid = (promotion, cartTotalCents) => {
  console.log('isPromotionValid', promotion, cartTotalCents);
  const now = new Date();
  if (promotion.minAmount !== null && cartTotalCents < promotion.minAmount) {
    return false;
  }
  if (promotion.startsAt !== null && now < new Date(promotion.startsAt)) {
    return false;
  }
  if (promotion.endsAt !== null && now > new Date(promotion.endsAt)) {
    return false;
  }
  return true;
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.reference !== cartItemToClear.reference);

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotalWithoutPromotions: 0,
  cartTotal: 0,
  shippingFees: 0,
  productToCompose: null,
  setProductToCompose: () => {},
  promotions: [],
  promotionsApplied: [],
  applyPromoCode: () => {},
  removePromotion: () => {},
});

export const CartProvider = ({ children }) => {
  const { deliveryMethod } = useContext(ShopShippingContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // contains current product to compose in modal with all attributes selected
  const [productToCompose, setProductToCompose] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [promotionsApplied, setPromotionsApplied] = useState([]);

  const [{ cartCount, cartTotalWithoutPromotions, cartItems }, dispatch] = useReducer(
    cartReducer,
    INITIAL_STATE
  );

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      // TODO : Check if each items is available(inactive ? stock=0 ?...)
      updateCartItemsReducer(storedCartItems);
    }
  }, []);

  useEffect(() => {
    const getAllPromotions = async () => {
      const fetchedPromotions = await services.promotionService.getAllPromotions();
      setPromotions(fetchedPromotions);

      // Restore manual promo codes from localStorage (date check only — minAmount handled by sync useEffect)
      const savedIds = JSON.parse(localStorage.getItem('promotionsAppliedIds')) || [];
      if (savedIds.length > 0) {
        const restored = fetchedPromotions.filter(
          (p) => p.code !== null && savedIds.includes(p.id) && isPromotionValid(p, Infinity)
        );
        localStorage.setItem('promotionsAppliedIds', JSON.stringify(restored.map((p) => p.id)));
        if (restored.length > 0) {
          setPromotionsApplied(restored);
        }
      }
    };
    getAllPromotions();
  }, []);

  useEffect(() => {
    console.log('on fait useEffect([cartTotalWithoutPromotions, promotions])')
    const autoPromotions = promotions.filter((p) => p.code === null);
    console.log(autoPromotions);
    setPromotionsApplied((prev) => {
      const validManual = prev.filter(
        (p) => p.code !== null && isPromotionValid(p, cartTotalWithoutPromotions)
      );
      const validAuto = autoPromotions.filter((p) => isPromotionValid(p, cartTotalWithoutPromotions));
      return [...validManual, ...validAuto];
    });
  }, [cartTotalWithoutPromotions, promotions]);

  const updateCartItemsReducer = (cartItems) => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    const newCartTotalWithoutPromotions = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.centPrice,
      0
    );

    const payload = {
      cartItems,
      cartCount: newCartCount,
      cartTotalWithoutPromotions: newCartTotalWithoutPromotions,
    };

    dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, payload));

    // Save Cart in local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const generateReference = (productToAdd) => {
    if (productToAdd?.attributesSelected?.length > 0) {
      return productToAdd.id + '#' + productToAdd?.attributesSelected.flatMap(item => [
        item.id,
        ...item.listSelected.map(s => `${s.id}.${s.quantity}`)
      ]).join('_');
    }
    return productToAdd.id;
  };

  const addItemToCart = (productToAdd) => {
    const reference = generateReference(productToAdd);
    const newCartItems = addCartItem(
        cartItems,
        {
          ...productToAdd,
          reference,
        }
        );
    updateCartItemsReducer(newCartItems);
  };

  const removeItemToCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(newCartItems);
  };

  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCartItem(cartItems, cartItemToClear);
    updateCartItemsReducer(newCartItems);
  };

  const applyPromoCode = async (code) => {
    const trimmedCode = code.trim();
    let list = promotions;

    let found = list.find(
      (p) => p.code !== null && p.code === trimmedCode
    );

    if (!found) {
      list = await services.promotionService.getAllPromotions();
      setPromotions(list);
      found = list.find(
        (p) => p.code !== null && p.code === trimmedCode
      );
    }

    if (!found) {
      return { success: false };
    }

    if (!isPromotionValid(found, cartTotalWithoutPromotions)) {
      return { success: false, conditionsNotMet: true };
    }

    const alreadyApplied = promotionsApplied.some((p) => p.id === found.id);
    if (alreadyApplied) {
      return { success: false, alreadyApplied: true };
    }

    setPromotionsApplied((prev) => {
      const updated = [...prev, found];
      localStorage.setItem(
        'promotionsAppliedIds',
        JSON.stringify(updated.filter((p) => p.code !== null).map((p) => p.id))
      );
      return updated;
    });

    return { success: true, promotion: found };
  };

  const removePromotion = (promotionId) => {
    setPromotionsApplied((prev) => {
      const updated = prev.filter((p) => p.id !== promotionId);
      localStorage.setItem(
        'promotionsAppliedIds',
        JSON.stringify(updated.filter((p) => p.code !== null).map((p) => p.id))
      );
      return updated;
    });
  };
  const hasFreeDelivery = promotionsApplied.some((p) => p.freeDelivery === true);
  const shippingFees = deliveryMethod === 'delivery' && !hasFreeDelivery ? DELIVERY_FEES : 0;
  const cartTotal = computeCartTotal(cartTotalWithoutPromotions, promotionsApplied) + shippingFees;

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotalWithoutPromotions,
    cartTotal,
    shippingFees,
    productToCompose,
    setProductToCompose,
    promotions,
    promotionsApplied,
    applyPromoCode,
    removePromotion,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
