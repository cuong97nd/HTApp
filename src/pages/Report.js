// material
import {
  Stack,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { LoadingButton } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';
import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function Report({ type }) {
  const LoginSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    detail: Yup.string().required('Detail is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      detail: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const sent = async () => {
          const user = await Auth.currentAuthenticatedUser();
          const test = await API.graphql(
            graphqlOperation(
              `query MyQuery($email: String) {
                listCustomers(filter: {email: {eq: $email}}) {
                  items {
                    id
                  }
                }
              }`,
              { email: user.attributes.email }
            )
          );
          console.log('userID', test.data.listCustomers.items[0].id);
          console.log('FoodID', values);

          await API.graphql(
            graphqlOperation(
              `mutation MyMutation($customerID: ID!, $detail: String, $title: String) {
                createReport(input: {customerID: $customerID, detail: $detail, title: $title}) {
                  id
                }
              }`,
              {
                detail: values.detail,
                customerID: test.data.listCustomers.items[0].id,
                title: values.title
              }
            )
          );
          setSubmitting(false);
          setValues(initialValues);
          Hub.dispatch('reportSS', {});
        };

        sent();
      } catch (error) {
        console.log('Report', error);
      }
    }
  });

  const { initialValues, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setValues } =
    formik;

  return (
    <Box display="flex" justifyContent="center">
      <Box maxWidth="700px" width="100%">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <Typography variant="h2" sx={{ mt: 3, textAlign: 'center' }}>
                Report Bug
              </Typography>

              <TextField fullWidth label="Title" type="text" {...getFieldProps('title')} />

              <TextField
                multiline
                rows={6}
                fullWidth
                label="Detail"
                type="text"
                {...getFieldProps('detail')}
              />
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Report
            </LoadingButton>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  );
}
