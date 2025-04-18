// src/components/Admin/ManageBookings.js
import React, { useState, useEffect } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getAllBookings } from "../../api-helpers/api-helpers";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data.bookings);
      } catch (err) {
        console.error("Eroare la preluarea rezervărilor:", err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Typography variant="h5" className="mb-4 font-bold">
        Rezervări Existente
      </Typography>
      {bookings.length === 0 ? (
        <Typography color="textSecondary">Nu există rezervări momentan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilizator</TableCell>
                <TableCell>Spectacol</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Loc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.userId?.email || "N/A"}</TableCell>
                  <TableCell>{booking.movieId?.title || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(booking.showTime?.dateTime).toLocaleString("ro-RO")}
                  </TableCell>
                  <TableCell>{booking.seatNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ManageBookings;