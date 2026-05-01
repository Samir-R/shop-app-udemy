import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { getStatusIcon, getStatusLabel, getStatusColor, getOrderTypeLabel, getOrderTypeIcon, ORDER_STATUS } from '../../utils/order-status.utils';
import { UserContext } from '../../contexts/user.context';
import services from '../../services';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleUnauthenticated } = useContext(UserContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    services.orderService.getOrder(orderId)
      .then(data => {
        if (!cancelled) setOrder(data);
      })
      .catch(err => {
        if (cancelled) return;
        if (err.status === 401) { handleUnauthenticated(); return; }
        setError(err.message || 'Commande introuvable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [orderId]);

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
        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          onClick={() => navigate('/my-account/orders')}
        >
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  const deliveryAddr = order.deliveryAddress;

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/my-account/orders')}
        sx={{ mb: 3 }}
      >
        Retour aux commandes
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Commande #{order.orderNumber}
      </Typography>

      {/* En-tête de la commande */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#666' }} />
                <Typography variant="body1">
                  <strong>Date de commande :</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 1, color: '#666', display: 'flex', alignItems: 'center' }}>
                  {getOrderTypeIcon(order.orderType)}
                </Box>
                <Typography variant="body1">
                  <strong>Type :</strong> {getOrderTypeLabel(order.orderType)}
                  {order.pointOfSale?.name && ` — ${order.pointOfSale.name}`}
                </Typography>
              </Box>

              {deliveryAddr && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#666', mt: 0.3 }} />
                  <Typography variant="body1">
                    <strong>Adresse de livraison :</strong>{' '}
                    {deliveryAddr.street1}
                    {deliveryAddr.street2 ? `, ${deliveryAddr.street2}` : ''}
                    {`, ${deliveryAddr.zipcode} ${deliveryAddr.city}`}
                  </Typography>
                </Box>
              )}

              {order.customerNote && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Note :</strong> {order.customerNote}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={getStatusLabel(order.status)}
                  sx={{
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    height: 36,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
                {order.total.toFixed(2)} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total TTC
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Articles commandés */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Articles commandés
          </Typography>

          {order.items?.map((item, index) => (
            <Box key={item.id}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1 }}>
                <Avatar
                  src={item.productImageUrl}
                  alt={item.productName}
                  sx={{ width: 64, height: 64, mr: 2 }}
                  variant="rounded"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantité : {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prix unitaire : {item.unitPrice.toFixed(2)} €
                  </Typography>
                  {item.selectedOptions?.map((option, i) => (
                    <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {option.featureName ?? option.menuName} :{' '}
                      {option.selectedValues
                        ? option.selectedValues.map(v => v.valueName).join(', ')
                        : option.selectedItems?.map(v => `${v.quantity}x ${v.productName}`).join(', ')}
                    </Typography>
                  ))}
                  {item.note && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                      Note : {item.note}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.subtotal.toFixed(2)} €
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Récapitulatif des montants */}
          {order.subtotal != null && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Sous-total</Typography>
              <Typography variant="body1">{order.subtotal.toFixed(2)} €</Typography>
            </Box>
          )}
          {order.deliveryFee != null && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Frais de livraison</Typography>
              <Typography variant="body1">
                {order.deliveryFee === 0 ? 'Offerts' : `${order.deliveryFee.toFixed(2)} €`}
              </Typography>
            </Box>
          )}
          {order.discountAmount != null && order.discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" color="success.main">Réduction</Typography>
              <Typography variant="body1" color="success.main">-{order.discountAmount.toFixed(2)} €</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total de la commande
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {order.total.toFixed(2)} €
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        {order.status === ORDER_STATUS.DELIVERED && (
          <Button >
            Recommander
          </Button>
        )}
        <Button>
          Contacter le support
        </Button>
      </Box>
    </Box>
  );
}
