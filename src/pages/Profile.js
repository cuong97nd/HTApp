import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Amplify, { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
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

  const LoginSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      name: '',
      weight: '',
      date: new Date(),
      sex: '',
      height: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      (async () => {
        const user = await Auth.currentAuthenticatedUser();
        const a = await API.graphql(
          graphqlOperation(
            `mutation MyMutation($id: ID, $weight: String, $height: String, $name: String, $date: String, $sex: String) {
              createCustomer(input: {id: $id, weight: $weight, height: $height, name: $name, dateOfBirth: $date, sex: $sex}) {
                id
              }
            }`,
            { id: user.username, ...values }
          )
        );
        navigate('/');
      })();
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  useEffect(() => {
    const init = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const a = await API.graphql(
        graphqlOperation(
          `query MyQuery($id: ID) {
            getCustomer(id: $id) {
              name
              weight
              height
              sex
              dateOfBirth
            }
          }`,
          { id: user.username }
        )
      );
    };
    init();
  }, []);

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
                label="Weight"
                type="number"
                {...getFieldProps('weight')}
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
