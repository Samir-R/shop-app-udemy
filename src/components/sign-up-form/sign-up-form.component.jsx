// src/components/auth/Register.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { UserContext } from "../../contexts/user.context";
import { registerSchema, editUserSchema } from './validation';
import PasswordFields from './password-fields.component';

/**
 * Mode peut être: 'register' | 'stepper' | 'edit'
 * - register: formulaire standalone pour créer un compte
 * - stepper: utilisé dans le checkout stepper
 * - edit: utilisé dans PersonalInfo pour modifier les infos user (sans password)
 */
const Register = ({ mode = 'register', onSuccess, initialData = null, hideTitle = false, onSwitchToSignIn }) => {
  const navigate = useNavigate();
  const { register, login, updateUser } = useContext(UserContext);

  const isEditMode = mode === 'edit';
  const isStepperMode = mode === 'stepper';
  const isAuthMode = mode === 'auth';

  const { id:customerId, ...initialFormData } = initialData || {};;
  const [formData, setFormData] = useState(initialFormData || {
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    phone: '',
    newsletterSubscribed: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Choisir le schéma de validation selon le mode
    const validationSchema = isEditMode ? editUserSchema : registerSchema;
    const validation = validationSchema.safeParse(formData);

    if (!validation.success) {
      // Convertir les erreurs Zod en format objet
      const zodErrors = {};
      console.log(validation.error);

      if (validation.error?.issues) {
        validation.error.issues.forEach((err) => {
          const path = err.path[0];
          zodErrors[path] = err.message;
        });
      }

      setErrors(zodErrors);
      return;
    }

    setIsLoading(true);

    // En mode edit, mettre à jour les informations utilisateur
    if (isEditMode) {
      const result = await updateUser(customerId, formData);
      console.log('🔍 Résultat updateUser dans Register:', result);

      if (result.success) {
        setSuccessMessage(result.message);

        // Appeler onSuccess pour informer le parent
        if (onSuccess) {
          onSuccess(formData);
        }
      } else {
        console.log('❌ Erreur détectée - Setting errors:', { global: result.message, ...result.errors });
        setErrors(result.errors && Object.keys(result.errors).length > 0 ? result.errors : { global: result.message });
      }

      setIsLoading(false);
      return;
    }

    // Mode register ou stepper: créer un compte
    const result = await register(formData);

    if (result.success) {
      setSuccessMessage(result.message);

      // Si on est dans le stepper, connecter automatiquement l'utilisateur
      if (isStepperMode && onSuccess) {
        // Essayer de connecter automatiquement après l'inscription
        try {
          const loginResult = await login(formData.email, formData.password);
          if (loginResult.success) {
            onSuccess();
          } else {
            setErrors({ global: 'Inscription réussie mais connexion automatique échouée. Veuillez vous connecter manuellement.' });
          }
        } catch (loginErr) {
          setErrors({ global: 'Inscription réussie mais connexion automatique échouée. Veuillez vous connecter manuellement.' });
        }
      } else {
        setTimeout(() => {
          navigate('/verify-email-sent', { state: { email: formData.email } });
        }, 3000);
      }
    } else {
      console.log('❌ Erreur détectée - Setting errors:', { global: result.message, ...result.errors });
      setErrors(result.errors && Object.keys(result.errors).length > 0 ? result.errors : { global: result.message });
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
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="firstName"
          label="Prénom"
          name="firstName"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="lastName"
          label="Nom"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="phone"
          label="Téléphone"
          name="phone"
          autoComplete="tel"
          placeholder="0612345678"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          disabled={isLoading}
        />
      </Grid>

      {!isEditMode && (
        <PasswordFields
          password={formData.password}
          passwordConfirm={formData.passwordConfirm}
          onPasswordChange={handleChange}
          onPasswordConfirmChange={handleChange}
          errors={errors}
          disabled={isLoading}
          useGrid={true}
        />
      )}

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="newsletterSubscribed"
              checked={formData.newsletterSubscribed}
              onChange={handleChange}
              color="primary"
              disabled={isLoading}
            />
          }
          label="Je souhaite recevoir la newsletter"
        />
      </Grid>
    </Grid>
  );

  const submitButton = (
    <Button
      type={isStepperMode || isEditMode || isAuthMode ? 'button' : 'submit'}
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      disabled={isLoading}
      onClick={isStepperMode || isEditMode || isAuthMode ? handleSubmit : undefined}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        isEditMode ? 'Sauvegarder' : "S'inscrire"
      )}
    </Button>
  );

  // Rendu pour le stepper ou edit (mode inline)
  if (isStepperMode || isEditMode) {
    return (
      <Box>
        {!isEditMode && (
          <Typography variant="h6" gutterBottom>
            Créer un compte
          </Typography>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errors.global && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.global}
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
            Créer un compte
          </Typography>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errors.global && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.global}
          </Alert>
        )}

        {formFields}
        {submitButton}

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Vous avez déjà un compte ?{' '}
            {onSwitchToSignIn ? (
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToSignIn}
                sx={{ cursor: 'pointer' }}
              >
                Se connecter
              </Link>
            ) : (
              <Link component={RouterLink} to="/login" variant="body2">
                Se connecter
              </Link>
            )}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Rendu pour la page standalone
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
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Créer un compte
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
            )}

            {errors.global && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.global}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {formFields}
              {submitButton}

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Vous avez déjà un compte ?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default Register;