import * as Yup from 'yup';
import { useState } from 'react';
import Box from '@material-ui/core/Box';
import { Auth } from 'aws-amplify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { DatePicker } from 'react-rainbow-components';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';
import InputLabel from '@material-ui/core/InputLabel';

// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import FormControl from '@material-ui/core/FormControl';
import { myAuthS } from '../App';

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function Profile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      wight: '',
      date: new Date(),
      sex: '',
      height: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      Auth.signIn(values.email, values.password).then(() => {
        myAuthS.Auth = 'signIn';
        navigate('/');
      });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;
  console.log(getFieldProps('date'));
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box maxWidth="500px" width="100%">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <TextField
                fullWidth
                label="Name"
                {...getFieldProps('name')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                label="Wight"
                type="number"
                {...getFieldProps('wight')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                label="Height"
                type="number"
                {...getFieldProps('height')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Sex</InputLabel>
                <Select
                  label="Sex"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...getFieldProps('sex')}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                value={getFieldProps('date').value}
                onChange={(date, dateString) => {
                  setFieldValue('date', date);
                }}
                label="Birth Day"
              />
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  );
}
