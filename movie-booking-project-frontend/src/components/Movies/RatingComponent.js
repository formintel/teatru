import React, { useState } from 'react';
import { Box, Typography, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const RatingComponent = ({ 
  averageRating, 
  totalRatings, 
  userRating, 
  onRatingChange, 
  readOnly = false 
}) => {
  const [hover, setHover] = useState(-1);

  const labels = {
    1: 'Dezamăgitor',
    2: 'Slab',
    3: 'OK',
    4: 'Bun',
    5: 'Excelent',
  };

  const getLabelText = (value) => {
    return `${value} Stea${value !== 1 ? 'le' : 'a'}, ${labels[value]}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: readOnly ? 'row' : 'column',
        gap: 1
      }}
    >
      {readOnly ? (
        // Display mode (for cards)
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon sx={{ color: '#f5c518' }} />
          <Typography variant="body1" fontWeight="bold">
            {averageRating.toFixed(1)}/5
          </Typography>
          {totalRatings > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({totalRatings})
            </Typography>
          )}
        </Box>
      ) : (
        // Interactive mode (for details page)
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography component="legend">Evaluează acest spectacol</Typography>
            {userRating > 0 && (
              <Typography variant="body2" color="text.secondary">
                (Evaluarea ta: {userRating}/5)
              </Typography>
            )}
          </Box>
          <Rating
            name="movie-rating"
            value={userRating}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              onRatingChange(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarBorderIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {!readOnly && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {labels[hover !== -1 ? Math.ceil(hover) : Math.ceil(userRating)]}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RatingComponent; 