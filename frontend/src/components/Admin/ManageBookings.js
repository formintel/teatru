// src/components/Admin/ManageBookings.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { getAllBookings } from "../../api-helpers/api-helpers";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageBookings = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "A apărut o eroare la încărcarea rezervărilor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderMobileBooking = (booking) => (
    <Card key={booking._id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              ID Rezervare
            </Typography>
            <Typography variant="body2">{booking._id}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Utilizator
            </Typography>
            <Typography variant="body2">
              {booking.user?.name || booking.user?.email || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Spectacol
            </Typography>
            <Typography variant="body2">{booking.movie?.title || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Data
            </Typography>
            <Typography variant="body2">
              {booking.date ? new Date(booking.date).toLocaleString("ro-RO", {
                dateStyle: 'medium',
                timeStyle: 'short'
              }) : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Loc
            </Typography>
            <Typography variant="body2">{booking.seatNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Box
              sx={{
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                py: 0.5,
                px: 1,
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              Confirmată
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          variant="outlined"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Înapoi la Panou
        </Button>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Gestionare Rezervări
        </Typography>
        <Tooltip title="Reîmprospătează">
          <span>
            <IconButton 
              onClick={fetchBookings} 
              disabled={loading}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {bookings.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary">
                Nu există rezervări momentan.
              </Typography>
            </Box>
          ) : isMobile ? (
            <Box sx={{ p: 2 }}>
              {bookings.map(renderMobileBooking)}
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Rezervare</TableCell>
                    <TableCell>Utilizator</TableCell>
                    <TableCell>Spectacol</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Loc</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} hover>
                      <TableCell>{booking._id}</TableCell>
                      <TableCell>
                        {booking.user?.name || booking.user?.email || "N/A"}
                      </TableCell>
                      <TableCell>{booking.movie?.title || "N/A"}</TableCell>
                      <TableCell>
                        {booking.date ? new Date(booking.date).toLocaleString("ro-RO", {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) : "N/A"}
                      </TableCell>
                      <TableCell>{booking.seatNumber}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: 'success.light',
                            color: 'success.contrastText',
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          Confirmată
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ManageBookings;