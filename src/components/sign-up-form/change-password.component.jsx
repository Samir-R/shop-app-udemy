import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { UserContext } from '../../contexts/user.context';
import PasswordFields, { validatePasswords } from './password-fields.component';

/**
 * Composant pour modifier le mot de passe
 * Contient 3 champs: currentPassword, password, passwordConfirm
 *
 * Mémorisé avec React.memo pour éviter les re-renders inutiles
 * quand le parent se re-render (ex: changement de isLoading dans le contexte)
 */
const ChangePassword = ({ onSuccess }) => {
  const { changePassword } = useContext(UserContext);
  const isMountedRef = useRef(true);

  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup pour éviter les mises à jour d'état sur un composant démonté
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMountedRef.current) return;

    setErrors({});
    setSuccessMessage('');
    setIsSubmitting(true);

    const newErrors = {};

    // Valider le mot de passe actuel
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    // Valider les nouveaux mots de passe avec Zod
    const passwordErrors = validatePasswords(formData.password, formData.passwordConfirm);
    Object.assign(newErrors, passwordErrors);

    if (Object.keys(newErrors).length > 0) {
      if (isMountedRef.current) {
        setErrors(newErrors);
        setIsSubmitting(false);
      }
      return;
    }

    // Pour l'instant, on utilise register (à remplacer par un endpoint updatePassword)
    // Le backend devra vérifier currentPassword et mettre à jour avec password
    const result = await changePassword(
      formData.currentPassword,
      formData.password,
      formData.passwordConfirm,
    );
    console.log('🔍 Résultat changePassword:', result);
    console.log('🔍 isMountedRef.current:', isMountedRef.current);

    // ⚠️ IMPORTANT: Vérifier le montage UNIQUEMENT pour éviter le memory leak
    // Ne pas bloquer l'affichage des erreurs normales
    if (!isMountedRef.current) {
      console.log('⚠️ Composant démonté, pas de mise à jour d\'état');
      return;
    }

    console.log('✅ Composant monté, mise à jour de l\'état...');

    if (result.success) {
      console.log('✅ Succès - affichage du message');
      setSuccessMessage('Mot de passe modifié avec succès');

      // Réinitialiser le formulaire
      setFormData({
        currentPassword: '',
        password: '',
        passwordConfirm: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } else {
      console.log('❌ Erreur - affichage du message:', result.message);
      console.log('❌ Erreurs détaillées:', result.errors);
      setErrors(result.errors || { global: result.message });
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Modifier le mot de passe
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Mot de passe actuel"
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={handleChange}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            disabled={isSubmitting}
          />

          <PasswordFields
            password={formData.password}
            passwordConfirm={formData.passwordConfirm}
            onPasswordChange={handleChange}
            onPasswordConfirmChange={handleChange}
            errors={errors}
            disabled={isSubmitting}
            passwordLabel="Nouveau mot de passe"
            useGrid={false}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Modifier le mot de passe'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Mémoriser le composant pour éviter les re-renders quand le parent se re-render
// Le composant ne sera re-render que si onSuccess change
export default React.memo(ChangePassword);
