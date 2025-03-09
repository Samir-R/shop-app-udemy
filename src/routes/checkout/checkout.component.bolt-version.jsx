import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {LuCreditCard, LuMapPin, LuShoppingBag, LuUser} from "react-icons/lu";
import RestaurantModal from "../../components/shop-modal/shop-modal.component";
import CartDrawer from "../../components/cart-drawer/cart-drawer.component";
// import { ShoppingBag, CreditCard, MapPin, User } from 'lucide-react';
// import CartDrawer from '../components/CartDrawer';
// import RestaurantModal from '../components/RestaurantModal';

const steps = [
  {
    label: 'Identification',
    icon: <LuUser size={20} />,
  },
  {
    label: 'Restaurant & Livraison',
    icon: <LuMapPin size={20} />,
  },
  {
    label: 'Paiement',
    icon: <LuCreditCard size={20} />,
  }
];

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeStep, setActiveStep] = useState(0);
  const [authMethod, setAuthMethod] = useState('guest');
  const [cartOpen, setCartOpen] = useState(false);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setRestaurantModalOpen(true);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRestaurantModalOpen(false);
  };

  const renderAuthContent = () => (
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                fullWidth
                variant={authMethod === 'guest' ? 'contained' : 'outlined'}
                onClick={() => setAuthMethod('guest')}
                sx={{ py: 2 }}
            >
              Commander sans compte
            </Button>
            <Button
                fullWidth
                variant={authMethod === 'auth' ? 'contained' : 'outlined'}
                onClick={() => setAuthMethod('auth')}
                sx={{ py: 2 }}
            >
              Se connecter
            </Button>
          </Box>
        </Box>

        {authMethod === 'guest' ? (
            <>
              <TextField
                  fullWidth
                  label="Nom"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
            </>
        ) : (
            <>
              <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
              <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mb: 2, cursor: 'pointer', textAlign: 'right' }}
              >
                Créer un compte
              </Typography>
            </>
        )}
      </Box>
  );

  const renderDeliveryContent = () => (
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        {selectedRestaurant ? (
            <Box sx={{ mb: 4 }}>
              <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'primary.light',
                    color: 'primary.main'
                  }}
              >
                <Box
                    component="img"
                    src={selectedRestaurant.image}
                    sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedRestaurant.name}
                  </Typography>
                  <Typography variant="body2">
                    {selectedRestaurant.selectedDate} à {selectedRestaurant.selectedTime}
                  </Typography>
                </Box>
              </Paper>
            </Box>
        ) : (
            <Button
                fullWidth
                variant="outlined"
                onClick={() => setRestaurantModalOpen(true)}
                sx={{ mb: 4, py: 2 }}
            >
              Choisir un restaurant
            </Button>
        )}

        {selectedRestaurant?.deliveryType === 'delivery' && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Adresse de livraison
              </Typography>
              <TextField
                  fullWidth
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  label="Code postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
              <TextField
                  fullWidth
                  label="Ville"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
              />
            </>
        )}
      </Box>
  );

  const renderPaymentContent = () => (
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          Formulaire de paiement à implémenter
        </Typography>
      </Box>
  );

  const renderMobileCart = () => (
      <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
          }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total: 25.45 €</Typography>
          <Typography variant="body2" color="text.secondary">3 articles</Typography>
        </Box>
        <Button
            variant="contained"
            startIcon={<LuShoppingBag />}
            onClick={() => setCartOpen(true)}
        >
          Voir le panier
        </Button>
      </Box>
  );

  return (
      <Container maxWidth="lg" sx={{ py: 4, mb: isMobile ? 8 : 0 }}>
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Finaliser la commande
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                        StepIconComponent={() => (
                            <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: index === activeStep ? 'primary.main' : 'action.hover',
                                  color: index === activeStep ? 'primary.contrastText' : 'text.secondary',
                                }}
                            >
                              {step.icon}
                            </Box>
                        )}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ py: 3 }}>
                        {index === 0 && renderAuthContent()}
                        {index === 1 && renderDeliveryContent()}
                        {index === 2 && renderPaymentContent()}

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                          <Button
                              variant="outlined"
                              disabled={index === 0}
                              onClick={handleBack}
                          >
                            Retour
                          </Button>
                          <Button
                              variant="contained"
                              onClick={handleNext}
                              disabled={
                                  (index === 0 && (!formData.email || (authMethod === 'guest' && !formData.name))) ||
                                  (index === 1 && !selectedRestaurant)
                              }
                          >
                            {index === steps.length - 1 ? 'Finaliser la commande' : 'Continuer'}
                          </Button>
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
              ))}
            </Stepper>
          </Box>

          {!isMobile && (
              <Box sx={{ width: 380, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LuShoppingBag size={20} />
                    <Typography variant="h6">Votre commande</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {/* Cart items will be added here */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      3 articles
                    </Typography>
                    <Typography variant="h6">
                      Total: 25.45 €
                    </Typography>
                  </Box>
                </Paper>
              </Box>
          )}
        </Box>

        {isMobile && renderMobileCart()}

        <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={[]} // Add your cart items here
            onRemoveItem={() => {}}
            onUpdateQuantity={() => {}}
            onCheckout={() => {}}
        />

        <RestaurantModal
            open={restaurantModalOpen}
            onClose={() => setRestaurantModalOpen(false)}
            onSelectRestaurant={handleRestaurantSelect}
        />
      </Container>
  );
};

export default Checkout;