import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box, Button, Typography, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { UserContext } from '../../../contexts/user.context';
import services from '../../../services';
import ButtonDanger from '../../common/ButtonDanger';

const PaymentForm = ({ orderId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { currentUserGuest } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
        payment_method_data: {
          billing_details: { address: { country: 'FR' } },
        },
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      onPaymentSuccess(orderId);
    }
  };

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await services.orderService.cancelOrder(orderId, currentUserGuest?.email ?? null);
      setCancelDialogOpen(false);
      setSnackbarOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setCancelError(err.message || 'Impossible d\'annuler la commande.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Box>
      <PaymentElement options={{
        layout: 'tabs',
        fields: { billingDetails: { address: { country: 'never' } } },
      }} />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={!stripe || isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockOutlined />}
        sx={{ mt: 3 }}
        onClick={handlePay}
      >
        {isLoading ? 'Traitement en cours...' : 'Payer maintenant'}
      </Button>

      <Typography variant="caption" color="text.secondary" display="block" align="center" sx={{ mt: 1 }}>
        Paiement sécurisé — vos données bancaires ne transitent jamais par nos serveurs
      </Typography>

      <ButtonDanger
        type="button"
        fullWidth
        disabled={isLoading || isCancelling}
        onClick={() => { setCancelError(null); setCancelDialogOpen(true); }}
        sx={{ mt: 2 }}
      >
        Annuler la commande
      </ButtonDanger>

      <Dialog open={cancelDialogOpen} onClose={() => !isCancelling && setCancelDialogOpen(false)}>
        <DialogTitle>Annuler la commande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">
          Commande annulée avec succès
        </Alert>
      </Snackbar>
    </Box>
  );
};

const StripePaymentStep = ({ clientSecret, stripeAccountId, orderId, orderTotal, onPaymentSuccess }) => {
  const stripePromise = useMemo(
    () => loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY, { stripeAccount: stripeAccountId }),
    [stripeAccountId]
  );
    console.log('StripePaymentStep');
  const formattedTotal = orderTotal != null
    ? (orderTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
    : null;

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Paiement sécurisé
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Saisissez vos informations bancaires pour finaliser votre commande.
      </Typography>

      {formattedTotal && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#f8f8f8',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            px: 3,
            py: 2,
            mb: 3,
          }}
        >
          <Typography variant="body1" fontWeight={500} color="text.secondary">
            Total à payer
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {formattedTotal}
          </Typography>
        </Box>
      )}

      <Elements stripe={stripePromise} options={{
        clientSecret,
        appearance: { theme: 'stripe' },
        defaultValues: { billingDetails: { address: { country: 'FR' } } },
      }}>
        <PaymentForm orderId={orderId} onPaymentSuccess={onPaymentSuccess} />
      </Elements>
    </Box>
  );
};

export default StripePaymentStep;
