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
  Snackbar,
  CircularProgress,
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
import {useCheckout} from "../../contexts/checkout.context";
import {ShopShippingContext} from "../../contexts/shop-shipping.context";
import {CartContext} from "../../contexts/cart.context";
import {ProductContext} from "../../contexts/product.context";
import services from "../../services";
import {buildOrderBody} from "../../utils/order/buildOrderBody";
import Order from "../../entities/order.entity";
import CartErrorsModal from "./CartErrorsModal";
import StripePaymentStep from "./steps/StripePaymentStep";

const steps = ['Authentification', 'Restaurant & Livraison', 'Résumé & Paiement', 'Paiement sécurisé'];

const checkoutSchema = z.object({
  authMode: z.enum(['login', 'register', 'guest']),
  paymentMode: z.enum(['card', 'store']),
});

const CheckoutStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorInStep, setErrorInStep] = useState('')
  const gridStepperRef = useRef(null);
  const { currentUser, currentUserGuest, refreshUser } = useContext(UserContext);
  const { currentAddress } = useContext(AddressContext);
  const { updateFormData, clearFormData, formData } = useCheckout();
  const { isSelectionValid, deliveryMethod, shop, deliveryDate, deliveryHour, nextDay, asap, validateAndResetIfNeeded } = useContext(ShopShippingContext);
  const {
    cartItems,
    cartTotalWithoutPromotions,
    shippingFees,
    promotionsApplied,
    removePromotion,
    removeCartItemsByProductId,
    setCartItemQuantity,
    clearCart,
  } = useContext(CartContext);
  const { refreshProducts } = useContext(ProductContext);

  const [cartErrorModalOpen, setCartErrorModalOpen] = useState(false);
  const [cartErrors, setCartErrors] = useState([]);
  const [stripeData, setStripeData] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  // stripeData = { clientSecret, stripeAccountId, orderId }

  const [gridTopPosition, setGridTopPosition] = useState(0);

  useEffect(() => {
    if (gridStepperRef.current) {
      setGridTopPosition(gridStepperRef.current.offsetTop);
    }
    validateAndResetIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      authMode: 'login',
      paymentMode: 'card',
    },
  });

  const { handleSubmit, trigger, watch, reset, formState: { errors } } = methods;

  const watchedValues = watch();

  // Charger les données sauvegardées depuis CheckoutContext au montage
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      reset({
        authMode: 'login',
        deliveryMode: 'delivery',
        paymentMode: 'card',
        ...formData,
      });
    }
    // Ne se déclencher qu'au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateStep = async (step) => {
    let fieldsToValidate = [];

    console.log('on validateStep step = '+step)
    switch (step) {
      case 0:
        if (currentUserGuest) return true;
        if (currentUser) {
          const result = await refreshUser();
          return result.success;
        }
        return false;
      case 1:
        // Validation via ShopShippingContext (magasin + mode + date/heure ou asap)
        if (!isSelectionValid) return false;
        return !(deliveryMethod === 'delivery' && !currentAddress);

      case 2:
        fieldsToValidate = ['paymentMode'];
        break;
    }

    return await trigger(fieldsToValidate);
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      handleResetErrorInStep();
      updateFormData(watchedValues);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      handleSetErrorInStep();
    }
  };

  const handleSetErrorInStep = () => {
      let errorInStepMessage = 'Veuillez corriger les erreurs avant de continuer.';
      switch (activeStep) {
        case 0:
          errorInStepMessage = 'Veuillez vous identifier';
          break;
        case 1:
          errorInStepMessage = 'Veuillez tout saisir avant de continuer.';
          break;
        case 2:
          errorInStepMessage = 'Veuillez completer le moyen de paiement pour confirmer.';
          break;
      }
      setErrorInStep(errorInStepMessage);
  };

  const handleBack = () => {
    handleResetErrorInStep();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResetErrorInStep = () => {
    setErrorInStep('');
  };

  const handleCartErrors = (errors) => {
    // 1. Enrichir avec les noms AVANT de modifier le panier
    const enriched = errors
      .filter((e) => e.code !== 'TOTAL_MISMATCH')
      .map((error) => {
        if (error.code === 'INVALID_PROMO') {
          const promo = promotionsApplied.find((p) => p.id === error.id);
          return { ...error, promoTitle: promo?.title ?? null };
        }
        const cartItem = cartItems.find((item) => item.id === error.id);
        return { ...error, productName: cartItem?.name ?? null };
      });

    // 2. Appliquer les corrections au panier
    const removedProductIds = new Set();
    const stockAdjustments = [];
    const invalidPromoIds = [];

    for (const error of errors) {
      switch (error.code) {
        case 'PRODUCT_NOT_FOUND':
        case 'PRODUCT_UNAVAILABLE':
        case 'PRICE_MISMATCH':
        case 'INVALID_OPTION':
          removedProductIds.add(error.id);
          break;
        case 'OUT_OF_STOCK':
          if (error.available === 0) {
            removedProductIds.add(error.id);
          } else {
            stockAdjustments.push({ productId: error.id, newQty: error.available });
          }
          break;
        case 'INVALID_PROMO':
          invalidPromoIds.push(error.id);
          break;
        default:
          break;
      }
    }

    for (const productId of removedProductIds) {
      removeCartItemsByProductId(productId);
    }
    for (const { productId, newQty } of stockAdjustments) {
      setCartItemQuantity(productId, newQty);
    }
    for (const promoId of invalidPromoIds) {
      removePromotion(promoId);
    }

    // 3. Rafraîchir le catalogue produits
    refreshProducts();

    // 4. Ouvrir la modale récapitulative
    setCartErrors(enriched);
    setCartErrorModalOpen(true);
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      const email = currentUserGuest?.email ?? null;
      const fetchedOrder = await services.orderService.getOrder(orderId, email);
      setCompletedOrder(fetchedOrder);
    } catch {
      setCompletedOrder(null);
    }
    setOrderCompleted(true);
  };

  const onSubmit = async (data) => {
    const isValid = await validateStep(activeStep);
    if (!isValid) {
      handleSetErrorInStep();
      return;
    }

    handleResetErrorInStep();
    updateFormData(watchedValues);

    const paymentMethod = data.paymentMode === 'card' ? 'ONLINE' : 'CASH';

    try {
      const body = buildOrderBody({
        cartItems,
        cartTotalWithoutPromotions,
        shippingFees,
        promotionsApplied,
        deliveryMethod,
        shop,
        deliveryDate,
        deliveryHour,
        nextDay,
        asap,
        currentAddress,
        currentUser,
        currentUserGuest,
        paymentMethod,
      });

      const result = await services.orderService.createOrder(body);
      const order = result.order;

      clearCart();
      clearFormData();

      if (paymentMethod !== 'ONLINE') {
        setCompletedOrder(new Order(order));
        setOrderCompleted(true);
        return;
      }

      setIsProcessingOrder(true);

      if (currentUserGuest?.email) {
        sessionStorage.setItem('guestEmail', currentUserGuest.email);
      }

      // Paiement en ligne → créer le PaymentIntent Stripe
      const piResult = await services.orderService.createPaymentIntent(
        order.id,
          currentUser?.email ?? currentUserGuest?.email ?? null
      );

      setStripeData({
        clientSecret: piResult.clientSecret,
        stripeAccountId: piResult.stripeAccountId,
        orderId: order.id,
        orderTotal: order.total,
      });
      setActiveStep(3);
      setIsProcessingOrder(false);

    } catch (error) {
      setIsProcessingOrder(false);
      if (Array.isArray(error.errors)) {
        handleCartErrors(error.errors);
      } else if (error.errors && typeof error.errors === 'object') {
        const messages = Object.values(error.errors).join(' ');
        setErrorInStep(messages || 'Erreur de validation. Veuillez vérifier votre commande.');
      } else {
        setErrorInStep('Une erreur est survenue lors de la soumission de la commande. Veuillez réessayer.');
      }
    }
  };

  const handleAuthComplete = async () => {
    if (currentUser) {
      const result = await refreshUser();
      if (!result.success) return;
    }
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
      case 3:
        return (
          <StripePaymentStep
            clientSecret={stripeData.clientSecret}
            stripeAccountId={stripeData.stripeAccountId}
            orderId={stripeData.orderId}
            orderTotal={stripeData.orderTotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      default:
        return null;
    }
  };

  if (orderCompleted) {
    return <OrderConfirmation orderData={completedOrder} />;
  }

  return (
    <>
    <CartErrorsModal
      open={cartErrorModalOpen}
      onClose={() => setCartErrorModalOpen(false)}
      errors={cartErrors}
    />
    <Card sx={{ width: '100%', pt: 8, boxShadow: 'none', position: 'relative' }}>
      {isProcessingOrder && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: 'inherit',
          }}
        >
          <CircularProgress size={52} thickness={4} />
          <Typography variant="body1" fontWeight={600} color="text.primary">
            Préparation du paiement…
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Merci de patienter, nous sécurisons votre commande.
          </Typography>
        </Box>
      )}
      <CardContent sx={{ p: { xs: 1, sm: 4 } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finaliser votre commande
        </Typography>
        {/*{ currentUser ? 'IS LOGGED' : 'NOT LOGGED'}*/}
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
              sm={12} md={activeStep === 3 ? 12 : 8}
              ref={gridStepperRef}
              sx={{ pb: activeStep === 3 ? 0 : { xs: '151px', sm: '80px' } }}
          >
            <Stepper activeStep={Math.min(activeStep, 2)} sx={{ mb: 4 }}>
              {steps.slice(0, 3).map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        display: { xs: 'none', sm: 'block' },
                      },
                    }}
                  >{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep < 3 && (
              <Typography
                variant="body2"
                sx={{ display: { xs: 'block', sm: 'none' }, mb: 2, color: 'text.secondary', textAlign: 'center', fontWeight: '500' }}
              >
                Étape {activeStep + 1} / 3 — {steps[activeStep]}
              </Typography>
            )}

            <FormProvider {...methods}>
              {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
              <form>
                {renderStepContent(activeStep)}

                {Object.keys(errors).length > 0 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorInStep || 'Veuillez corriger les erreurs avant de continuer.'}
                  </Alert>
                )}
                {/*{errorInStep.length > 0 && (*/}
                {/*  <Alert severity="error" sx={{ mt: 2 }}>*/}
                {/*    {errorInStep}*/}
                {/*  </Alert>*/}
                {/*)}*/}
                {/*<Snackbar*/}
                {/*    open={errorInStep.length > 0}*/}
                {/*    onClose={handleResetErrorInStep}*/}
                {/*    message={errorInStep}*/}
                {/*    autoHideDuration={1500}*/}
                {/*/>*/}
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
                    open={errorInStep.length > 0}
                    autoHideDuration={2000}
                    onClose={handleResetErrorInStep}>
                  <Alert
                      onClose={handleResetErrorInStep}
                      severity="error"
                      sx={{ width: '100%' }}
                  >
                    {errorInStep}
                  </Alert>
                </Snackbar>

                {/*<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>*/}
                {activeStep < 3 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'fixed',
                      bottom: { xs: '76px', sm: 0 },
                      left: 0,
                      right: 0,
                      width: '100%',
                      height: '75px',
                      padding: 2,
                      backgroundColor: 'white',
                      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                      zIndex: 1000
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                    >
                      Retour
                    </Button>

                    {activeStep === 2 ? (
                      <Button
                        onClick={() => handleSubmit(onSubmit)()}
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
                )}
              </form>
            </FormProvider>
          </Grid>
          <Grid
              xs={0} sm={0} md={4}
              sx={{
                display: activeStep === 3 ? 'none' : { xs: 'none', md: 'block' },
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
    </>
  );
};

export default CheckoutStepper;