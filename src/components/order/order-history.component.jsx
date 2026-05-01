import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { getStatusIcon, getStatusLabel, getStatusColor, getOrderTypeLabel, getOrderTypeIcon } from '../../utils/order-status.utils';
import { UserContext } from '../../contexts/user.context';
import services from '../../services';

const LIMIT = 10;

export default function OrderHistory() {
  const navigate = useNavigate();
  const { handleUnauthenticated } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    services.orderService.getOrders(page, LIMIT)
      .then(({ items, pagination }) => {
        if (cancelled) return;
        setOrders(items);
        setTotalPages(pagination.pages || 1);
      })
      .catch(err => {
        if (cancelled) return;
        if (err.status === 401) { handleUnauthenticated(); return; }
        setError(err.message || 'Erreur lors du chargement des commandes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page]);

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/my-account')}
        sx={{ mb: 3 }}
      >
        Retour au tableau de bord
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Mes commandes
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Retrouvez l'historique de toutes vos commandes
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card sx={{ '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.3s', borderRadius: 4 }}>
                  <CardContent>
                    {/* Ligne 1 : numéro + chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mr: 0.5 }}>
                        Commande #{order.orderNumber}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={getStatusLabel(order.status)}
                        sx={{
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={getOrderTypeIcon(order.orderType, 16)}
                        label={getOrderTypeLabel(order.orderType)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Ligne 2 : date */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Commandée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>

                    {/* Ligne 3 : total + bouton */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          {order.total.toFixed(2)} €
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/my-account/orders/${order.id}`)}
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

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
