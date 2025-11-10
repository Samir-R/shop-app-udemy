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
import PasswordFields, { validatePasswords } from './password-fields.component';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useContext(UserContext);

  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/auth');
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

    // Validation avec Zod via validatePasswords
    const validationErrors = validatePasswords(formData.password, formData.passwordConfirm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, formData.password, formData.passwordConfirm);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate('/auth', {
          state: { message: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.' }
        });
      }, 3000);
    } else {
      setErrors(result.errors || { global: result.message });
    }

    setIsLoading(false);
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
              <PasswordFields
                password={formData.password}
                passwordConfirm={formData.passwordConfirm}
                onPasswordChange={handleChange}
                onPasswordConfirmChange={handleChange}
                errors={errors}
                disabled={isLoading}
                passwordLabel="Nouveau mot de passe"
                useGrid={false}
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