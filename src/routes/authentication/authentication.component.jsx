import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import { UserContext } from '../../contexts/user.context';
import { AuthenticationContainer } from './authentication.styles';

const Authentication = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Inclut smartphones et tablettes

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, le rediriger vers son compte
    if (currentUser) {
      navigate('/my-account');
    }
  }, [currentUser, navigate]);

  // Si l'utilisateur est connecté, ne rien afficher (la redirection est en cours)
  if (currentUser) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSwitchToSignUp = () => {
    setActiveTab(1);
  };

  const handleSwitchToSignIn = () => {
    setActiveTab(0);
  };

  return (
    <>
      {isMobile ? (
        // Version mobile : Système d'onglets
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            pt: '70px', // Padding-top pour éviter que le header cache les onglets
            pb: '80px', // Padding-bottom pour le CartFooter
            px: 0, // Pas de padding horizontal pour prendre toute la largeur
            width: '100%', // Prend toute la largeur du viewport
          }}
        >
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 150px)', // Hauteur optimisée
              width: '100%', // Prend toute la largeur disponible
              maxWidth: '100%', // Force à ne pas dépasser
              borderRadius: 0, // Pas de bordures arrondies pour aller edge-to-edge
              boxShadow: 'none', // Pas d'ombre
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                flexShrink: 0, // Empêche les onglets de se rétracter
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  py: 2,
                  minHeight: '48px',
                  whiteSpace: 'nowrap', // Empêche le retour à la ligne
                },
              }}
            >
              <Tab label="Connexion" />
              <Tab label="Créer compte" />
            </Tabs>

            {/* Contenu des onglets - scroll si nécessaire */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              pb: 3, // Padding-bottom supplémentaire pour éviter que le contenu soit caché
            }}>
              {activeTab === 0 && (
                <SignInForm
                  mode="auth"
                  hideTitle={true}
                  onSwitchToSignUp={handleSwitchToSignUp}
                />
              )}
              {activeTab === 1 && (
                <SignUpForm
                  mode="auth"
                  hideTitle={true}
                  onSwitchToSignIn={handleSwitchToSignIn}
                />
              )}
            </Box>
          </Paper>
        </Box>
      ) : (
        // Version desktop : Layout d'origine
        <AuthenticationContainer>
          <SignInForm mode="auth" />
          <SignUpForm mode="auth" />
        </AuthenticationContainer>
      )}
    </>
  );
};

export default Authentication;
