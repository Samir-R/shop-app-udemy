import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Alert,
  Avatar,
} from '@mui/material';
import { PersonOutline, LoginOutlined, PersonAddOutlined, LogoutOutlined, CheckCircleOutline } from '@mui/icons-material';
import Login from '../../sign-in-form/sign-in-form.component';
import Register from '../../sign-up-form/sign-up-form.component';
import GuestCheckout from '../../guest-checkout/guest-checkout.component';
import { UserContext } from '../../../contexts/user.context';
import {FaUserLock, FaUserPlus, FaUserTie} from "react-icons/fa";
import {useTheme} from "@mui/material/styles";

const AuthStep = ({ onAuthComplete }) => {
  const [authMode, setAuthMode] = useState(null);
  const { currentUser, currentUserGuest, logout, resetGuestUser } = useContext(UserContext);

  const theme = useTheme();

  const handleAuthSuccess = () => {
    if (onAuthComplete) {
      onAuthComplete();
    }
  };

  const handleLogout = () => {
    logout();
    setAuthMode(null);
  };

  const handleGuestLogout = () => {
    resetGuestUser();
    setAuthMode(null);
  };

  // Si un utilisateur est connecté ou un invité est défini
  if (currentUser || currentUserGuest) {
    const isGuest = !!currentUserGuest;
    const user = currentUser || currentUserGuest;

    // Gérer les différents formats de nom possibles
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const userName = firstName && lastName
      ? `${firstName} ${lastName}`
      : user.name || user.email?.split('@')[0] || 'Utilisateur';

    // Pour l'avatar
    const avatarLetters = firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : userName[0]?.toUpperCase() || 'U';

    return (
      <Box>
        <Alert
          severity="success"
          icon={<CheckCircleOutline fontSize="large" />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            {isGuest ? 'Commande en tant qu\'invité' : 'Connecté avec succès'}
          </Typography>
          <Typography variant="body1">
            Vous êtes connecté en tant que <strong>{userName}</strong>
          </Typography>
          {user.email && (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Alert>

        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 16px',
              bgcolor: isGuest ? 'secondary.main' : 'primary.main',
              fontSize: '2rem'
            }}
          >
            {avatarLetters}
          </Avatar>

          <Typography variant="h5" gutterBottom>
            {userName}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {user.email}
          </Typography>

          {user.phone && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.phone}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutOutlined />}
            onClick={isGuest ? handleGuestLogout : handleLogout}
            fullWidth
          >
            {isGuest ? 'Changer de mode' : 'Se déconnecter'}
          </Button>

          {isGuest && (
            <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
              En tant qu'invité, vous ne pourrez pas suivre votre commande après validation
            </Typography>
          )}
        </Card>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleAuthSuccess}
          >
            {/*Continuer vers la livraison*/}
            Continuer vers la l'étape suivante
          </Button>
        </Box>
      </Box>
    );
  }

  // Si aucun utilisateur n'est connecté, afficher les options d'authentification
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comment souhaitez-vous continuer ?
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border: authMode === 'login' ? '2px solid' : '2px solid',
              borderColor: authMode === 'login' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'grey.300', boxShadow: 3 }
            }}
            onClick={() => setAuthMode('login')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              {/*<LoginOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />*/}
              <FaUserLock size={35} style={{ marginBottom: '12px' }} color={theme.palette.primary.main} />
              <Typography variant="h6">Se connecter</Typography>
              <Typography variant="body2" color="text.secondary">
                J'ai déjà un compte
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border: authMode === 'register' ? '2px solid' : '2px solid',
              borderColor: authMode === 'register' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'grey.300', boxShadow: 3 }
            }}
            onClick={() => setAuthMode('register')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              {/*<PersonAddOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />*/}
              <FaUserPlus size={35} style={{ marginBottom: '12px' }} color={theme.palette.primary.main} />
              <Typography variant="h6">Créer un compte</Typography>
              <Typography variant="body2" color="text.secondary">
                Nouveau client
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border: authMode === 'guest' ? '2px solid' : '2px solid',
              borderColor: authMode === 'guest' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'grey.300', boxShadow: 3 }
            }}
            onClick={() => setAuthMode('guest')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              {/*<PersonOutline sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />*/}
              <FaUserTie size={35} style={{ marginBottom: '12px' }} color={theme.palette.primary.main} />
              <Typography variant="h6">Commande invité</Typography>
              <Typography variant="body2" color="text.secondary">
                Sans créer de compte
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {authMode === 'login' && (
        <Login
          mode="stepper"
          onSuccess={handleAuthSuccess}
        />
      )}

      {authMode === 'register' && (
        <Register
          mode="stepper"
          onSuccess={handleAuthSuccess}
        />
      )}

      {authMode === 'guest' && (
        <GuestCheckout
          isInline={true}
          onSuccess={handleAuthSuccess}
        />
      )}
    </Box>
  );
};

export default AuthStep;
