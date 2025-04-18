import React, { useState } from "react";
import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import { addMovie } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddMovie = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    addMovie({ ...inputs, releaseDate: new Date(inputs.releaseDate) })
      .then((data) => {
        console.log(data);
        navigate("/admin");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        width="50%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        boxShadow="10px 10px 20px #ccc"
        padding={3}
        margin={3}
        borderRadius={5}
      >
        <Box width="100%" display="flex" justifyContent="flex-start" mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin")}
            sx={{
              color: "#2b2d42",
              borderColor: "#2b2d42",
              "&:hover": {
                borderColor: "#121217",
                backgroundColor: "rgba(43, 45, 66, 0.04)",
              },
            }}
          >
            Înapoi
          </Button>
        </Box>
        <Typography
          textAlign={"center"}
          variant="h4"
          fontFamily={"verdana"}
          padding={2}
          width="auto"
        >
          Adaugă Spectacol
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            padding={3}
            margin="auto"
            display="flex"
            flexDirection="column"
            width="80%"
          >
            <FormLabel>Titlu</FormLabel>
            <TextField
              value={inputs.title}
              onChange={handleChange}
              name="title"
              variant="standard"
              margin="normal"
            />
            <FormLabel>Descriere</FormLabel>
            <TextField
              value={inputs.description}
              onChange={handleChange}
              name="description"
              variant="standard"
              margin="normal"
            />
            <FormLabel>URL Poster</FormLabel>
            <TextField
              value={inputs.posterUrl}
              onChange={handleChange}
              name="posterUrl"
              variant="standard"
              margin="normal"
            />
            <FormLabel>Data lansării</FormLabel>
            <TextField
              type="date"
              value={inputs.releaseDate}
              onChange={handleChange}
              name="releaseDate"
              variant="standard"
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: 3,
                borderRadius: 7,
                bgcolor: "#2b2d42",
                ":hover": {
                  bgcolor: "#121217",
                },
              }}
            >
              Adaugă
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddMovie; 