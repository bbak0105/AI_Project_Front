import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';

import DashboardCard from '../../../components/shared/DashboardCard';

const ProductCodeOverview = (props) => {
  const data = props.data;
  const pieSeries = data && data['count'] && data['count'].length > 0 ?  
    data['count'].slice(0,10) : [];
  const pieLabels = data && data['index'] && data['index'].length > 0 ?  
    data['index'].slice(0,10) : [];

  // chart color
  const theme = useTheme();
  const primarydark = theme.palette.primary.dark;
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;

  const secondary = theme.palette.secondary.main;
  const greenmain = theme.palette.success.main;
  const greenlight = theme.palette.success.light;
  const redmain = theme.palette.error.main;
  const yellowmain = theme.palette.warning.main;
  const yellowlight = theme.palette.warning.light;
  const infomain = theme.palette.info.main;
  const successlight = theme.palette.success.light;
  const infocontrast = theme.palette.info.contrastText;
  const grey = theme.palette.success.dark

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [redmain, yellowlight, greenlight, secondary, greenmain],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false,
    },
    labels: pieLabels,
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = pieSeries;

  return (
    <DashboardCard title="">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {pieLabels[0]}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {Math.floor(pieSeries[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              most
            </Typography>
          </Stack>
          <Stack spacing={3} mt={13} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {pieLabels[1]}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: theme.palette.secondary.light, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {pieLabels[2]}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ProductCodeOverview;
