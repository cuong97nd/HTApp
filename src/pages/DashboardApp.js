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
import { Navigate, useRoutes, useNavigate, Link as RouterLink } from 'react-router-dom';
// material
import { Fab, Box, Grid, Container, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
// components
import AddIcon from '@material-ui/icons/Add';
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
import Profile from './Profile';

// ----------------------------------------------------------------------
const AuthStateApp = observer(({ myAuthS }) => {
  const navigate = useNavigate();

  switch (myAuthS.Auth) {
    case 'signIn':
      return <DashboardApp />;
    case 'signUp':
      return <Navigate to="/register" replace />;
    case 'signInNoProfile':
      return <Profile />;
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
      <Box position="fixed" right="50px" bottom="35px">
        <Fab
          variant="extended"
          color="primary"
          size="large"
          component={RouterLink}
          to="/dashboard/add"
        >
          <AddIcon />
          Add Food
        </Fab>{' '}
        <Fab
          variant="extended"
          color="secondary"
          size="large"
          component={RouterLink}
          to="/dashboard/add"
        >
          <AddIcon />
          Add Motion
        </Fab>
      </Box>
    </Page>
  );
}

export default AuthStateApp;
