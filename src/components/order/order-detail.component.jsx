import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

export default function OrderDetail({ order, onBack }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'in-progress':
        return <ScheduleIcon sx={{ color: '#ff9800' }} />;
      case 'cancelled':
        return <CancelIcon sx={{ color: '#f44336' }} />;
      default:
        return <ScheduleIcon sx={{ color: '#666' }} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in-progress':
        return 'En cours';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={onBack}
        sx={{ mb: 3, color: '#1976d2' }}
      >
        ← Retour aux commandes
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Commande #{order.id}
      </Typography>

      {/* En-tête de la commande */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#666' }} />
                <Typography variant="body1">
                  <strong>Date de commande:</strong> {new Date(order.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, color: '#666' }} />
                <Typography variant="body1">
                  <strong>Adresse de livraison:</strong> {order.deliveryAddress}
                </Typography>
              </Box>
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
                    height: 36
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Articles commandés
          </Typography>

          {order.items.map((item, index) => (
            <Box key={item.id}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Avatar
                  src={item.image}
                  alt={item.name}
                  sx={{ width: 64, height: 64, mr: 2 }}
                  variant="rounded"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantité: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prix unitaire: {item.price.toFixed(2)} €
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {(item.price * item.quantity).toFixed(2)} €
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        {order.status === 'completed' && (
          <Button variant="outlined" sx={{ color: '#1976d2', borderColor: '#1976d2' }}>
            Recommander
          </Button>
        )}
        <Button variant="outlined">
          Contacter le support
        </Button>
      </Box>
    </Box>
  );
}