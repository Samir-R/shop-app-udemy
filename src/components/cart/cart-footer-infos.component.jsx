import React, {useContext, useState} from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import {ExpandMore, ExpandLess, DeleteOutline} from '@mui/icons-material';
import {
  CartFooter,
  TotalRow,
  CheckoutButton,
} from './cart.styles';
import {CartContext} from "../../contexts/cart.context";
import {useNavigate} from "react-router-dom";
import {LuTrash2} from "react-icons/lu";

const CartFooterInfos = ( { displayGoToCheckoutButton = true }) => {
  const {
    cartItems,
    setIsCartOpen,
    cartTotal,
    cartTotalWithoutPromotions,
    shippingFees,
    promotionsApplied,
    applyPromoCode,
    removePromotion,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [discountOpen, setDiscountOpen] = useState(false);

  const goToCheckoutHandler = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const result = await applyPromoCode(promoCode);
    if (result.success) {
      setPromoSuccess(`Code "${promoCode.trim()}" appliqué !`);
      setPromoCode('');
    } else if (result.alreadyApplied) {
      setPromoError(`Le code "${promoCode.trim()}" est déjà appliqué.`);
    } else if (result.conditionsNotMet) {
      setPromoError('Les conditions de ce code promo ne sont pas remplies.');
    } else {
      setPromoError('Code promo invalide ou introuvable.');
    }
  };

  const hasDiscount = cartTotal !== cartTotalWithoutPromotions;
  const discountAmount = cartTotal - cartTotalWithoutPromotions;
  const sortedPromotions = [...promotionsApplied].sort((a, b) => a.sort - b.sort);
  const hasAppliedPromotions = sortedPromotions.length > 0;

  return (
    <>
      {cartItems.length > 0 && (
        <CartFooter>
          <Box component="form" onSubmit={handlePromoSubmit} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
            <TextField
              size="small"
              label="Code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              error={!!promoError}
              helperText={promoError || promoSuccess}
              FormHelperTextProps={{ style: { color: promoSuccess ? 'green' : undefined } }}
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="contained" size="small" disabled={!promoCode.trim()}>
              Appliquer
            </Button>
          </Box>

          <TotalRow>
            <Typography variant="body1">Sous-total</Typography>
            <Typography variant="body1">{(cartTotalWithoutPromotions / 100).toFixed(2)} €</Typography>
          </TotalRow>
          <TotalRow>
            <Typography variant="body2" color="textSecondary">
              Livraison
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {shippingFees === 0 ? 'Gratuite' : `${(shippingFees / 100).toFixed(2)} €`}
            </Typography>
          </TotalRow>
          {hasAppliedPromotions && (
            <Box>
              <TotalRow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Réduction
                  </Typography>
                  <Chip
                    label={sortedPromotions.length}
                    size="small"
                    color="success"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                  <IconButton size="small" onClick={() => setDiscountOpen((v) => !v)} sx={{ p: 0 }}>
                    {discountOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </IconButton>
                </Box>
                {hasDiscount ? (
                  <Typography variant="body2" color="success.main">
                    {(discountAmount / 100).toFixed(2)} €
                  </Typography>
                ) : (
                  <Typography variant="body2" color="success.main">
                    —
                  </Typography>
                )}
              </TotalRow>
              <Collapse in={discountOpen}>
                <Box sx={{ pl: 1, pb: 1 }}>
                  {sortedPromotions.map((p) => (
                    <TotalRow key={p.id}>
                      <Typography variant="caption" color="textSecondary">{p.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" color="success.main">{p.promotionToDisplay}</Typography>
                        {p.code !== null && (
                          <IconButton size="small" onClick={() => removePromotion(p.id)} sx={{ p: 0, color: 'error.main' }}>
                            <LuTrash2 />
                          </IconButton>
                        )}
                      </Box>
                    </TotalRow>
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <TotalRow>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {(cartTotal / 100).toFixed(2)} €
            </Typography>
          </TotalRow>
          {displayGoToCheckoutButton && (
            <CheckoutButton
              variant="contained"
              fullWidth
              color="primary"
              onClick={goToCheckoutHandler}
            >
              Commander
            </CheckoutButton>
          )}
        </CartFooter>
      )}
    </>
  );
};

export default CartFooterInfos;
