import React, { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { TbPaperBag } from 'react-icons/tb';
import { CartContext } from '../../contexts/cart.context';

/**
 * Composant de pied de page du panier pour les petits écrans
 * Affiche le total du panier, le nombre d'articles et un bouton pour ouvrir le drawer
 */
const CartFooter = () => {
  const { isCartOpen, setIsCartOpen, cartCount, cartTotal } = useContext(CartContext);

  const toggleIsCartOpen = () => setIsCartOpen(!isCartOpen);

  // Ne pas afficher si le panier est vide
  if (cartCount === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'flex', md: 'none' }, // Visible uniquement sur petits écrans
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'primary.main',
        color: 'white',
        px: 2,
        py: 1.5,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        gap: 2,
      }}
    >
      {/* Total et nombre d'articles */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {cartCount} {cartCount > 1 ? 'articles' : 'article'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {cartTotal.toFixed(2)} €
        </Typography>
      </Box>

      {/* Bouton pour ouvrir le panier */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<TbPaperBag size={20} />}
        onClick={toggleIsCartOpen}
        aria-label="Voir le détail de votre panier"
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          px: 2.5,
          py: 1,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          flex: '0 0 auto',
          alignSelf: 'center',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          },
        }}
      >
        Voir le détail
      </Button>
    </Box>
  );
};

export default CartFooter;
