// material
import { Stack, TextField, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { DatePicker } from 'react-rainbow-components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

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
        try {
          const user = await Auth.currentAuthenticatedUser();
          const test = await API.graphql(
            graphqlOperation(
              `query MyQuery($email: String) {
                listCustomers(filter: {email: {eq: $email}}) {
                  items {
                    id
                    _version
                  }
                }
              }`,
              { email: user.attributes.email }
            )
          );
          console.log('test', test.data.listCustomers.items);
          if (test.data.listCustomers.items.length !== 0) {
            const a = await API.graphql(
              graphqlOperation(
                `mutation MyMutation($date: String, $height: String, $id: ID!, $sex: String, $weight: String, $name: String , $_version: Int ) {
                  updateCustomer(input: {id: $id, weight: $weight, height: $height, dateOfBirth: $date, sex: $sex, name: $name, _version :$_version}) {
                    id
                  }
                }
                `,
                { ...test.data.listCustomers.items[0], ...values }
              )
            );
            console.log(a);
          } else {
            await API.graphql(
              graphqlOperation(
                `mutation MyMutation( $weight: String, $height: String, $name: String, $date: String, $sex: String , $email: String) {
                  createCustomer(input: {weight: $weight, height: $height, name: $name, dateOfBirth: $date, sex: $sex, email: $email}) {
                    id
                  }
                }`,
                { email: user.attributes.email, ...values }
              )
            );
          }
          navigate('/');
        } catch (error) {
          console.log(error);
          setSubmitting(false);
        }
      })();
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setValues
  } = formik;
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  useEffect(() => {
    const init = async () => {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      try {
        const a = await API.graphql(
          graphqlOperation(
            `query MyQuery($email: String) {
            listCustomers(filter: {email: {eq: $email}}) {
              items {
                name
                height
                weight
                sex
                dateOfBirth
              }
            }
          }`,
            { email: user.attributes.email }
          )
        );
        if (a.data.listCustomers.items.length !== 0) {
          a.data.listCustomers.items[0].date = a.data.listCustomers.items[0].dateOfBirth;
          console.log('ojsaidjia', a.data.listCustomers.items);
          await setValues(a.data.listCustomers.items[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <Box maxWidth="500px" width="100%">
        <Typography variant="h2" sx={{ mt: 3, textAlign: 'center' }}>
          Profile
        </Typography>

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
