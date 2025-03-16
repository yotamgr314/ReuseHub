// frontend/src/offers/components/ApprovalModal.js
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ApprovalModal = ({ open, onClose, offerId, onSubmitSuccess }) => {
  // State to track whether the user wants to rate this offer
  const [wantToRate, setWantToRate] = useState(false);
  // Rating values; default to 0 if user doesn’t rate
  const [ratings, setRatings] = useState({
    timeliness: 0,
    itemCondition: 0,
    descriptionAccuracy: 0,
  });

  // Toggle rating section (accordion)
  const handleRatingChange = (key) => (event, newValue) => {
    setRatings((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleRadioChange = (event) => {
    setWantToRate(event.target.value === 'yes');
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      // Build the body. If user does not want to rate, ratings will be zeros.
      const bodyToSend = {
        adOwnerApproval: true,
        ratings: ratings,
      };

      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyToSend),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve offer with rating');
      }
      onSubmitSuccess(data);
      onClose();
    } catch (error) {
      console.error('Error confirming approval:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Are you sure you wish to approve this offer?
        </Typography>
        <Typography variant="body2" gutterBottom>
          Once it's approved, this offer will be auto-deleted as well as your Ad.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Would you like to rate this offer?
          </Typography>
          <RadioGroup row onChange={handleRadioChange} defaultValue="no">
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Box>

        {/* Show rating section if user chooses "Yes" */}
        {wantToRate && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Rate this Offer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                Timeliness
              </Typography>
              <Slider
                value={ratings.timeliness}
                onChange={handleRatingChange('timeliness')}
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                Item Condition
              </Typography>
              <Slider
                value={ratings.itemCondition}
                onChange={handleRatingChange('itemCondition')}
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                Description Accuracy
              </Typography>
              <Slider
                value={ratings.descriptionAccuracy}
                onChange={handleRatingChange('descriptionAccuracy')}
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </AccordionDetails>
          </Accordion>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          fullWidth
          sx={{ mt: 3 }}
        >
          Confirm Offer Approval
        </Button>
      </Box>
    </Modal>
  );
};

export default ApprovalModal;
