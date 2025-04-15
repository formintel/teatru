// src/components/Admin/ManageMovies.js
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Modal, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllMovies, addMovie, updateMovie, deleteMovie, cancelMovie } from "../../api-helpers/api-helpers";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({
    _id: "",
    title: "",
    description: "",
    posterUrl: "",
    pret: "",
    gen: "",
    regizor: "",
    durata: "",
    sala: "",
    showTimes: [{ dateTime: "" }],
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data.movies);
    } catch (err) {
      console.error("Eroare la preluarea spectacolelor:", err);
    }
  };

  const handleOpen = (movie = null) => {
    if (movie) {
      setEditMode(true);
      setCurrentMovie(movie);
    } else {
      setEditMode(false);
      setCurrentMovie({
        title: "",
        description: "",
        posterUrl: "",
        pret: "",
        gen: "",
        regizor: "",
        durata: "",
        sala: "",
        showTimes: [{ dateTime: "" }],
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowTimeChange = (e, index) => {
    const newShowTimes = [...currentMovie.showTimes];
    newShowTimes[index].dateTime = e.target.value;
    setCurrentMovie((prev) => ({ ...prev, showTimes: newShowTimes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateMovie(currentMovie._id, currentMovie);
      } else {
        await addMovie(currentMovie);
      }
      fetchMovies();
      handleClose();
    } catch (err) {
      console.error("Eroare la salvarea spectacolului:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest spectacol?")) {
      try {
        await deleteMovie(id);
        fetchMovies();
      } catch (err) {
        console.error("Eroare la ștergerea spectacolului:", err);
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Ești sigur că vrei să anulezi acest spectacol? Utilizatorii vor fi notificați.")) {
      try {
        await cancelMovie(id);
        fetchMovies();
      } catch (err) {
        console.error("Eroare la anularea spectacolului:", err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Typography variant="h5" className="mb-4 font-bold">
        Gestionează Spectacole
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        className="mb-4"
      >
        Adaugă Spectacol
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <div key={movie._id} className="border p-4 rounded-lg">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-40 object-cover mb-2 rounded" />
            <Typography variant="h6">{movie.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {movie.description}
            </Typography>
            <div className="flex justify-between mt-2">
              <IconButton onClick={() => handleOpen(movie)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(movie._id)}>
                <DeleteIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancel(movie._id)}
              >
                Anulează
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pentru adăugare/editare */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" className="mb-4">
            {editMode ? "Editează Spectacol" : "Adaugă Spectacol"}
          </Typography>
          <TextField
            label="Titlu"
            name="title"
            value={currentMovie.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descriere"
            name="description"
            value={currentMovie.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            label="URL Poster"
            name="posterUrl"
            value={currentMovie.posterUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Preț (RON)"
            name="pret"
            type="number"
            value={currentMovie.pret}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Gen"
            name="gen"
            value={currentMovie.gen}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Regizor"
            name="regizor"
            value={currentMovie.regizor}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Durata (minute)"
            name="durata"
            type="number"
            value={currentMovie.durata}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Sala"
            name="sala"
            value={currentMovie.sala}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Data și ora"
            name="dateTime"
            type="datetime-local"
            value={currentMovie.showTimes[0]?.dateTime || ""}
            onChange={(e) => handleShowTimeChange(e, 0)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            {editMode ? "Salvează" : "Adaugă"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageMovies;