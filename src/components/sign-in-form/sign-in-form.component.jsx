import React, { useState } from 'react';

import FormInput from '../form-input/form-input.component';
// import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';

import { SignInContainer, ButtonsContainer } from './sign-in-form.styles';
import {Card, CardContent, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {LoginOutlined} from "@mui/icons-material";

const defaultFormFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('handleSubmit');
      console.log(email);
      console.log(password);
      await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      console.log('user sign in failed', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignInContainer>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{boxShadow: 'none', borderBottom: '2px dashed #dfe6e9', borderRadius: 0 }} >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <LoginOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Se connecter</Typography>
                <Typography variant="body2" color="text.secondary">
                  J'ai déjà un compte
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
        <TextField
            fullWidth
            label="Adresse email"
            type="email"
            required={true}
            onChange={handleChange}
            name='email'
            value={email}
        />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Password'
              type='password'
              required
              onChange={handleChange}
              name='password'
              value={password}
            />
          </Grid>
          <Grid item xs={12}>
          <Button
              type="submit"
              variant="contained"
              size="large"
          >
            Se connecter
          </Button>
          {/*<Button*/}
          {/*  type='button'*/}
          {/*  onClick={signInWithGoogle}*/}
          {/*>*/}
          {/*  Sign In With Google*/}
          {/*</Button>*/}
          </Grid>
        </Grid>
      </form>
    </SignInContainer>
  );
};

export default SignInForm;
