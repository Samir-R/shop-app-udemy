import React, {useContext} from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Badge,
} from '@mui/material';
// import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import {
  DrawerHeader,
  CartItemContainer,
  ItemImage,
  ItemDetails,
  QuantityControl,
  QuantityButton,
  QuantityText,
  CartFooter,
  TotalRow,
  CheckoutButton,
  EmptyCartContainer
} from './cart.styles';
import {CartContext} from "../../contexts/cart.context";
import {useNavigate} from "react-router-dom";
import {TbPaperBag} from "react-icons/tb";
import {LuShoppingBag, LuTrash2} from "react-icons/lu";

const CartFooterInfos = ( { displayGoToCheckoutButton = true }) => {
  const { cartItems, isCartOpen, setIsCartOpen, cartCount, cartTotal, addItemToCart, removeItemToCart, clearItemFromCart } = useContext(CartContext);

  const navigate = useNavigate();

  const goToCheckoutHandler = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };
  // const totalAmount = cartItems.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  // );
  //
  // const totalItems = cartItems.reduce(
  //     (sum, item) => sum + item.quantity,
  //     0
  // );

  return (
        <>
          {cartItems.length > 0 && (
              <CartFooter>
                <TotalRow>
                  <Typography variant="body1">Sous-total</Typography>
                  <Typography variant="body1">{cartTotal.toFixed(2)} €</Typography>
                </TotalRow>
                <TotalRow>
                  <Typography variant="body2" color="textSecondary">
                    Livraison
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Gratuite
                  </Typography>
                </TotalRow>
                <Divider sx={{ my: 2 }} />
                <TotalRow>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {cartTotal.toFixed(2)} €
                  </Typography>
                </TotalRow>
                {displayGoToCheckoutButton && <CheckoutButton
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={goToCheckoutHandler}
                >
                  Commander
                </CheckoutButton>}
              </CartFooter>
          )}
        </>
  );
};

export default CartFooterInfos;