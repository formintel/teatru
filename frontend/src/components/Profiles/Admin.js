import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAdminData, getAdminBookings, getAdminStatistics } from "../../api-helpers/api-helpers";

const Admin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminData = await getAdminData();
        setAdmin(adminData);

        const bookingsData = await getAdminBookings();
        setBookings(bookingsData);

        const statisticsData = await getAdminStatistics();
        setStatistics(statisticsData);
      } catch (err) {
        console.error("Eroare la preluarea datelor:", err);
        setError("Eroare la preluarea datelor. Vă rugăm să reîncercați.");
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reîncarcă
        </Button>
      </Box>
    );
  }

  if (!admin) {
    return <Typography>Se încarcă...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Panou de administrare</Typography>
            <Typography variant="h6">Bun venit, {admin.name}!</Typography>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Deconectare
            </Button>
          </Paper>
        </Grid>

        {statistics && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Statistici</Typography>
              <Typography>Total rezervări: {statistics.totalBookings}</Typography>
              <Typography>Venit total: {statistics.totalRevenue} RON</Typography>
              <Typography>Filme active: {statistics.activeMovies}</Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Rezervări recente</Typography>
            {bookings.length > 0 ? (
              <Box>
                {bookings.map((booking) => (
                  <Paper key={booking._id} sx={{ p: 2, mb: 1 }}>
                    <Typography>Film: {booking.movie.title}</Typography>
                    <Typography>Utilizator: {booking.user.name}</Typography>
                    <Typography>Data: {new Date(booking.date).toLocaleDateString()}</Typography>
                    <Typography>Locuri: {booking.seats.join(", ")}</Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography>Nu există rezervări.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin;
