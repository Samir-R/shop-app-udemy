import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { PersonOutline, LoginOutlined, PersonAddOutlined } from '@mui/icons-material';
import {useFormContext, Controller, useForm, FormProvider} from 'react-hook-form';
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const authSchema = z.object({
    authMode: z.enum(['login', 'register', 'guest']),
    email: z.email('Email invalide'),
    password: z.string().min(8, 'Mot de passe requis').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    guestName: z.string().optional(),
}).superRefine(({ authMode, email, password, firstName, lastName, guestName}, refinementContext) => {
    // Validation conditionnelle selon le mode d'authentification
    if (authMode === 'register') {
        console.log("authMode === 'register'");
        console.log(lastName);
        if (firstName?.length === 0) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'un gros pb 222 !!!',
                path: ['firstName'],
            });
        }
        if (lastName?.length === 0) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'un gros pb 555 !!!',
                path: ['lastName'],
            });
        }
        if (password?.length === 0) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'un gros pb 444 !!!',
                path: ['password'],
            });
        }
    }
    if (authMode === 'login') {
        if (password?.length === 0) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'un gros pb 000 !!!',
                path: ['password'],
            });
        }
    }
    if (authMode === 'guest') {
        if (guestName?.length === 0) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'un gros pb 345 !!!',
                path: ['guestName'],
            });
        }
    }
});
const AuthStep = () => {
  // const { control, watch, setValue, formState: { errors } } = useFormContext();
    const methods = useForm({
        resolver: zodResolver(authSchema),
        mode: 'onChange',
        defaultValues: {
            authMode: 'login',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            guestName: '',
        },
    });
    const { register, setValue, control, handleSubmit, watch, formState: { errors, touchedFields } } = methods;
    const authMode = watch('authMode');

  const setAuthMode = (mode) => {
    setValue('authMode', mode);
    // Reset optional fields when switching modes
    if (mode !== 'register') {
      setValue('firstName', '');
      setValue('lastName', '');
    }
    if (mode !== 'guest') {
      setValue('guestName', '');
    }
    if (mode === 'guest') {
      setValue('password', '');
    }
  };

    const onSubmit = (data) => {
        console.log('submit auth form'); // call api with submitted data
        console.log(data); // call api with submitted data
    };

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
              border: authMode === 'login' ? '2px solid' : '1px solid',
              borderColor: authMode === 'login' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'primary.light' }
            }}
            onClick={() => setAuthMode('login')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <LoginOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
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
              border: authMode === 'register' ? '2px solid' : '1px solid',
              borderColor: authMode === 'register' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'primary.light' }
            }}
            onClick={() => setAuthMode('register')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <PersonAddOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
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
              border: authMode === 'guest' ? '2px solid' : '1px solid',
              borderColor: authMode === 'guest' ? 'primary.main' : 'grey.300',
              '&:hover': { borderColor: 'primary.light' }
            }}
            onClick={() => setAuthMode('guest')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <PersonOutline sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Commande invité</Typography>
              <Typography variant="body2" color="text.secondary">
                Sans créer de compte
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
      {authMode === 'login' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Connexion
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Adresse email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mot de passe"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {authMode === 'register' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Créer un compte
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Prénom"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nom"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Adresse email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mot de passe"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {authMode === 'guest' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Commande sans compte
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="guestName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nom complet"
                    error={!!errors.guestName}
                    helperText={errors.guestName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Adresse email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AuthStep;