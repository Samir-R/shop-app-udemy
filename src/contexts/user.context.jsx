import { createContext, useReducer, useEffect } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

const USER_REDUCER_ACTION_TYPE = {
  SET_CURRENT_USER: 'SET_CURRENT_USER'
}

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_REDUCER_ACTION_TYPE.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      throw new Error('ACTION NON RECONUE');
  }
}

const INITIAL_STATE = {
  currentUser: null,
}

export const UserProvider = ({ children }) => {
  const [{currentUser}, dispatch] = useReducer(userReducer, INITIAL_STATE)
  
  const setCurrentUser = (user) => dispatch({type: USER_REDUCER_ACTION_TYPE.SET_CURRENT_USER, payload: user})
  
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
