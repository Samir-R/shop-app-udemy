import React, { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import { SignUpContainer } from './sign-up-form.styles';
import {Card, CardContent, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {PersonAddOutlined} from "@mui/icons-material";

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already in use');
      } else {
        console.log('user creation encountered an error', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignUpContainer>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{boxShadow: 'none', borderBottom: '2px dashed #dfe6e9', borderRadius: 0 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <PersonAddOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Créer un compte</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nouveau client
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
        <TextField
            fullWidth
          label='Display Name'
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
        />

          </Grid>
          <Grid item xs={12}>
        <TextField
            fullWidth
          label='Email'
          type='email'
          required
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
        <TextField
            fullWidth
          label='Confirm Password'
          type='password'
          required
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
        />
          </Grid>
          <Grid item xs={12}>
        <Button type='submit'>Sign Up</Button>

          </Grid>
        </Grid>
      </form>
    </SignUpContainer>
  );
};

export default SignUpForm;
