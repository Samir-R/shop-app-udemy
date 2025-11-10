import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  LocalOffer as LocalOfferIcon,
  Stars as StarsIcon,
  CardGiftcard as CardGiftcardIcon,
  ContentCopy as ContentCopyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import {promoCodes, user} from "./fakeData";
// import { useUser } from '../context/UserContext';

export default function Rewards() {
  const navigate = useNavigate();
  // const { user, promoCodes } = useUser();

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const nextRewardPoints = 1000;
  const progressPercentage = (user.loyaltyPoints / nextRewardPoints) * 100;

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/my-account')}
        sx={{ mb: 3, color: '#1976d2' }}
      >
        Retour au tableau de bord
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Mes avantages
      </Typography>

      {/* Points de fidélité */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <StarsIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user.loyaltyPoints} points de fidélité
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Il vous reste {nextRewardPoints - user.loyaltyPoints} points pour débloquer votre prochaine récompense !
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {Math.round(progressPercentage)}% vers la prochaine récompense
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Comment gagner des points */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            <CardGiftcardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Comment gagner des points
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  10
                </Typography>
                <Typography variant="body2">
                  points par € dépensé
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  50
                </Typography>
                <Typography variant="body2">
                  points pour un avis
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  100
                </Typography>
                <Typography variant="body2">
                  points à l'anniversaire
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Codes promo */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Codes promo disponibles
      </Typography>

      <Grid container spacing={2}>
        {promoCodes.map((promo) => (
          <Grid item xs={12} md={6} key={promo.id}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'visible',
                opacity: promo.isUsed ? 0.6 : 1,
                border: promo.isUsed ? '1px solid #e0e0e0' : '2px dashed #ff9800'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: promo.isUsed ? '#e0e0e0' : '#ff9800',
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    <LocalOfferIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {promo.discount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {promo.description}
                    </Typography>
                  </Box>
                  {promo.isUsed && (
                    <Chip
                      label="Utilisé"
                      size="small"
                      sx={{ bgcolor: '#e0e0e0' }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {promo.code}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyToClipboard(promo.code)}
                    disabled={promo.isUsed}
                  >
                    Copier
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Valide jusqu'au {new Date(promo.validUntil).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {promoCodes.filter(p => !p.isUsed).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Aucun code promo disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Revenez bientôt pour découvrir de nouvelles offres !
          </Typography>
        </Box>
      )}
    </Box>
  );
}