import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import {
  Box,
  Card,
  CardHeader,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import Amplify, { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { makeStyles } from '@material-ui/styles';

// utils
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

const options = {
  chart: {
    height: 350,
    type: 'bar'
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  colors: ['#00E396'],
  dataLabels: {
    formatter: function ok(val, opt) {
      const { goals } = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex];

      if (goals && goals.length) {
        return `${val} / ${goals[0].value}`;
      }
      return val;
    }
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Actual', 'Expected'],
    markers: {
      fillColors: ['#00E396', '#775DD0']
    }
  }
};
const date = new Date();

export default function AppConversionRates() {
  const classes = useStyles();

  const [series, setSeries] = useState([
    {
      name: 'Actual',
      data: []
    }
  ]);

  const [time, setTime] = useState('morning');

  useEffect(() => {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log('AppConversionRates bi goi');
    (async () => {
      const user = await Auth.currentAuthenticatedUser();
      try {
        const a = await API.graphql(
          graphqlOperation(
            `query MyQuery($creatDate: String = "", $email: String = "") {
            listCustomers(filter: {email: {eq: $email}}) {
              items {
                FoodDeitalForReports(filter: {creatDate: {eq: $creatDate}}) {
                  items {
                    Food {
                      Energy
                      VitaminA
                      VitaminB1
                      VitaminB12
                      VitaminB2
                      VitaminB5
                      VitaminB9
                      VitaminB6
                      VitaminC
                      VitaminE
                      VitaminH
                      VitaminK
                      VitaminPP
                      VitaminD
                    }
                    id
                    _deleted
                    unit
                    time
                  }
                }
                dateOfBirth
              }
            }
          }          
          `,
            {
              creatDate: dateString,
              email: user.attributes.email
            }
          )
        );
        console.log('AppConversionRates do an trong ngay');

        const userAge = ((dateString) => {
          const today = new Date();
          const birthDate = new Date(dateString);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age -= 1;
          }
          return age;
        })(a.data.listCustomers.items[0].dateOfBirth);

        try {
          a.data.listFoodDeitalForReports = a.data.listCustomers.items[0].FoodDeitalForReports;
          delete a.data.listCustomers;

          // xoa null trong data
          a.data.listFoodDeitalForReports.items = a.data.listFoodDeitalForReports.items.filter(
            (x) => x.Food !== null && x._deleted !== true
          );

          // loc du lieu theo buoi
          a.data.listFoodDeitalForReports.items = a.data.listFoodDeitalForReports.items.filter(
            (x) => x.time === time
          );

          // Tinh data theo 100gr
          Object.keys(a.data.listFoodDeitalForReports.items[0].Food).forEach((key) => {
            a.data.listFoodDeitalForReports.items[0].Food[key] =
              parseInt(a.data.listFoodDeitalForReports.items[0].Food[key], 10) *
              (parseInt(a.data.listFoodDeitalForReports.items[0].unit, 10) / 100);
            if (Number.isNaN(a.data.listFoodDeitalForReports.items[0].Food[key]))
              a.data.listFoodDeitalForReports.items[0].Food[key] = 0;
          });

          // Tinh tong data
          const data = a.data.listFoodDeitalForReports.items.reduce((a, b) => {
            Object.keys(a.Food).forEach((key) => {
              const tmp = parseInt(b.Food[key], 10) * (parseInt(b.unit, 10) / 100);
              if (!Number.isNaN(tmp)) a.Food[key] += tmp;
            });
            return a;
          }).Food;
          console.log('AppConversionRates tong an trong ngay', data);

          // lay du lieu chuan
          const chuan = (
            await API.graphql(
              graphqlOperation(
                `query MyQuery {
                listNutritionStandards {
                  items {
                    Calcium
                    Phosphorous
                    Magnesium
                    VitaminA
                    VitaminB1
                    VitaminB12
                    VitaminB2
                    VitaminB6
                    VitaminB9
                    VitaminC
                    VitaminD
                    VitaminE
                    VitaminK
                    startAge
                    endAge
                  }
                }
              }
                      
            `
              )
            )
          ).data.listNutritionStandards.items.find(
            (x) => x.startAge < userAge && x.endAge > userAge
          );
          console.log('chuan', chuan);
          // lay du lieu chuan end

          // tao du lieu data bieu thi
          const bieuThiArray = [
            'VitaminA',
            'VitaminB1',
            'VitaminB12',
            'VitaminB2',
            'VitaminB6',
            'VitaminB9',
            'VitaminC',
            'VitaminD',
            'VitaminE',
            'VitaminK'
          ];
          const series = [
            {
              name: 'Actual',
              data: []
            }
          ];

          bieuThiArray.forEach((key) => {
            series[0].data.push({
              x: key,
              y: parseInt((data[key] / (chuan[key] / 3)) * 100, 10),
              goals: [
                {
                  name: 'Expected',
                  value: 100,
                  strokeWidth: 5,
                  strokeColor: '#775DD0'
                }
              ]
            });
          });
          // tao du lieu data bieu thi end

          setSeries(series);
        } catch (error) {
          console.log('AppConversionRates err', error);
          const series = [
            {
              name: 'Actual',
              data: []
            }
          ];
          setSeries(series);
        }
      } catch (error) {
        console.log('AppConversionRates err', error);
      }
    })();
  }, [time]);

  return (
    <Card>
      <Box display="flex" justifyContent="space-between">
        <CardHeader
          title="体の状況"
          subheader={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Time</InputLabel>
          <Select
            label="Time"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={time}
            onChange={(event) => {
              setTime(event.target.value);
            }}
          >
            <MenuItem value="morning">Bữa sáng</MenuItem>
            <MenuItem value="afternoon">Bữa trưa</MenuItem>
            <MenuItem value="evening">Bữa tối</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </Box>
    </Card>
  );
}
