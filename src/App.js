import React from 'react';
import { makeAutoObservable } from 'mobx';
import { Navigate, useRoutes } from 'react-router-dom';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact,
  withAuthenticator
} from 'aws-amplify-react';
import Amplify, { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
// ----------------------------------------------------------------------
const listener = (data) => {
  console.log('trang thai ', data.payload.event);

  switch (data.payload.event) {
    case 'signIn':
      console.log('user signed in');
      break;
    case 'signUp':
      console.log('user signed up');
      break;
    case 'signOut':
      console.log('user signed out');
      break;
    case 'signIn_failure':
      console.error('user sign in failed');
      break;
    case 'tokenRefresh':
      console.log('token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      console.error('token refresh failed');
      break;
    case 'configured':
      console.log('the Auth module is configured');
      break;
    default:
      break;
  }
};
Hub.listen('auth', listener);

class AuthS {
  Auth = '';

  userNameForSignUp = '';

  constructor() {
    makeAutoObservable(this);
  }

  setAuthS(x) {
    this.Auth = x;
  }
}

export const myAuthS = new AuthS();

function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  );
}

export default App;
