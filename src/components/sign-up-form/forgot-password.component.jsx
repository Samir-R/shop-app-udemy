// src/components/auth/ForgotPassword.jsx

import { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { UserContext } from '../../contexts/user.context';

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccessMessage(result.message);
      setEmail('');
    } else {
      setError(result.message);
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
            <Box sx={{ mb: 2 }}>
              <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                  }}
              >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Retour à la connexion
              </Link>
            </Box>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Mot de passe oublié ?
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
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
                  value={email}
                  onChange={handleChange}
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
                    'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default ForgotPassword;