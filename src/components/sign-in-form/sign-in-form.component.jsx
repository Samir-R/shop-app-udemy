// src/components/auth/Login.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { UserContext } from '../../contexts/user.context';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (localError || error) {
      setLocalError('');
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!formData.email || !formData.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setLocalError(result.message);
    }
  };

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
              Connexion
            </Typography>

            {(localError || error) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {localError || error}
                </Alert>
            )}

            {location.state?.message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {location.state.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
              />

              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
              />

              <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Box>

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
                    'Se connecter'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Pas encore de compte ?{' '}
                  <Link component={RouterLink} to="/register" variant="body2">
                    S'inscrire
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default Login;