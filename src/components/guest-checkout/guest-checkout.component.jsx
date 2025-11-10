// src/components/guest-checkout/guest-checkout.component.jsx

import { useState, useContext } from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { UserContext } from '../../contexts/user.context';

const GuestCheckout = ({ onSuccess, isInline = false }) => {
  const { setGuestUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.phone) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide (10 chiffres)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Définir l'utilisateur invité dans le contexte
    const guestUser = {
      isGuest: true,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };

    setGuestUser(guestUser);

    if (onSuccess) {
      onSuccess(guestUser);
    }

    return true;
  };

  return (
    <Box component="div">
      <Typography variant="h6" gutterBottom>
        Commande sans compte
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Remplissez vos informations pour continuer sans créer de compte
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="Prénom"
            name="firstName"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Nom"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="phone"
            label="Téléphone"
            name="phone"
            autoComplete="tel"
            placeholder="0612345678"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        Vous pourrez créer un compte après votre commande pour suivre vos commandes et bénéficier de nos avantages
      </Alert>

      {isInline && (
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Continuer en tant qu'invité
        </Button>
      )}
    </Box>
  );
};

export default GuestCheckout;
