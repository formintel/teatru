export const theaterConfig = {
  sections: [
    {
      name: "Scena",
      rows: 2,
      seatsPerRow: 10,
      startSeatNumber: 1,
      priceMultiplier: 1.2
    },
    {
      name: "Parter",
      rows: 5,
      seatsPerRow: 12,
      startSeatNumber: 21,
      priceMultiplier: 1.0
    },
    {
      name: "Balcon",
      rows: 3,
      seatsPerRow: 8,
      startSeatNumber: 81,
      priceMultiplier: 0.8
    }
  ],
  totalSeats: 0, // Will be calculated based on sections
  getSeatInfo: function(seatNumber) {
    let currentSeat = 0;
    for (const section of this.sections) {
      const sectionSeats = section.rows * section.seatsPerRow;
      if (seatNumber >= section.startSeatNumber && 
          seatNumber < section.startSeatNumber + sectionSeats) {
        const row = Math.floor((seatNumber - section.startSeatNumber) / section.seatsPerRow) + 1;
        const seatInRow = ((seatNumber - section.startSeatNumber) % section.seatsPerRow) + 1;
        return {
          section: section.name,
          row,
          seatInRow,
          priceMultiplier: section.priceMultiplier
        };
      }
      currentSeat += sectionSeats;
    }
    return null;
  }
};

// Calculate total seats
theaterConfig.totalSeats = theaterConfig.sections.reduce((total, section) => {
  return total + (section.rows * section.seatsPerRow);
}, 0); 