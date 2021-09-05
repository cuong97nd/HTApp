import { merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Hub, Logger, Auth, API, graphqlOperation } from 'aws-amplify';
import { Navigate, useRoutes, useNavigate, Link as RouterLink } from 'react-router-dom';

import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';
import { userDetail } from '../../../pages/DashboardApp';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits() {
  const navigate = useNavigate();
  const [CHARTDATA, setCHARTDATA] = useState([
    {
      name: '体重',
      type: 'area',
      data: []
    }
  ]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      console.log('AppWebsiteVisits init', 'da bi goi');
      const user = await Auth.currentAuthenticatedUser();
      try {
        const test = await API.graphql(
          graphqlOperation(
            `query MyQuery($email: String) {
            listCustomers(filter: {email: {eq: $email}}) {
              items {
                name
                email
                id
              }
            }
          }`,
            { email: user.attributes.email }
          )
        );
        if (test.data.listCustomers.items.length === 0) {
          navigate('/dashboard/profile');
        }
        const id1 = test.data.listCustomers.items[0].id;

        const weights = await API.graphql(
          graphqlOperation(
            `query MyQuery($id: ID!) {
            getCustomer(id: $id) {
              WeightForReports(sortDirection: ASC) {
                items {
                  createdAt
                  weight
                }
              }
            }
          }`,
            { id: id1 }
          )
        );

        let weightList = weights.data.getCustomer.WeightForReports.items;
        weightList = weightList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const w = weightList.map((x) => x.weight);
        setCHARTDATA([{ ...CHARTDATA, data: w }]);
        const d = weightList.map((x) => fDateTime(x.createdAt));
        setDates(d);
      } catch (error) {
        console.log('AppWebsiteVisits err', error);
      }
    })();
  }, []);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [3, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient', 'gradient', 'solid'] },
    labels: dates,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} KG`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="時系列グラフ" subheader="よく頑張った事をご覧ください。" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="area" series={CHARTDATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
