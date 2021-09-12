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
import { DataGrid } from '@mui/x-data-grid';
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
const columns = [
  { field: 'userName', headerName: 'user', width: 150 },
  { field: 'trangThai', headerName: 'Trạng thái', width: 200 },
  { field: 'title', headerName: 'Lỗi', width: 300 },
  { field: 'moiTruong', headerName: 'Môi trường', width: 300 },
  { field: 'cachTaiHien', headerName: 'Cách tái hiện', width: 400 },
  { field: 'ketQuaMongMuon', headerName: 'Kết quả mong muốn', width: 300 }
];

export default function Report() {
  const [rows, setRows] = useState([]);

  const LoginSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    moiTruong: Yup.string().required('required'),
    cachTaiHien: Yup.string().required('required'),
    ketQuaMongMuon: Yup.string().required('required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      moiTruong: '',
      cachTaiHien: '',
      ketQuaMongMuon: ''
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
              `mutation MyMutation($ketQuaMongMuon: String, $moiTruong: String, $cachTaiHien: String, $reportCustomerId: ID, $title: String) {
                createReport(input: {ketQuaMongMuon: $ketQuaMongMuon, moiTruong: $moiTruong, cachTaiHien: $cachTaiHien, reportCustomerId: $reportCustomerId, title: $title}) {
                  id
                }
              }
              `,
              {
                ketQuaMongMuon: values.ketQuaMongMuon,
                moiTruong: values.moiTruong,
                cachTaiHien: values.cachTaiHien,
                reportCustomerId: test.data.listCustomers.items[0].id,
                title: values.title
              }
            )
          );
          setSubmitting(false);
          setValues(initialValues);
          Hub.dispatch('reportSS', {});
        };

        sent();
        fetch();
      } catch (error) {
        console.log('Report', error);
      }
    }
  });

  const { initialValues, isSubmitting, handleSubmit, getFieldProps, values, setValues } = formik;

  const fetch = async () => {
    let rows = await API.graphql(
      graphqlOperation(
        `query MyQuery {
        listReports {
          items {
            id
            _deleted
            cachTaiHien
            ketQuaMongMuon
            moiTruong
            title
            trangThai
            Customer {
              name
            }
          }
        }
      }
    `
      )
    );
    rows = rows.data.listReports.items.filter((x) => x.Customer !== null && x._deleted !== true);

    setRows(
      rows.map((x) => ({
        ...x,
        userName: x.Customer.name,
        trangThai: x.trangThai === null ? 'Đang đợi' : x.trangThai
      }))
    );
    console.log(rows);
  };

  useEffect(() => {
    try {
      fetch();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box maxWidth="700px" width="100%">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ my: 2 }}>
                <Typography variant="h2" sx={{ mt: 3, textAlign: 'center' }}>
                  Report Bug
                </Typography>

                <TextField fullWidth label="Lỗi" type="text" {...getFieldProps('title')} />

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  label="Môi trường"
                  type="text"
                  {...getFieldProps('moiTruong')}
                />

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  label="Cách tái hiện"
                  type="text"
                  {...getFieldProps('cachTaiHien')}
                />

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  label="Kết quả mong muốn"
                  type="text"
                  {...getFieldProps('ketQuaMongMuon')}
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
      <Box height="600px" width="100%" marginTop="20px" paddingX="30px">
        <DataGrid rows={rows} columns={columns} disableSelectionOnClick />
      </Box>
    </>
  );
}
