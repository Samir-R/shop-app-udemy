import React, { useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from '@mui/material';
import { CreditCard, Store, LocationOn } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';
import { FaUserLock, FaUserTie } from 'react-icons/fa';
import { IoStorefrontOutline } from 'react-icons/io5';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { LuHandPlatter } from 'react-icons/lu';
import { IoRestaurantOutline } from 'react-icons/io5';
import { UserContext } from '../../../contexts/user.context';
import { ShopShippingContext } from '../../../contexts/shop-shipping.context';
import { AddressContext } from '../../../contexts/address.context';

const DELIVERY_METHOD_CONFIG = {
  delivery: { label: 'Livraison',       Icon: MdOutlineDeliveryDining },
  pickup:   { label: 'Click & Collect', Icon: LuHandPlatter },
  onsite:   { label: 'Sur place',       Icon: IoRestaurantOutline },
};

const formatDeliveryDate = (date) => {
  if (!date) return '';
  try {
    const d = date instanceof Date ? date : new Date(date);
    return format(d, 'EEEE d MMMM yyyy', { locale: fr });
  } catch {
    return '';
  }
};

const OrderSummaryStep = () => {
  const { control, watch, formState: { errors } } = useFormContext();
  const paymentMode = watch('paymentMode');

  const theme = useTheme();
  const { currentUser, currentUserGuest, refreshUser } = useContext(UserContext);
  const { shop, deliveryMethod, deliveryDate, deliveryHour, asap } = useContext(ShopShippingContext);
  const { currentAddress } = useContext(AddressContext);

  const deliveryConfig = DELIVERY_METHOD_CONFIG[deliveryMethod] ?? DELIVERY_METHOD_CONFIG.delivery;
  const DeliveryIcon = deliveryConfig.Icon;

  useEffect(() => {
    if (currentUser) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = currentUser || currentUserGuest;
  const isGuest = !!currentUserGuest;

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const userName = firstName && lastName
    ? `${firstName} ${lastName}`
    : user?.name || user?.email?.split('@')[0] || '';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Résumé de votre commande
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Card 1 : Utilisateur */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                {isGuest
                  ? <FaUserTie size={20} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                  : <FaUserLock size={20} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                }
                <Typography variant="subtitle1" fontWeight="bold">
                  {isGuest ? 'Invité' : 'Compte'}
                </Typography>
              </Box>
              {user ? (
                <>
                  {userName && <Typography variant="body2">{userName}</Typography>}
                  {user.email && (
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  )}
                  {user.phone && (
                    <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                  )}
                  {isGuest && (
                    <Chip label="Invité" size="small" color="secondary" sx={{ mt: 1 }} />
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Non renseigné</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 : Restaurant */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IoStorefrontOutline size={22} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                <Typography variant="subtitle1" fontWeight="bold">Restaurant</Typography>
              </Box>
              {shop ? (
                <>
                  <Typography variant="body2" fontWeight="medium">{shop.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{shop.address}</Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Non sélectionné</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 : Livraison */}
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <DeliveryIcon size={22} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {deliveryConfig.label}
                </Typography>
              </Box>
              {asap ? (
                <Chip label="Dès que possible" size="small" color="primary" />
              ) : deliveryDate && deliveryHour ? (
                <>
                  <Typography variant="body2">{formatDeliveryDate(deliveryDate)} à {deliveryHour}</Typography>
                  {/*<Typography variant="body2" color="text.secondary">à {deliveryHour}</Typography>*/}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Non renseigné</Typography>
              )}
              {deliveryMethod === 'delivery' && currentAddress && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1.5 }}>
                  <LocationOn sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary', mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">{currentAddress.street1}</Typography>
                    {currentAddress.street2 && <Typography variant="body2" color="text.secondary">{currentAddress.street2}</Typography>}
                    <Typography variant="body2" color="text.secondary">
                      {currentAddress.zipcode} {currentAddress.city}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Paiement */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
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
    </Box>
  );
};

export default OrderSummaryStep;
