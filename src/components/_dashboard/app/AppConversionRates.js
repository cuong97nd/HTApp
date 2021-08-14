import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Amplify, { Auth, Hub, API, graphqlOperation } from 'aws-amplify';

// utils
// ----------------------------------------------------------------------

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
  const [series, setSeries] = useState([
    {
      name: 'Actual',
      data: []
    }
  ]);

  useEffect(() => {
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
                      VitamnD
                    }
                    unit
                  }
                }
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
        try {
          console.log(a);
          a.data.listFoodDeitalForReports = a.data.listCustomers.items[0].FoodDeitalForReports;
          delete a.data.listCustomers;

          // xoa null trong data
          a.data.listFoodDeitalForReports.items = a.data.listFoodDeitalForReports.items.filter(
            (x) => x.Food !== null
          );

          // Tinh data
          Object.keys(a.data.listFoodDeitalForReports.items[0].Food).forEach((key) => {
            a.data.listFoodDeitalForReports.items[0].Food[key] =
              parseInt(a.data.listFoodDeitalForReports.items[0].Food[key], 10) *
              (parseInt(a.data.listFoodDeitalForReports.items[0].unit, 10) / 100);
            if (Number.isNaN(a.data.listFoodDeitalForReports.items[0].Food[key]))
              a.data.listFoodDeitalForReports.items[0].Food[key] = 0;
          });

          const data = a.data.listFoodDeitalForReports.items.reduce((a, b) => {
            Object.keys(a.Food).forEach((key) => {
              const tmp = parseInt(b.Food[key], 10) * (parseInt(b.unit, 10) / 100);
              if (Number.isNaN(tmp)) a.Food[key] += tmp;
            });
            return a;
          }).Food;

          const series = [
            {
              name: 'Actual',
              data: []
            }
          ];

          Object.keys(data).forEach((key) => {
            series[0].data.push({
              x: key,
              y: data[key],
              goals: [
                {
                  name: 'Expected',
                  value: 0,
                  strokeWidth: 5,
                  strokeColor: '#775DD0'
                }
              ]
            });
          });

          setSeries(series);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <Card>
      <CardHeader
        title="体の状況"
        subheader={`${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`}
      />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </Box>
    </Card>
  );
}
