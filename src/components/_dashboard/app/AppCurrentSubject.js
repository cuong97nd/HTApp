import { merge } from 'lodash';
// material
import { useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Card, CardHeader } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] }
];

export default function AppCurrentSubject() {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 2 },
    fill: { opacity: 0.48 },
    legend: { floating: true, horizontalAlign: 'center' },
    xaxis: {
      categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
      labels: {
        style: {
          colors: [
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary
          ]
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="サリー先生のアドバイス" />
      <Box height="400px">
        <Box
          boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
          margin="20px"
          marginLeft="152px"
          marginBottom="100px"
          padding="40px"
          borderRadius="14% 86% 13% 87% / 77% 12% 88% 23%"
          fontSize="29px"
          height="-webkit-fill-available"
        >
          こんにちは！お兄ちゃんは元気ですよ。
        </Box>
        <Box
          component="img"
          src="/static/illustrations/illustration_rocket.png"
          sx={{ width: 170, position: 'absolute', bottom: 15, left: 50 }}
        />
      </Box>
    </Card>
  );
}
