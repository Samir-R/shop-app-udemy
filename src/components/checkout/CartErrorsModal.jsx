import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ERROR_CONFIG = {
  PRODUCT_NOT_FOUND: {
    label: 'Retiré',
    color: 'error',
    getMessage: () => 'Produit introuvable dans le catalogue.',
  },
  PRODUCT_UNAVAILABLE: {
    label: 'Retiré',
    color: 'error',
    getMessage: () => 'Produit temporairement indisponible.',
  },
  OUT_OF_STOCK: {
    label: 'Ajusté',
    color: 'warning',
    getMessage: (e) =>
      e.available === 0
        ? 'Rupture de stock — retiré du panier.'
        : `Stock limité — quantité ajustée de ${e.sent} à ${e.available}.`,
  },
  PRICE_MISMATCH: {
    label: 'Retiré',
    color: 'warning',
    getMessage: (e) => `Prix modifié par le restaurant (nouveau prix : ${e.expected} €) — retiré du panier.`,
  },
  INVALID_OPTION: {
    label: 'Retiré',
    color: 'warning',
    getMessage: () => 'Les options sélectionnées ne sont plus valides — veuillez reconfigurer ce produit.',
  },
};

const CartErrorsModal = ({ open, onClose, errors }) => {
  const navigate = useNavigate();

  const productErrors = errors.filter(
    (e) => e.code !== 'INVALID_PROMO' && e.code !== 'TOTAL_MISMATCH'
  );
  const promoErrors = errors.filter((e) => e.code === 'INVALID_PROMO');
  const hasInvalidOption = errors.some((e) => e.code === 'INVALID_OPTION');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <WarningAmber color="warning" />
        Votre panier a été mis à jour
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Certains articles ont dû être ajustés avant de finaliser votre commande :
        </Typography>

        <List disablePadding>
          {productErrors.map((error, i) => {
            const config = ERROR_CONFIG[error.code] ?? { label: 'Modifié', color: 'default', getMessage: () => error.code };
            return (
              <ListItem
                key={i}
                disablePadding
                sx={{
                  mb: 1,
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: config.color === 'error' ? 'error.light' : 'warning.light',
                  bgcolor: config.color === 'error' ? 'rgba(211,47,47,0.06)' : 'rgba(237,108,2,0.06)',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {error.productName || `Produit #${String(error.id).slice(0, 8)}`}
                    </Typography>
                    <Chip
                      label={config.label}
                      size="small"
                      color={config.color}
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {config.getMessage(error)}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}

          {promoErrors.length > 0 && (
            <>
              {productErrors.length > 0 && <Divider sx={{ my: 1 }} />}
              {promoErrors.map((error, i) => (
                <ListItem
                  key={`promo-${i}`}
                  disablePadding
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'info.light',
                    bgcolor: 'rgba(2,136,209,0.06)',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {error.promoTitle || 'Promotion'}
                      </Typography>
                      <Chip label="Retirée" size="small" color="info" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Promotion expirée ou conditions non remplies.
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </>
          )}
        </List>

        {hasInvalidOption && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Pour les produits avec des options invalides, retournez au menu pour les reconfigurer et les ajouter à nouveau au panier.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexWrap: 'wrap', justifyContent: hasInvalidOption ? 'space-between' : 'flex-end' }}>
        {hasInvalidOption && (
          <Button variant="outlined" onClick={() => { onClose(); navigate('/'); }}>
            Retour au menu
          </Button>
        )}
        <Button variant="contained" onClick={onClose}>
          Voir le panier mis à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartErrorsModal;
