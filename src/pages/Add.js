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
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function Add({ type }) {
  const classes = useStyles();
  const [selectArray, setSelectArray] = useState([]);

  const LoginSchema = Yup.object().shape({
    unit: Yup.string().required('Unit is required')
  });

  const formik = useFormik({
    initialValues: {
      select: '',
      unit: '',
      time: 'morning'
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const date = new Date();
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const sentFood = async () => {
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
              `mutation MyMutation($foodDeitalForReportFoodId: ID, $customerID: ID, $unit: String , $creatDate :String ,$time :String) {
              createFoodDeitalForReport(input: {foodDeitalForReportFoodId: $foodDeitalForReportFoodId, customerID: $customerID, unit: $unit , creatDate : $creatDate , time : $time}) {
                id
              }
            }            
            `,
              {
                foodDeitalForReportFoodId: values.select.id,
                customerID: test.data.listCustomers.items[0].id,
                unit: values.unit.toString(),
                creatDate: dateString,
                time: values.time.toString()
              }
            )
          );
          setSubmitting(false);
          setValues(initialValues);
          Hub.dispatch('reportSS', {});
        };

        const sentMotion = async () => {
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
              `mutation MyMutation($motionForReportMotionId: ID, $customerID: ID, $unit: String , $creatDate :String) {
              createMotionForReport(input: {motionForReportMotionId: $motionForReportMotionId, customerID: $customerID, unit: $unit , creatDate : $creatDate}) {
                id
              }
            }            
            `,
              {
                motionForReportMotionId: values.select.id,
                customerID: test.data.listCustomers.items[0].id,
                unit: values.unit.toString(),
                creatDate: dateString
              }
            )
          );
          setSubmitting(false);
          setValues(initialValues);
          Hub.dispatch('reportSS', {});
        };

        if (type === 'Food') {
          sentFood();
        } else {
          sentMotion();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  const { initialValues, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setValues } =
    formik;

  useEffect(() => {
    try {
      const initFood = async () => {
        const a = await API.graphql(
          graphqlOperation(
            `query MyQuery {
            listFoods {
              items {
                id
                name
                _deleted
              }
            }
          }
          `
          )
        );
        setSelectArray(a.data.listFoods.items.filter((x) => x._deleted !== true));
      };

      const initMotion = async () => {
        const a = await API.graphql(
          graphqlOperation(
            `query MyQuery {
            listMotions {
              items {
                id
                name
                _deleted
              }
            }
          }          
          `
          )
        );
        setSelectArray(a.data.listMotions.items.filter((x) => x._deleted !== true));
      };

      if (type === 'Food') {
        initFood();
      } else {
        initMotion();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <Box maxWidth="500px" width="100%">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <Typography variant="h2" sx={{ mt: 3, textAlign: 'center' }}>
                Add {type}
              </Typography>

              {type === 'Food' && (
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Time</InputLabel>
                  <Select
                    label="Time"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...getFieldProps('time')}
                  >
                    <MenuItem value="morning">B???a s??ng</MenuItem>
                    <MenuItem value="afternoon">B???a tr??a</MenuItem>
                    <MenuItem value="evening">B???a t???i</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Autocomplete
                fullWidth
                onChange={(event, newValue) => {
                  setFieldValue('select', newValue);
                }}
                options={selectArray}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label={type} variant="outlined" />}
              />

              <TextField
                fullWidth
                label="Unit"
                type="number"
                {...getFieldProps('unit')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {type === 'Food' ? 'gram' : 'minute'}
                    </InputAdornment>
                  )
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
  );
}
