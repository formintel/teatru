// src/components/Admin/Statistics.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress
} from "@mui/material";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { getAdminStatistics } from "../../api-helpers/api-helpers";


ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  
  const chartColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF'
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await getAdminStatistics();
      setStatistics(response.statistics);
      setLoading(false);
    } catch (err) {
      setError('Nu s-au putut încărca statisticile');
      setLoading(false);
    }
  };

  const genreChartData = {
    labels: statistics?.genreDistribution?.map(item => item._id) || [],
    datasets: [
      {
        data: statistics?.genreDistribution?.map(item => item.count) || [],
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const occupancyChartData = {
    labels: ['Locuri Ocupate', 'Locuri Libere'],
    datasets: [
      {
        data: statistics?.occupancyRate ? [
          statistics.occupancyRate.booked,
          statistics.occupancyRate.total - statistics.occupancyRate.booked
        ] : [],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const weekdayChartData = {
    labels: statistics?.weekdayDistribution?.map(item => item.day) || [],
    datasets: [
      {
        data: statistics?.weekdayDistribution?.map(item => item.count) || [],
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const popularMoviesChartData = {
    labels: statistics?.popularMovies?.map(movie => movie.title) || [],
    datasets: [
      {
        data: statistics?.popularMovies?.map(movie => movie.bookingsCount) || [],
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!statistics) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Nu există date pentru statistici.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Statistici Teatru
      </Typography>

      <Grid container spacing={3}>
        {/* Statistici Generale */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistici Generale
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {statistics.general?.totalMovies || 0}
                  </Typography>
                  <Typography variant="body2">Spectacole Total</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {statistics.general?.totalBookings || 0}
                  </Typography>
                  <Typography variant="body2">Rezervări Total</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {statistics.general?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2">Utilizatori</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {statistics.general?.totalRevenue || 0} RON
                  </Typography>
                  <Typography variant="body2">Venit Total</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Grafic Distribuție Genuri */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Distribuția Spectacolelor pe Genuri
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={genreChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Grafic Grad Ocupare */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Gradul de Ocupare al Sălilor
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={occupancyChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Grafic Distribuție pe Zile */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Distribuția Rezervărilor pe Zile
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={weekdayChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Grafic Spectacole Populare */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Cele Mai Populare Spectacole
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={popularMoviesChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;