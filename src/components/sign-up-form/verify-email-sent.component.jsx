// src/components/auth/VerifyEmailSent.jsx

import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { MailOutline as MailIcon } from '@mui/icons-material';
import {UserContext} from "../../contexts/user.context";

const VerifyEmailSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail } = useContext(UserContext);

  const email = location.state?.email;

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleResend = async () => {
    setMessage('');
    setError('');

    setIsLoading(true);
    const result = await resendVerificationEmail(email);

    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
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
            <MailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />

            <Typography variant="h4" gutterBottom>
              Vérifiez votre email
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Un email de vérification a été envoyé à :
            </Typography>

            <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
              {email}
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              Cliquez sur le lien dans l'email pour activer votre compte. Si vous ne voyez pas l'email, vérifiez votre dossier spam.
            </Alert>

            {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Vous n'avez pas reçu l'email ?
              </Typography>

              <Button
                  variant="outlined"
                  onClick={handleResend}
                  disabled={isLoading}
                  fullWidth
              >
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    'Renvoyer l\'email de vérification'
                )}
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                  variant="text"
                  onClick={() => navigate('/auth')}
              >
                Retour à la connexion
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default VerifyEmailSent;