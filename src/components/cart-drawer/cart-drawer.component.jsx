import { Drawer } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../../contexts/cart.context';

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';

import {
  CartDropdownContainer,
  EmptyMessage,
  CartItems,
} from './cart-drawer.styles';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  const goToCheckoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <Drawer open={isCartOpen} anchor={"right"} onClose={() => setIsCartOpen(false)}
    sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      {cartItems.length ? (
          cartItems.map((item) => <CartItem key={item.id} cartItem={item} />)
        ) : (
          <EmptyMessage>Your cart is empty</EmptyMessage>
        )}
    </Drawer>
  );
};

export default CartDrawer;
