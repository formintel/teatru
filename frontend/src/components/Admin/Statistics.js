// src/components/Admin/Statistics.js
import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { getStatistics } from "../../api-helpers/api-helpers";

const Statistics = () => {
  const [mostWatchedMovie, setMostWatchedMovie] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setMostWatchedMovie(data.mostWatchedMovie);
      } catch (err) {
        console.error("Eroare la preluarea statisticilor:", err);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Typography variant="h5" className="mb-4 font-bold">
        Statistici
      </Typography>
      {mostWatchedMovie ? (
        <Box>
          <Typography variant="h6">
            Cel mai vizionat spectacol: {mostWatchedMovie.movie?.title}
          </Typography>
          <Typography variant="body1">
            Număr rezervări: {mostWatchedMovie.count}
          </Typography>
        </Box>
      ) : (
        <Typography color="textSecondary">Nu există date pentru statistici.</Typography>
      )}
    </div>
  );
};

export default Statistics;