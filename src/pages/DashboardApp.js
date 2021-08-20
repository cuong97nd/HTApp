import React, { useEffect } from 'react';
import { Hub, Logger, Auth, API, graphqlOperation } from 'aws-amplify';
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
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.log('DashboardApp', 'da bi goi');
      const user = await Auth.currentAuthenticatedUser();
      try {
        const test = await API.graphql(
          graphqlOperation(
            `query MyQuery($email: String) {
              listCustomers(filter: {email: {eq: $email}}) {
                items {
                  name
                  email
                  id
                }
              }
            }`,
            { email: user.attributes.email }
          )
        );
        if (test.data.listCustomers.items.length === 0) {
          navigate('/dashboard/profile');
        }
        userDetail.displayName = test.data.listCustomers.items[0].name;
        userDetail.email = test.data.listCustomers.items[0].email;
        userDetail.id = test.data.listCustomers.items[0].id;
        console.log('user detail', test.data.listCustomers.items[0]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
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
          Add
        </Fab>
      </Box>
    </Page>
  );
}

export default AuthStateApp;
export const userDetail = { photoURL: '/static/mock-images/avatars/avatar_default.jpg' };
