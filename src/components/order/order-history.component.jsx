import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import OrderDetail from "./order-detail.component";
import {orders} from "../../routes/checkout/fakeData";
// import { useUser } from '../context/UserContext';
// import OrderDetail from './OrderDetail';

export default function OrderHistory({ onBack }) {
  // const { orders } = useUser();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

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
        ← Retour au tableau de bord
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Mes commandes
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Retrouvez l'historique de toutes vos commandes
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card sx={{ '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.3s' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                        Commande #{order.id}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={getStatusLabel(order.status)}
                        sx={{
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Commandée le {new Date(order.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      📍 {order.deliveryAddress}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {order.total.toFixed(2)} €
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Aperçu des articles */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {order.items.slice(0, 4).map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity}x {item.name}
                      </Typography>
                    </Box>
                  ))}
                  {order.items.length > 4 && (
                    <Typography variant="body2" color="text.secondary">
                      +{order.items.length - 4} autre{order.items.length - 4 > 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                    onClick={() => setSelectedOrder(order)}
                    sx={{ color: '#1976d2', borderColor: '#1976d2' }}
                  >
                    Voir le détail
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {orders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Aucune commande pour le moment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vos prochaines commandes apparaîtront ici
          </Typography>
        </Box>
      )}
    </Box>
  );
}