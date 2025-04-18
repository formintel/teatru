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
  Tooltip
} from "@mui/material";
import { getAllBookings } from "../../api-helpers/api-helpers";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageBookings = () => {
  const navigate = useNavigate();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Înapoi la Panou
        </Button>
        <Typography variant="h4" component="h1" sx={{ flex: 1, textAlign: 'center' }}>
          Gestionare Rezervări
        </Typography>
        <Tooltip title="Reîmprospătează">
          <span>
            <IconButton onClick={fetchBookings} disabled={loading}>
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