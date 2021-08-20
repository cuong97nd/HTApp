// material
import {
  Stack,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { LoadingButton } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';
import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import * as Yup from 'yup';
import Add from './Add';
import { userDetail as account } from './DashboardApp';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddPage({ type }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectArray, setSelectArray] = useState([]);
  const [open, setOpen] = useState(false);

  const LoginSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      select: '',
      unit: '',
      time: 'morning',
      weight: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      API.graphql(
        graphqlOperation(
          `mutation MyMutation($weight: String , $customerID: ID , $creatDate: String ) {
            createWeightForReport(input: {creatDate: $creatDate, customerID: $customerID, weight: $weight}) {
              id
            }
          }                      
        `,
          {
            weight: values.weight.toString(),
            customerID: account.id,
            creatDate: dateString
          }
        )
      )
        .then(() => {
          setOpen(true);
          setSubmitting(false);
        })
        .catch(() => {
          setSubmitting(false);
        });
    }
  });

  const { initialValues, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setValues } =
    formik;

  useEffect(() => {
    const a = (data) => {
      setOpen(true);
    };

    Hub.listen('reportSS', a);

    return () => {
      Hub.remove('reportSS', a);
    };
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box maxWidth="500px" width="100%">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ my: 2 }}>
                <Typography variant="h2" sx={{ mt: 3, textAlign: 'center' }}>
                  Add Weight
                </Typography>

                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  {...getFieldProps('weight')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kg</InputAdornment>
                  }}
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
      <Add type="Food" />
      <Add type="Motion" />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return;
          }

          setOpen(false);
        }}
      >
        <Box>
          <Alert
            onClose={(event, reason) => {
              if (reason === 'clickaway') {
                return;
              }

              setOpen(false);
            }}
            severity="success"
          >
            Report success!
          </Alert>
        </Box>
      </Snackbar>
    </>
  );
}
