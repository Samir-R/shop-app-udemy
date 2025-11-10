// src/components/auth/VerifyEmail.jsx

import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { CheckCircleOutline as CheckIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import {UserContext} from "../../contexts/user.context";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useContext(UserContext);

  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      const result = await verifyEmail(token);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleGoToLogin = () => {
    navigate('/auth', {
      state: { message: 'Votre email a été vérifié. Vous pouvez vous connecter.' }
    });
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
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            {status === 'loading' && (
                <>
                  <CircularProgress size={60} sx={{ mb: 3 }} />
                  <Typography variant="h5" gutterBottom>
                    Vérification en cours...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Veuillez patienter
                  </Typography>
                </>
            )}

            {status === 'success' && (
                <>
                  <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom color="success.main">
                    Email vérifié !
                  </Typography>
                  <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                    {message}
                  </Alert>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
                  </Typography>
                  <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoToLogin}
                  >
                    Se connecter
                  </Button>
                </>
            )}

            {status === 'error' && (
                <>
                  <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom color="error">
                    Erreur de vérification
                  </Typography>
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    {message}
                  </Alert>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Le lien de vérification est peut-être expiré ou invalide.
                  </Typography>
                  <Button
                      variant="outlined"
                      onClick={() => navigate('/auth')}
                  >
                    Retour à la connexion
                  </Button>
                </>
            )}
          </Paper>
        </Box>
      </Container>
  );
};

export default VerifyEmail;