import React from 'react';
import { Hub, Logger, Auth } from 'aws-amplify';
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
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';
import { myAuthS } from '../App';

// ----------------------------------------------------------------------
const AuthStateApp = observer(({ myAuthS }) => {
  const navigate = useNavigate();

  switch (myAuthS.Auth) {
    case 'signIn':
      return <DashboardApp />;
    case 'signUp':
      return <Navigate to="/register" replace />;
    case 'signOut':
    case 'signIn_failure':
    case 'tokenRefresh':
    case 'tokenRefresh_failure':
    case 'configured':
    default:
      return <Navigate to="/login" replace />;
  }
});

function DashboardApp() {
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12}>
            <AppWebsiteVisits />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default AuthStateApp;
