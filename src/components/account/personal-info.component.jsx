import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Register from '../sign-up-form/sign-up-form.component';
import ChangePassword from '../sign-up-form/change-password.component';
import AddressManagement from './address-management.component';
import {UserContext} from "../../contexts/user.context";

export default function PersonalInfo() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');

  const handleUserUpdate = (updatedData) => {
    // Afficher le message de succès
    setUpdateSuccessMessage('Vos informations ont été mises à jour avec succès');

    // Cacher le message après 5 secondes
    setTimeout(() => {
      setUpdateSuccessMessage('');
    }, 5000);
  };

  console.log('🔄 PersonalInfo re-render - currentUser:', currentUser?.email)
  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/my-account')}
        sx={{ mb: 3, color: '#1976d2' }}
      >
        Retour au tableau de bord
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Mes informations personnelles { currentUser?.id }
      </Typography>

      {/* Message de succès global */}
      {updateSuccessMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {updateSuccessMessage}
        </Alert>
      )}

      {/* Informations personnelles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Informations de base
          </Typography>
          <Register
            mode="edit"
            initialData={{
              id: currentUser?.id,
              firstName: currentUser?.firstName,
              lastName: currentUser?.lastName,
              email: currentUser?.email,
              phone: currentUser?.phone || '',
              newsletterSubscribed: currentUser?.newsletterSubscribed || false,
            }}
            onSuccess={handleUserUpdate}
          />
        </CardContent>
      </Card>

      {/* Modification du mot de passe */}
      <Box sx={{ mb: 3 }}>
        <ChangePassword onSuccess={() => console.log('Password changed')} />
      </Box>

      {/* Adresses */}
      <AddressManagement />
    </Box>
  );
}