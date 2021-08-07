import React from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
// ----------------------------------------------------------------------
const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(
    () =>
      onAuthUIStateChange((nextAuthState, authData) => {
        setAuthState(nextAuthState);
        setUser(authData);
      }),
    []
  );

  return authState === AuthState.SignedIn && user ? (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[{ type: 'username' }, { type: 'password' }, { type: 'email' }]}
      />
    </AmplifyAuthenticator>
  );
};

export default AuthStateApp;
