import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button, Typography } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import services from '../../services';
import OrderDetailView from '../../components/order/OrderDetailView';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const redirectStatus = searchParams.get('redirect_status');
  const isSuccess = redirectStatus === 'succeeded';
  const isProcessing = redirectStatus === 'processing';

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    const guestEmail = sessionStorage.getItem('guestEmail') ?? null;
    services.orderService.getOrder(orderId, guestEmail)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isSuccess && !isProcessing) {
    return (
      <Box sx={{ p: 3, mt: 10, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Paiement non abouti</Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          Votre paiement n'a pas pu être traité. Aucun montant n'a été débité.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mt: 10, maxWidth: 800, mx: 'auto' }}>
      {isProcessing ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Votre paiement est en cours de traitement. Vous recevrez une confirmation par email.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ mb: 3, fontSize: '1rem' }}>
          Commande confirmée ! Merci pour votre commande.
        </Alert>
      )}

      {order ? (
        <OrderDetailView order={order} />
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {orderId ? 'Les détails de votre commande seront disponibles dans votre espace compte.' : 'Commande enregistrée.'}
        </Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Nouvelle commande
        </Button>
        {order && (
          <Button variant="outlined" onClick={() => navigate('/my-account/orders')}>
            Suivre mes commandes
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrderConfirmationPage;
