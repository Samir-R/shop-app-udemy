import { useState } from 'react';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth, signInAuthWithEmailAndPassword } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import FormInput from '../form-input/form-input.component';

import './sign-in-form.styles.scss';

const defaultFormFields = {
    email: '',
    password: '',
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const handleChange = e => {
        console.log(e);
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("on submit");
        try {
            const response = await signInAuthWithEmailAndPassword(email, password);
            console.log(response);
            if (response) {
                // const userDocRef = await createUserDocumentFromAuth({...response.user, displayName });
                // setFormFields(defaultFormFields);
                alert("vous etes connecté");
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("email already used");
            } else {

                console.log(error.message);
            }
            alert("vous etes PAS connecté");
        }
    }
  return (
    <div className='sign-up-container'>
        <h2>I halready have an account</h2>
        <span>Sign in with your email and password</span>
        <form onSubmit={handleSubmit}>
            <FormInput label="Email" type="email" required onChange={handleChange} value={email} name="email" />
            
            <FormInput label="Password" type="password" required onChange={handleChange} value={password} name="password" />
            
            <Button type="submit">Sign In</Button>
        </form>
    </div>
  )
}

export default SignInForm;