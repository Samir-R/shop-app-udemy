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

/**
 * @typedef {import('../types/CartTypes').CartItem} CartItem
 */

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, cartCount, cartTotal, addItemToCart, removeItemToCart, clearItemFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const goToCheckoutHandler = () => {
    navigate('/checkout');
  };
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

        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          {cartItems.length === 0 ? (
              <EmptyCartContainer>
                <TbPaperBag size={64} color={theme.palette.text.disabled} />
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                  Votre panier est vide
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Ajoutez des articles pour commencer
                </Typography>
              </EmptyCartContainer>
          ) : (
              cartItems.map((item) => (
                  <CartItemContainer key={item.reference}>
                    <ItemImage src={item.imageUrl} alt={item.name} />
                    <ItemDetails>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {item.price.toFixed(2)} € / unité
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <QuantityControl>
                          <QuantityButton
                              size="small"
                              onClick={() => removeItemToCart(item)}
                          >
                            {/*<Minus size={16} />*/}
                            -
                          </QuantityButton>
                          <QuantityText>{item.quantity}</QuantityText>
                          <QuantityButton
                              size="small"
                              onClick={() => addItemToCart(item)}
                          >
                            {/*<Plus size={16} />*/}
                            +
                          </QuantityButton>
                        </QuantityControl>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => clearItemFromCart(item)}
                        >
                          <LuTrash2 size={18} />
                        </IconButton>
                      </Box>
                    </ItemDetails>
                  </CartItemContainer>
              ))
          )}
        </Box>

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
              <CheckoutButton
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={goToCheckoutHandler}
              >
                Commander
              </CheckoutButton>
            </CartFooter>
        )}
      </Drawer>
  );
};

export default CartDrawer;