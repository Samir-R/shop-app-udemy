import React from 'react';
import { TextField, Grid } from '@mui/material';
import { z } from 'zod';

// Schéma Zod pour la validation des mots de passe
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),

  passwordConfirm: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
});

// Fonction de validation des mots de passe
export const validatePasswords = (password, passwordConfirm) => {
  const validation = passwordSchema.safeParse({ password, passwordConfirm });

  if (!validation.success) {
    const errors = {};
    validation.error.issues.forEach((err) => {
      const path = err.path[0];
      errors[path] = err.message;
    });
    return errors;
  }

  return {};
};

/**
 * Composant réutilisable pour les champs password et passwordConfirm
 * avec validation Zod intégrée
 */
const PasswordFields = ({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  errors = {},
  disabled = false,
  showHelper = true,
  passwordLabel = 'Mot de passe',
  passwordConfirmLabel = 'Confirmer le mot de passe',
  useGrid = true,
}) => {
  const passwordField = (
    <TextField
      required
      fullWidth
      name="password"
      label={passwordLabel}
      type="password"
      id="password"
      autoComplete="new-password"
      value={password}
      onChange={onPasswordChange}
      error={!!errors.password}
      helperText={
        errors.password ||
        (showHelper ? 'Minimum 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial' : '')
      }
      disabled={disabled}
      margin={useGrid ? undefined : 'normal'}
    />
  );

  const passwordConfirmField = (
    <TextField
      required
      fullWidth
      name="passwordConfirm"
      label={passwordConfirmLabel}
      type="password"
      id="passwordConfirm"
      autoComplete="new-password"
      value={passwordConfirm}
      onChange={onPasswordConfirmChange}
      error={!!errors.passwordConfirm}
      helperText={errors.passwordConfirm}
      disabled={disabled}
      margin={useGrid ? undefined : 'normal'}
    />
  );

  // Si useGrid est true, on wrap dans des Grid items
  if (useGrid) {
    return (
      <>
        <Grid item xs={12}>
          {passwordField}
        </Grid>
        <Grid item xs={12}>
          {passwordConfirmField}
        </Grid>
      </>
    );
  }

  // Sinon, on retourne juste les champs
  return (
    <>
      {passwordField}
      {passwordConfirmField}
    </>
  );
};

export default PasswordFields;
