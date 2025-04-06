import React, { useState, useEffect } from "react";
import { Typography, Box, Paper } from "@mui/material";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const SeatSelection = ({ movie, showTimeId, onSeatSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the selected showtime
  const selectedShowTime = movie?.showTimes?.find((st) => st._id === showTimeId);

  useEffect(() => {
    if (!showTimeId || !movie?._id) return;

    setLoading(true);

    const fetchOccupiedSeats = async () => {
      try {
        const response = await fetch(
          `/booking/occupied-seats?movieId=${movie._id}&showTimeId=${showTimeId}`
        );
        if (!response.ok) throw new Error("Nu s-au putut încărca locurile ocupate");

        const data = await response.json();
        setOccupiedSeats(data.occupiedSeats || []);
        setLoading(false);
      } catch (err) {
        console.error("Eroare la încărcarea locurilor ocupate:", err);
        setError("Nu s-au putut încărca locurile ocupate");
        setLoading(false);
      }
    };

    fetchOccupiedSeats();
  }, [showTimeId, movie?._id]);

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return; // Blochează selectarea locurilor ocupate

    setSelectedSeat(seatNumber);
    if (onSeatSelect) onSeatSelect(seatNumber);
  };

  // Generate the seating chart based on the room capacity
  const generateSeatingChart = () => {
    if (!movie) return null;

    // Define the sections based on the seating chart in the image
    const sections = [
      { id: "parter", label: "PARTER", rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N"] },
      { id: "balcon", label: "BALCON", rows: ["O", "P"] },
    ];

    // Configure seats per row (reduced gaps, more compact)
    const seatsPerRow = {
      parter: {
        A: 23, // 23 seats
        B: 23, // 23 seats
        C: 9,  // 9 seats (3 groups of 3)
        D: 6,  // 6 seats (2 groups of 3)
        E: 6,  // 6 seats (2 groups of 3)
        F: 21, // 21 seats
        G: 21, // 21 seats
        H: 21, // 21 seats
        I: 10, // 10 seats (2 groups of 5)
        K: 10, // 10 seats (2 groups of 5)
        L: 14, // 14 seats (2 groups of 7)
        M: 14, // 14 seats (2 groups of 7)
        N: 14, // 14 seats (2 groups of 7)
      },
      balcon: {
        O: 8,  // 8 seats
        P: 13, // 13 seats
      },
    };

    // Calculate seat numbers
    let seatCounter = 1;
    const rowSeats = {};

    sections.forEach((section) => {
      section.rows.forEach((row) => {
        rowSeats[row] = [];
        const seatsInRow = seatsPerRow[section.id][row];

        for (let i = 0; i < seatsInRow; i++) {
          rowSeats[row].push({
            seatNumber: seatCounter,
            status: occupiedSeats.includes(seatCounter) ? "occupied" : "available",
          });
          seatCounter++;
        }
      });
    });

    return (
      <Box sx={{ mt: 4, width: "100%", overflowX: "auto", px: { xs: 1, sm: 2 } }}>
        {/* Scena */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "lightgray",
            p: 1,
            mb: 2,
            textAlign: "center",
            width: { xs: "100%", sm: "80%", md: "60%" },
            mx: "auto",
            fontSize: { xs: "0.8rem", sm: "1rem" },
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            SCENA
          </Typography>
        </Paper>

        {sections.map((section) => (
          <Box key={section.id} sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "lightgray",
                p: 1,
                mb: 2,
                textAlign: "center",
                width: { xs: "100%", sm: "50%" },
                mx: "auto",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {section.label}
              </Typography>
            </Paper>

            {section.rows.map((row) => (
              <Box
                key={row}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    minWidth: { xs: 20, sm: 30 },
                    textAlign: "center",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  {row}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    flex: 1,
                    gap: { xs: 0.5, sm: 1 },
                  }}
                >
                  {rowSeats[row].map((seat) => (
                    <Box
                      key={`${section.id}-${row}-${seat.seatNumber}`}
                      sx={{
                        width: { xs: 20, sm: 30 },
                        height: { xs: 20, sm: 30 },
                        borderRadius: "50%",
                        bgcolor:
                          selectedSeat === seat.seatNumber
                            ? "primary.main" // Loc selectat
                            : seat.status === "occupied"
                            ? "grey.600" // Loc ocupat (gri închis)
                            : "lightgray", // Loc disponibil
                        m: { xs: 0.3, sm: 0.5 },
                        cursor: seat.status === "occupied" ? "not-allowed" : "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor:
                            seat.status === "occupied" ? "grey.600" : "primary.light",
                          transform: seat.status === "occupied" ? "none" : "scale(1.1)",
                        },
                      }}
                      onClick={() =>
                        seat.status !== "occupied" && handleSeatClick(seat.seatNumber)
                      }
                    />
                  ))}
                </Box>
                <Typography
                  sx={{
                    minWidth: { xs: 20, sm: 30 },
                    textAlign: "center",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  {row}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {loading ? (
        <Typography variant="h6">Încărcare locuri...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Selectați un loc pentru filmul {movie.title} la{" "}
            {selectedShowTime?.dateTime
              ? format(new Date(selectedShowTime.dateTime), "dd MMM yyyy, HH:mm", {
                  locale: ro,
                })
              : "Data indisponibilă"}
          </Typography>
          {generateSeatingChart()}
        </>
      )}
    </Box>
  );
};

export default SeatSelection;