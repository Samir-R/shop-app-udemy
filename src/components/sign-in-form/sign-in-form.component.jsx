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
  Grid,
} from '@mui/material';
import { UserContext } from '../../contexts/user.context';
import { loginSchema } from '../sign-up-form/validation';

const Login = ({ mode = 'login', onSuccess, hideTitle = false, onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  const isStepperMode = mode === 'stepper';
  const isAuthMode = mode === 'auth';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (localError) {
      setLocalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation avec Zod
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setLocalError(firstError.message);
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Si on est dans le stepper, appeler onSuccess au lieu de naviguer
      if (isStepperMode && onSuccess) {
        onSuccess();
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setLocalError(result.message);
    }

    setIsLoading(false);
  };

  // Champs de formulaire (déclarés une seule fois)
  const formFields = (
    <Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        m: 0,
        '& .MuiGrid-container': {
          width: '100%',
        }
      }}
    >
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
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
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </Grid>
    </Grid>
  );

  const submitButton = (
    <Button
      type={isStepperMode || isAuthMode ? 'button' : 'submit'}
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      disabled={isLoading}
      onClick={isStepperMode || isAuthMode ? handleSubmit : undefined}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Se connecter'
      )}
    </Button>
  );

  // Rendu pour le stepper (mode inline)
  if (isStepperMode) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Connexion
        </Typography>

        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {formFields}
        {submitButton}
      </Box>
    );
  }

  // Rendu pour la page d'authentification (mode auth) - sans Paper ni Container
  if (isAuthMode) {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          flex: 1, // Prend toute la hauteur disponible
          minHeight: 0, // Important pour le flex
        }}
      >
        {!hideTitle && (
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Connexion
          </Typography>
        )}

        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {location.state?.message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {location.state.message}
          </Alert>
        )}

        {formFields}

        <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Mot de passe oublié ?
          </Link>
        </Box>

        {submitButton}

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Pas encore de compte ?{' '}
            {onSwitchToSignUp ? (
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToSignUp}
                sx={{ cursor: 'pointer' }}
              >
                S'inscrire
              </Link>
            ) : (
              <Link component={RouterLink} to="/register" variant="body2">
                S'inscrire
              </Link>
            )}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Rendu pour la page standalone
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

          {localError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError}
            </Alert>
          )}

          {location.state?.message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {location.state.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {formFields}

            <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Mot de passe oublié ?
              </Link>
            </Box>

            {submitButton}

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Pas encore de compte ?{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  S'inscrire!
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