import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from '@mui/material';
import { CreditCard, Store, ShoppingCart, Restaurant, Schedule, LocationOn } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';

// Mock order data
const orderItems = [
  { name: 'Pizza Margherita', quantity: 2, price: 12.50 },
  { name: 'Salade César', quantity: 1, price: 8.90 },
  { name: 'Tiramisu', quantity: 1, price: 5.50 },
];

const restaurants = [
  { id: 'resto1', name: 'Chez Luigi', address: '12 rue de la Paix, Paris' },
  { id: 'resto2', name: 'Le Bistrot', address: '45 avenue des Champs, Lyon' },
  { id: 'resto3', name: 'Pizza Corner', address: '23 boulevard Saint-Germain, Marseille' },
];

const OrderSummaryStep = () => {
  const { control, watch, formState: { errors } } = useFormContext();
  const paymentMode = watch('paymentMode');
  const deliveryMode = watch('deliveryMode');
  const restaurant = watch('restaurant');
  const deliveryDate = watch('deliveryDate');
  const deliveryTime = watch('deliveryTime');
  const address = watch('address');

  const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMode === 'delivery' ? 3.90 : 0;
  const total = subtotal + deliveryFee;

  const selectedRestaurant = restaurants.find(r => r.id === restaurant);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Résumé de votre commande
      </Typography>

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Votre commande
              </Typography>
              
              <List dense>
                {orderItems.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${item.quantity}x ${item.name}`}
                      secondary={`${item.price.toFixed(2)} € / unité`}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </Typography>
                  </ListItem>
                ))}
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Sous-total" />
                  <Typography variant="body1">
                    {subtotal.toFixed(2)} €
                  </Typography>
                </ListItem>
                
                {deliveryMode === 'delivery' && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Frais de livraison" />
                    <Typography variant="body1">
                      {deliveryFee.toFixed(2)} €
                    </Typography>
                  </ListItem>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary={<Typography variant="h6">Total</Typography>}
                  />
                  <Typography variant="h6" color="primary">
                    {total.toFixed(2)} €
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détails de la commande
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <Restaurant sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                  Restaurant
                </Typography>
                {selectedRestaurant && (
                  <Box>
                    <Typography variant="body1">{selectedRestaurant.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRestaurant.address}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <Schedule sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                  {deliveryMode === 'delivery' ? 'Livraison' : 'Retrait'}
                </Typography>
                <Typography variant="body1">
                  {deliveryDate} à {deliveryTime}
                </Typography>
                {deliveryMode === 'delivery' ? (
                  <Chip label="Livraison à domicile" color="primary" size="small" sx={{ mt: 0.5 }} />
                ) : (
                  <Chip label="Click & Collect" color="secondary" size="small" sx={{ mt: 0.5 }} />
                )}
              </Box>

              {deliveryMode === 'delivery' && address && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <LocationOn sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                    Adresse de livraison
                  </Typography>
                  <Typography variant="body1">
                    {address.street}<br />
                    {address.zipCode} {address.city}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mode de paiement
              </Typography>

              <Controller
                name="paymentMode"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCard sx={{ mr: 1 }} />
                            Paiement par carte bancaire
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="store"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Store sx={{ mr: 1 }} />
                            Paiement en magasin
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              {paymentMode === 'card' && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Numéro de carte"
                            placeholder="1234 5678 9012 3456"
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="cardExpiry"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Date d'expiration"
                            placeholder="MM/AA"
                            error={!!errors.cardExpiry}
                            helperText={errors.cardExpiry?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="cardCvv"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="CVV"
                            placeholder="123"
                            error={!!errors.cardCvv}
                            helperText={errors.cardCvv?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="cardName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nom sur la carte"
                            error={!!errors.cardName}
                            helperText={errors.cardName?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSummaryStep;