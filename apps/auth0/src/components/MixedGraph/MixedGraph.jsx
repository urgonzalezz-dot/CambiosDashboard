import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarController,
  LineController,
} from 'chart.js';

import { Chart } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarController,
  LineController
);

const fakeChartData = {
  labels: ['01/01', '02/01', '03/01', '04/01', '05/01'],
  datasets: [
    {
      label: 'Tiendas activas',
      data: [20, 25, 30, 28, 35],
      yAxisID: 'leftAxis',
      type: 'bar',
      color: '#833177',
    },
    {
      label: 'Ventas',
      data: [5000, 7200, 6100, 9000, 11000],
      yAxisID: 'rightAxis',
      type: 'line',
      color: '#ff7c43',
    },
  ],
};

export const MixedGraph = ({ chartData = fakeChartData }) => {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const mapped = chartData.datasets.map((ds) => {
      if (ds.type === 'line') {
        return {
          type: 'line',
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.color,
          yAxisID: ds.yAxisID,
          pointRadius: 5,
          pointHoverRadius: 7,
        };
      }

      return {
        type: 'bar',
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color,
        borderRadius: 6,
        yAxisID: ds.yAxisID,
        barThickness: 12,
      };
    });

    setDatasets(mapped);
  }, [chartData]);

  const data = {
    labels: chartData.labels,
    datasets,
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      leftAxis: {
        type: 'linear',
        position: 'left',
        ticks: { color: '#333' },
      },
      rightAxis: {
        type: 'linear',
        position: 'right',
        ticks: { color: '#333' },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '250px' }}>
      <Chart type="bar" data={data} options={options} />
    </Box>
  );
};

MixedGraph.propTypes = {
  chartData: PropTypes.shape({
    labels: PropTypes.array,
    datasets: PropTypes.array,
  }),
};
