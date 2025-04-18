// src/profile/AdminProfile.js
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getAdminById } from "../api-helpers/api-helpers";
import ManageMovies from "../components/Admin/ManageMovies";
import ManageBookings from "../components/Admin/ManageBookings";
import Statistics from "../components/Admin/Statistics";

const AdminProfile = () => {
  const [admin, setAdmin] = useState();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);

  useEffect(() => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch((err) => console.log(err));
  }, []);

  // Redirecționează dacă nu este admin
  if (!isLoggedIn || userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-serif">
          Panou de Administrare
        </h2>

        {/* Secțiunea cu informații despre admin */}
        {admin && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginBottom={4}
            padding={3}
            bgcolor="white"
            borderRadius={2}
            boxShadow={3}
          >
            <AccountCircleIcon sx={{ fontSize: "10rem", color: "gray" }} />
            <Typography
              mt={1}
              padding={1}
              width="auto"
              textAlign="center"
              border="1px solid #ccc"
              borderRadius={6}
              bgcolor="#f5f5f5"
            >
              Email: {admin.email}
            </Typography>
          </Box>
        )}

        {/* Secțiunea cu spectacolele adăugate */}
        {admin && admin.addedMovies.length > 0 && (
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            marginBottom={4}
            padding={3}
            bgcolor="white"
            borderRadius={2}
            boxShadow={3}
          >
            <Typography
              variant="h5"
              fontFamily="verdana"
              textAlign="center"
              padding={2}
              fontWeight="bold"
            >
              Spectacole Adăugate
            </Typography>
            <Box margin="auto" display="flex" flexDirection="column" width="80%">
              <List>
                {admin.addedMovies.map((movie, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: "#00d386",
                      color: "white",
                      textAlign: "center",
                      margin: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Spectacol: {movie.title}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        {/* Secțiunea pentru gestionarea spectacolelor */}
        <ManageMovies />

        {/* Secțiunea pentru rezervări */}
        <ManageBookings />

        {/* Secțiunea pentru statistici */}
        <Statistics />
      </div>
    </div>
  );
};

export default AdminProfile;