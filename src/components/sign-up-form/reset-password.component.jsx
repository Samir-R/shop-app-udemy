// src/components/auth/ResetPassword.jsx

import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { UserContext } from '../../contexts/user.context';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading } = useContext(UserContext);

  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await resetPassword(token, formData.password, formData.passwordConfirm);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.' }
        });
      }, 3000);
    } else {
      setErrors(result.errors || { global: result.message });
    }
  };

  if (!token) {
    return null;
  }

  return (
      <Container component="main" maxWidth="xs">
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
              Nouveau mot de passe
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Choisissez un nouveau mot de passe sécurisé pour votre compte.
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

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Nouveau mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  autoFocus
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password || 'Minimum 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial'}
                  disabled={isLoading}
              />

              <TextField
                  margin="normal"
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
                    'Réinitialiser le mot de passe'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default ResetPassword;