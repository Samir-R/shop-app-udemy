import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { CheckCircle, Receipt, Email, Schedule } from '@mui/icons-material';

const OrderConfirmation = ({ orderData }) => {
  const orderNumber = Math.floor(Math.random() * 10000) + 1000;

  return (
    <Card>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom color="success.main">
          Commande confirmée !
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Numéro de commande : #{orderNumber}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ textAlign: 'left' }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                Détails de la commande
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                <strong>Mode :</strong> {orderData.deliveryMode === 'delivery' ? 'Livraison' : 'Click & Collect'}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                <strong>Date et heure :</strong> {orderData.deliveryDate} à {orderData.deliveryTime}
              </Typography>
              
              {orderData.deliveryMode === 'delivery' && orderData.address && (
                <Typography variant="body1" gutterBottom>
                  <strong>Adresse :</strong> {orderData.address.street}, {orderData.address.zipCode} {orderData.address.city}
                </Typography>
              )}
              
              <Typography variant="body1" gutterBottom>
                <strong>Paiement :</strong> {orderData.paymentMode === 'card' ? 'Carte bancaire' : 'En magasin'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                Prochaines étapes
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                • Un email de confirmation a été envoyé à {orderData.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                • Vous recevrez un SMS quand votre commande sera prête
              </Typography>
              
              {orderData.deliveryMode === 'delivery' ? (
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Le livreur vous contactera avant la livraison
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Présentez-vous au restaurant avec votre numéro de commande
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => window.location.reload()}
          >
            Nouvelle commande
          </Button>
          
          <Button 
            variant="outlined" 
            size="large"
          >
            Suivre ma commande
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmation;