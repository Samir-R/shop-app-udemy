import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthStep from './steps/AuthStep';
import RestaurantStep from './steps/RestaurantStep';
import OrderSummaryStep from './steps/OrderSummaryStep';
import OrderConfirmation from './OrderConfirmation';
import Grid from "@mui/material/Unstable_Grid2";
import Cart from "../cart/cart.component";
import CartFooterInfos from "../cart/cart-footer-infos.component";
import {UserContext} from "../../contexts/user.context";
import {AddressContext} from "../../contexts/address.context";

const steps = ['Authentification', 'Restaurant & Livraison', 'Résumé & Paiement'];

// Schema de validation global
const checkoutSchema = z.object({
  // Step 1: Auth
  authMode: z.enum(['login', 'register', 'guest']),
  email: z.email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  guestName: z.string().optional(),

  // Step 2: Restaurant
  restaurant: z.string().min(1, 'Veuillez sélectionner un restaurant'),
  deliveryMode: z.enum(['delivery', 'pickup']),
  deliveryDate: z.string().min(1, 'Date requise'),
  deliveryTime: z.string().min(1, 'Heure requise'),
  // L'adresse est gérée par AddressContext, pas par react-hook-form

  // Step 3: Payment
  paymentMode: z.enum(['card', 'store']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
}).refine((data) => {
  // Validation conditionnelle pour les champs de carte
  if (data.paymentMode === 'card') {
    return data.cardNumber &&
           data.cardNumber.length > 0 &&
           data.cardExpiry &&
           data.cardExpiry.length > 0 &&
           data.cardCvv &&
           data.cardCvv.length > 0 &&
           data.cardName &&
           data.cardName.length > 0;
  }
  return true;
}, {
  message: "Tous les champs de la carte sont requis pour le paiement par carte",
  path: ["cardNumber"],
}).refine((data) => {
  // Validation conditionnelle selon le mode d'authentification
  if (data.authMode === 'register') {
    console.log("data.authMode === 'register'");
    console.log(data.lastName);
    return data.firstName &&
           data.firstName.length > 0 &&
           data.lastName &&
           data.lastName.length > 0 &&
           data.password &&
           data.password.length > 0;
  }
  if (data.authMode === 'login') {
    return data.password && data.password.length > 0;
  }
  if (data.authMode === 'guest') {
    return data.guestName && data.guestName.length > 0;
  }
  return true;
}, {
  message: "Veuillez remplir tous les champs requis",
  path: ["email"],
});

const CheckoutStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const gridStepperRef = useRef(null);
  const { currentUser, currentUserGuest } = useContext(UserContext);
  const { currentAddress } = useContext(AddressContext);

  const [gridTopPosition, setGridTopPosition] = useState(0);

  useEffect(() => {
    if (gridStepperRef.current) {
      setGridTopPosition(gridStepperRef.current.offsetTop);
    }
  }, []);

  // Rediriger vers l'étape 0 si l'utilisateur se déconnecte pendant le checkout
  useEffect(() => {
    // Si on n'est pas à l'étape 0 et qu'il n'y a ni currentUser ni currentUserGuest
    if (activeStep > 0 && !currentUser && !currentUserGuest) {
      setActiveStep(0);
    }
  }, [currentUser, currentUserGuest, activeStep]);
  
  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      authMode: 'login',
      deliveryMode: 'delivery',
      paymentMode: 'card',
    },
  });

  const { handleSubmit, trigger, watch, formState: { errors } } = methods;

  const watchedValues = watch();

  const validateStep = async (step) => {
    let fieldsToValidate = [];

    switch (step) {
      case 0:
        // Pour l'étape d'authentification, on vérifie juste si un utilisateur est connecté
        // ou si un utilisateur invité est défini
        return !!(currentUser || currentUserGuest);
      case 1:
        fieldsToValidate = ['restaurant', 'deliveryMode', 'deliveryDate', 'deliveryTime'];
        // Vérifier qu'une adresse est sélectionnée si mode livraison
        if (watchedValues.deliveryMode === 'delivery' && !currentAddress) {
          return false;
        }
        break;
      case 2:
        fieldsToValidate = ['paymentMode'];
        if (watchedValues.paymentMode === 'card') {
          fieldsToValidate.push('cardNumber', 'cardExpiry', 'cardCvv', 'cardName');
        }
        break;
    }

    return await trigger(fieldsToValidate);
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    console.log('Order submitted:', data);
    // Ici, vous feriez l'appel API pour soumettre la commande
    setOrderCompleted(true);
  };

  const handleAuthComplete = () => {
    // L'authentification est complète, passer à l'étape suivante
    setActiveStep(1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <AuthStep onAuthComplete={handleAuthComplete} />;
      case 1:
        return <RestaurantStep />;
      case 2:
        return <OrderSummaryStep />;
      default:
        return <div>Unknown step</div>;
    }
  };

  if (orderCompleted) {
    return <OrderConfirmation orderData={watchedValues} />;
  }

  return (
    <Card sx={{ width: '100%', pt: 8, boxShadow: 'none'}}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finaliser votre commande
        </Typography>
        { currentUser ? 'IS LOGGED' : 'NOT LOGGED'}
        <Grid container spacing={2}>
          {/*xs={12} sm={7} md={8}*/}
        {/*  sx={{*/}
        {/*  display: 'flex',*/}
        {/*  flexDirection: 'column',*/}
        {/*  maxWidth: '100%',*/}
        {/*  width: '100%',*/}
        {/*  backgroundColor: { xs: 'transparent', sm: 'background.default' },*/}
        {/*  alignItems: 'end',*/}
        {/*  pt: { xs: 0, sm: 16 },*/}
        {/*  px: { xs: 2, sm: 10 },*/}
        {/*  gap: { xs: 4, md: 8 },*/}
        {/*}}*/}
          <Grid
              sm={12} md={8}
              ref={gridStepperRef}
              sx={{ pb: '80px' }}
          >
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {renderStepContent(activeStep)}

                {Object.keys(errors).length > 0 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Veuillez corriger les erreurs avant de continuer.
                  </Alert>
                )}

                {/*<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>*/}
                <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: '100%', // Ou width: '100vw'
                      height: '75px',
                      padding: 2, // Ajoutez un padding si nécessaire
                      backgroundColor: 'white', // Optionnel : fond pour masquer le contenu en dessous
                      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', // Optionnel : ombre pour l'effet "flottant"
                      zIndex: 1000 // Optionnel : s'assurer que la barre reste au-dessus
                    }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Retour
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                    >
                      Confirmer la commande
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      size="large"
                    >
                      Suivant
                    </Button>
                  )}
                </Box>
              </form>
            </FormProvider>
          </Grid>
          <Grid
              // size={{ xs: 12, sm: 5, lg: 4 }}
              xs={0} sm={5} md={4}
              sx={{
                position: { xs: 'static', md: 'fixed' }, // Static sur mobile, fixed sur desktop
                top: gridStepperRef.current?.offsetTop,
                right: 0,
                height: `calc(100vh - ${gridTopPosition + 75}px)`,
                // height: 'calc(100vh - 75px)', // 75px = hauteur estimée de votre Box avec les boutons
                bottom: '75px', // Hauteur de votre Box avec les boutons
                // width: { md: '300px' }, // Largeur fixe sur desktop
                // maxWidth: '300px',
                overflowY: 'auto',
                backgroundColor: 'white',
                boxShadow: { md: '-2px 0 10px rgba(0,0,0,0.1)' },
                zIndex: 999,
                padding: 0
              }}
          >
            {/*<SitemarkIcon />*/}
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  height: '100%',
                  // maxWidth: 500,
                }}
            >
              <Cart />
              <CartFooterInfos displayGoToCheckoutButton={false}/>
              {/*<Info totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />*/}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CheckoutStepper;