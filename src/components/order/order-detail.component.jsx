import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ORDER_STATUS } from '../../utils/order-status.utils';
import { UserContext } from '../../contexts/user.context';
import services from '../../services';
import OrderDetailView from './OrderDetailView';
import ButtonDanger from '../common/ButtonDanger';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleUnauthenticated } = useContext(UserContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    services.orderService.getOrder(orderId)
      .then(data => { if (!cancelled) setOrder(data); })
      .catch(err => {
        if (cancelled) return;
        if (err.status === 401) { handleUnauthenticated(); return; }
        setError(err.message || 'Commande introuvable');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId]);

  const canCancel = order?.status === ORDER_STATUS.PENDING || order?.status === ORDER_STATUS.CONFIRMED;

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await services.orderService.cancelOrder(order.id);
      // Re-fetch pour afficher le statut CANCELLED à jour
      const updated = await services.orderService.getOrder(order.id);
      setOrder(updated);
      setCancelDialogOpen(false);
    } catch (err) {
      setCancelError(err.message || 'Impossible d\'annuler la commande.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, mt: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ p: 3, mt: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error || 'Commande introuvable'}</Alert>
        <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate('/my-account/orders')}>
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/my-account/orders')} sx={{ mb: 3 }}>
        Retour aux commandes
      </Button>

      <OrderDetailView order={order} />

      {canCancel && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <ButtonDanger
            variant="contained"
            onClick={() => { setCancelError(null); setCancelDialogOpen(true); }}
          >
            Annuler la commande
          </ButtonDanger>
        </Box>
      )}

      <Dialog open={cancelDialogOpen} onClose={() => !isCancelling && setCancelDialogOpen(false)}>
        <DialogTitle>Annuler la commande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler la commande <strong>#{order.orderNumber}</strong> ?
            Cette action est irréversible.
          </DialogContentText>
          {cancelError && (
            <Alert severity="error" sx={{ mt: 2 }}>{cancelError}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={isCancelling}>
            Retour
          </Button>
          <ButtonDanger
            variant="contained"
            onClick={handleCancelConfirm}
            disabled={isCancelling}
            startIcon={isCancelling ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isCancelling ? 'Annulation...' : 'Confirmer l\'annulation'}
          </ButtonDanger>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
