import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import { CartContext } from '../../contexts/cart.context';

import { CartIconContainer, ItemCount } from './cart-icon.styles';

const CartIcon = () => {
  const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);

  const toggleIsCartOpen = () => setIsCartOpen(!isCartOpen);

    /* <CartIconContainer onClick={toggleIsCartOpen}> 
      <ShoppingIcon className='shopping-icon' /> 
      <ItemCount>{cartCount}</ItemCount> 
    </CartIconContainer> */
  return (
    <IconButton
    size="large"
    aria-label="account of current user"
    aria-controls="menu-appbar"
    aria-haspopup="true"
    onClick={toggleIsCartOpen}
    color="inherit"
  >
    <ShoppingCartIcon />
    {cartCount}
  </IconButton>
  );
};

export default CartIcon;
