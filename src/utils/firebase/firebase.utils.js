// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJXMojLhgxbQfAG4XLJZC1hM1_uip7pq0",
  authDomain: "shop-app-udemy-fe5b1.firebaseapp.com",
  projectId: "shop-app-udemy-fe5b1",
  storageBucket: "shop-app-udemy-fe5b1.appspot.com",
  messagingSenderId: "762976926664",
  appId: "1:762976926664:web:1515f7739577f57c6a5efd"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);