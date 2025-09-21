import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Store, LocalShipping, Schedule, LocationOn } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';

const restaurants = [
  { id: 'resto1', name: 'Chez Luigi', address: '12 rue de la Paix, Paris' },
  { id: 'resto2', name: 'Le Bistrot', address: '45 avenue des Champs, Lyon' },
  { id: 'resto3', name: 'Pizza Corner', address: '23 boulevard Saint-Germain, Marseille' },
];

const timeSlots = [
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const RestaurantStep = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const deliveryMode = watch('deliveryMode');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Restaurant et modalités
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="restaurant"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.restaurant}>
                <InputLabel>Restaurant</InputLabel>
                <Select {...field} label="Restaurant">
                  {restaurants.map((restaurant) => (
                    <MenuItem key={restaurant.id} value={restaurant.id}>
                      <Box>
                        <Typography variant="body1">{restaurant.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.address}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Mode de récupération
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: deliveryMode === 'delivery' ? '2px solid' : '1px solid',
                  borderColor: deliveryMode === 'delivery' ? 'primary.main' : 'grey.300',
                  '&:hover': { borderColor: 'primary.light' }
                }}
                onClick={() => setValue('deliveryMode', 'delivery')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalShipping sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Livraison</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Livré à domicile
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: deliveryMode === 'pickup' ? '2px solid' : '1px solid',
                  borderColor: deliveryMode === 'pickup' ? 'primary.main' : 'grey.300',
                  '&:hover': { borderColor: 'primary.light' }
                }}
                onClick={() => setValue('deliveryMode', 'pickup')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Store sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Click & Collect</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Retrait en magasin
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                error={!!errors.deliveryDate}
                helperText={errors.deliveryDate?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="deliveryTime"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.deliveryTime}>
                <InputLabel>Heure</InputLabel>
                <Select {...field} label="Heure">
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {deliveryMode === 'delivery' && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Adresse de livraison
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Adresse"
                    placeholder="Numéro et nom de rue"
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="address.zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Code postal"
                    error={!!errors.address?.zipCode}
                    helperText={errors.address?.zipCode?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ville"
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default RestaurantStep;