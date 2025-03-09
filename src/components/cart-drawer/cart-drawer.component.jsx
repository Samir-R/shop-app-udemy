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
} from './cart-drawer.styles';
import {CartContext} from "../../contexts/cart.context";
import {useNavigate} from "react-router-dom";
import {TbPaperBag} from "react-icons/tb";
import {LuShoppingBag, LuTrash2} from "react-icons/lu";
import Cart from "../cart/cart.component";
import CartFooterInfos from "../cart/cart-footer-infos.component";

/**
 * @typedef {import('../types/CartTypes').CartItem} CartItem
 */

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, cartCount, cartTotal, addItemToCart, removeItemToCart, clearItemFromCart } = useContext(CartContext);
  // const navigate = useNavigate();
  //
  // const goToCheckoutHandler = () => {
  //   navigate('/checkout');
  // };
  const theme = useTheme();

  // const totalAmount = cartItems.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  // );
  //
  // const totalItems = cartItems.reduce(
  //     (sum, item) => sum + item.quantity,
  //     0
  // );

  const handleClose = () => setIsCartOpen(false);
  return (
      <Drawer
          anchor="right"
          open={isCartOpen}
          onClose={handleClose}
          PaperProps={{
            sx: { width: { xs: '100%', sm: 400 } },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={cartCount} color="error" sx={{ mr: 1 }}>
              <LuShoppingBag size={24} />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Votre Panier
            </Typography>
          </Box>
          <IconButton onClick={handleClose} color="inherit" edge="end">
            {/*<X size={24} />*/}
            X
          </IconButton>
        </DrawerHeader>
        <Cart />
        <CartFooterInfos />
      </Drawer>
  );
};

export default CartDrawer;