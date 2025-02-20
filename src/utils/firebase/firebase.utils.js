import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  where,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJXMojLhgxbQfAG4XLJZC1hM1_uip7pq0",
  authDomain: "shop-app-udemy-fe5b1.firebaseapp.com",
  projectId: "shop-app-udemy-fe5b1",
  storageBucket: "shop-app-udemy-fe5b1.appspot.com",
  messagingSenderId: "762976926664",
  appId: "1:762976926664:web:1515f7739577f57c6a5efd"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getAllDocumentsOfCollection = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);
  // const transformedResponseData = [];
  const querySnapshot = await getDocs(q);
  // const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
  //   const { title, items } = docSnapshot.data();
  //   acc[title.toLowerCase()] = items;
  //   return acc;
  // }, {});

  // return transformedResponseData;
  return querySnapshot.docs;
};


export const getDocumentsOfCollectionByCondition = async (collectionName,whereConditions, entity = null) => {
  const collectionRef = collection(db, collectionName);
  const wheres = whereConditions.map((whereCondition) => {
    return where(whereCondition[0], whereCondition[1], whereCondition[2]);
  });
  const q = query(collectionRef, ...wheres);
  // const transformedResponseData = [];
  const querySnapshot = await getDocs(q);
  // const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
  //   const { title, items } = docSnapshot.data();
  //   acc[title.toLowerCase()] = items;
  //   return acc;
  // }, {});

  return querySnapshot.docs.map((doc) => {
    return entity === null ? { ...doc.data(), id: doc.id } : new entity({ ...doc.data(), id: doc.id });
  });
  /**
   * Pour economiser la facture firebase mettre un champs updateAt dans les documents pour ne prendre que 
   * les documents modifier après une date "lastFetchTimestamp" enregistré dans le local Storage
   * 
   * Exemple db.collection('groups')
   *           .where('participants', 'array-contains', 'user123')
   *           .where('lastUpdated', '>', lastFetchTimestamp)
   * 
   * Voir : https://firebase.google.com/docs/firestore/billing-example#costs-breakdown
   */


  // return transformedResponseData;
  // return querySnapshot.docs;
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
