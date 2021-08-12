import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Auth } from 'aws-amplify';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { myAuthS } from '../../../App';

// ----------------------------------------------------------------------
// firstName mean userName
export default function ComfirmForm({ userName }) {
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      firstName: userName,
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      Auth.confirmSignUp(values.firstName, values.password).then(() => {
        myAuthS.Auth = 'signIn';
        myAuthS.userNameForSignUp = '';
        navigate('/', { replace: true });
      });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={userName}
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              disabled
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="current-password"
            label="Code"
            {...getFieldProps('password')}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Comfirm
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
