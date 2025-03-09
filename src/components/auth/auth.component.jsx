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



const Auth = () => {
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

  return (
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
};

export default Auth;