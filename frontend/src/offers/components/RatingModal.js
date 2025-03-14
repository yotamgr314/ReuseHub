import React, { useState } from 'react';
import { Modal, Box, Typography, Slider, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const RatingModal = ({ open, onClose, offerId, onSubmitSuccess }) => {
  const [ratings, setRatings] = useState({
    timeliness: 3,
    itemCondition: 3,
    descriptionAccuracy: 3,
  });

  const handleSliderChange = (key) => (event, newValue) => {
    setRatings((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offerId, ratings }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit rating");
      }
      onSubmitSuccess(data);
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating: " + error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Rate the Offer
        </Typography>
        <Typography gutterBottom>Timeliness</Typography>
        <Slider
          value={ratings.timeliness}
          onChange={handleSliderChange('timeliness')}
          aria-labelledby="timeliness-slider"
          valueLabelDisplay="auto"
          min={1}
          max={5}
        />
        <Typography gutterBottom>Item Condition</Typography>
        <Slider
          value={ratings.itemCondition}
          onChange={handleSliderChange('itemCondition')}
          aria-labelledby="item-condition-slider"
          valueLabelDisplay="auto"
          min={1}
          max={5}
        />
        <Typography gutterBottom>Description Accuracy</Typography>
        <Slider
          value={ratings.descriptionAccuracy}
          onChange={handleSliderChange('descriptionAccuracy')}
          aria-labelledby="description-accuracy-slider"
          valueLabelDisplay="auto"
          min={1}
          max={5}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
        >
          Submit Rating
        </Button>
      </Box>
    </Modal>
  );
};

export default RatingModal;
