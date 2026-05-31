import React, { useContext, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { UserContext } from '../../contexts/user.context';
import OrderDetailView from '../order/OrderDetailView';

const OrderConfirmation = ({ orderData }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    sessionStorage.removeItem('guestEmail');
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Alert
        severity="success"
        icon={<CheckCircle fontSize="inherit" />}
        sx={{ mb: 3, fontSize: '1rem' }}
      >
        Commande confirmée ! Merci pour votre commande.
      </Alert>

      <OrderDetailView order={orderData} />

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Nouvelle commande
        </Button>

        {currentUser ? (
          <Button variant="outlined" size="large" onClick={() => navigate('/my-account/orders')}>
            Suivre mes commandes
          </Button>
        ) : (
          <Alert severity="info" sx={{ maxWidth: 420 }}>
            <strong>Créez un compte</strong> pour suivre vos commandes et bénéficier d'avantages exclusifs.{' '}
            <Button size="small" onClick={() => navigate('/auth')}>S'inscrire</Button>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default OrderConfirmation;
