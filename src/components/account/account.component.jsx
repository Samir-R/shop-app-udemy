import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalOffer as LocalOfferIcon,
  Edit as EditIcon
} from '@mui/icons-material';
// import { useUser } from '../context/UserContext';
import {orders, user} from "../../routes/checkout/fakeData";

export default function AccountDashboard({ onNavigate }) {
  // const { user, orders, promoCodes } = useUser();

  const menuItems = [
    {
      id: 'personal-info',
      title: 'Mes informations personnelles',
      description: 'Gérer vos informations et adresses',
      icon: <PersonIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      stats: `${user.addresses.length} adresse${user.addresses.length > 1 ? 's' : ''}`,
      color: '#e3f2fd'
    },
    {
      id: 'orders',
      title: 'Mes commandes',
      description: 'Historique et suivi de vos commandes',
      icon: <ShoppingBagIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      stats: `${orders.length} commande${orders.length > 1 ? 's' : ''}`,
      color: '#fff3e0'
    },
    {
      id: 'rewards',
      title: 'Mes avantages',
      description: 'Points de fidélité et codes promo',
      icon: <LocalOfferIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      stats: `${user.loyaltyPoints} points`,
      color: '#e8f5e8'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: '#1976d2',
            fontSize: '2rem'
          }}
        >
          {user.firstName[0]}{user.lastName[0]}
        </Avatar>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Bonjour {user.firstName} !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue dans votre espace personnel
        </Typography>
      </Box>

      {/* Menu Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {menuItems.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => onNavigate(item.id)}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Chip
                  label={item.stats}
                  size="small"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    mb: 2
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' }
                    }}
                  >
                    Gérer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}