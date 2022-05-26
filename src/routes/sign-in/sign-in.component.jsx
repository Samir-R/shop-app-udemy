import React from 'react'
import { signInWithGooglePopup } from '../../utils/firebase/firebase.utils'

const SignIn = () => {
    const logGoogleUser = async() => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }
  return (
    <div>
        <h1>SignIn page</h1>
        <button onClick={logGoogleUser}>
            Sign in with Google Popup
        </button>
    </div>
  )
}

export default SignIn;