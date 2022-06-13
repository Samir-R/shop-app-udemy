import { useState } from 'react';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import FormInput from '../form-input/form-input.component';

import './sign-up-form.styles.scss';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

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
        if (password !== confirmPassword) {
            alert("les mot de passe doivent etre egaux");
            return;
        }
        try {
            const response = await createAuthUserWithEmailAndPassword(email, password);
            console.log(response);
            if (response) {
                const userDocRef = await createUserDocumentFromAuth({...response.user, displayName });
                setFormFields(defaultFormFields);
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("email already used");
            } else {

                console.log(error.message);
            }
        }
    }
  return (
    <div className='sign-up-container'>
        <h2>Don't have an account?</h2>
        <span>Sign up with your email and password</span>
        <form onSubmit={handleSubmit}>
            <FormInput label="Display Name" type="text" required onChange={handleChange} value={displayName} name="displayName" />
            
            <FormInput label="Email" type="email" required onChange={handleChange} value={email} name="email" />
            
            <FormInput label="Password" type="password" required onChange={handleChange} value={password} name="password" />
            
            <FormInput label="Confirm Password" type="password" required onChange={handleChange} value={confirmPassword} name="confirmPassword" />

            <Button type="submit">Sign Up</Button>
        </form>
    </div>
  )
}

export default SignUpForm;