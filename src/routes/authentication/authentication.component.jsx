import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import { UserContext } from '../../contexts/user.context';

import { AuthenticationContainer } from './authentication.styles';

const Authentication = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, le rediriger vers son compte
    if (currentUser) {
      navigate('/my-account');
    }
  }, [currentUser, navigate]);

  // Si l'utilisateur est connecté, ne rien afficher (la redirection est en cours)
  if (currentUser) {
    return null;
  }

  return (
    <AuthenticationContainer>
      <SignInForm />
      <SignUpForm />
    </AuthenticationContainer>
  );
};

export default Authentication;
