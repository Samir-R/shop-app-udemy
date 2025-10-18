// src/components/auth/Register.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {UserContext} from "../../contexts/user.context";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    phone: '',
    newsletterSubscribed: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate('/verify-email-sent', { state: { email: formData.email } });
      }, 3000);
    } else {
      setErrors(result.errors || { global: result.message });
    }
  };

  return (
      <Container component="main" maxWidth="sm">
        <Box
            sx={{
              marginTop: 8,
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Créer un compte
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
            )}

            {errors.global && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.global}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
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
                      disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password || 'Minimum 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial'}
                      disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="passwordConfirm"
                      label="Confirmer le mot de passe"
                      type="password"
                      id="passwordConfirm"
                      autoComplete="new-password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      error={!!errors.passwordConfirm}
                      helperText={errors.passwordConfirm}
                      disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                      control={
                        <Checkbox
                            name="newsletterSubscribed"
                            checked={formData.newsletterSubscribed}
                            onChange={handleChange}
                            color="primary"
                            disabled={isLoading}
                        />
                      }
                      label="Je souhaite recevoir la newsletter"
                  />
                </Grid>
              </Grid>

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
              >
                {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "S'inscrire"
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Vous avez déjà un compte ?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default Register;