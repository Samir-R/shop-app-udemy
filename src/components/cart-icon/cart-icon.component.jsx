import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import { Badge } from "@mui/material";
import { TbPaperBag } from "react-icons/tb";

import { CartContext } from '../../contexts/cart.context';

const CartIcon = () => {
  const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);

  const toggleIsCartOpen = () => setIsCartOpen(!isCartOpen);

  return (
    <IconButton
      aria-label="Voir votre panier"
      aria-controls="cart-drawer"
      onClick={toggleIsCartOpen}
      color="inherit"
      sx={{ p: 1 }}
    >
      <Badge
        badgeContent={cartCount}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#ff6b35',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            minWidth: '20px',
            height: '20px',
            borderRadius: '10px',
          },
        }}
      >
        <TbPaperBag size={28} />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;
