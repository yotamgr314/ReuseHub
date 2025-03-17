import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AdModalDisplay = ({ selectedAd, onClose }) => {
  const [message, setMessage] = useState(""); // Chat message input
  const [itemCount, setItemCount] = useState(1); // New state: number of items to donate/claim
  const [currentUserId, setCurrentUserId] = useState(null); // Current user id state

  // Fetch the current user's ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUserId(user.id);
    }
  }, []);

  if (!selectedAd || !currentUserId) return null; // Ensure both selectedAd and currentUserId exist

  // Check if the current user is the owner of the ad
  const isAdOwner = selectedAd.createdBy._id === currentUserId;

  const handleSendOffer = async () => {
    // Validate itemCount
    if (!itemCount || isNaN(itemCount) || itemCount < 1) {
      alert("Please enter a valid number of items.");
      return;
    }

    try {
      const token = localStorage.getItem("TOKEN");
      const response = await fetch("https://reusehub-h9o5.onrender.com/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adId: selectedAd._id,
          offerAmount: parseInt(itemCount, 10),
          message, // Attach initial chat message
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send offer.");
      alert("Offer sent successfully!");
      onClose();
    } catch (error) {
      alert(`Error sending offer: ${error.message}`);
    }
  };

  return (
    <Modal open={Boolean(selectedAd)} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, // Increased modal width for a larger display
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ position: "relative", p: 3 }}>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {selectedAd.adTitle}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              {selectedAd.adDescription}
            </Typography>

            {selectedAd.kind === "donationAd" &&
              selectedAd.items?.images?.length > 0 && (
                <ImageList
                  cols={selectedAd.items.images.length > 1 ? 2 : 1}
                  rowHeight={140}
                  sx={{ mb: 2 }}
                >
                  {selectedAd.items.images.map((imgUrl, index) => {
                    const imageUrl = imgUrl.startsWith("http")
                      ? imgUrl
                      : `https://reusehub-h9o5.onrender.com${imgUrl}`;
                    return (
                      <ImageListItem key={index}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={imageUrl}
                          alt={`Ad Image ${index}`}
                          sx={{ borderRadius: 2 }}
                        />
                      </ImageListItem>
                    );
                  })}
                </ImageList>
              )}

            {/* Chat Message Input */}
            {!isAdOwner && (
              <TextField
                label="Message to Receiver"
                variant="outlined"
                fullWidth
                multiline
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
                minRows={4} // Fixed number of rows
                maxRows={4} // Fixed number of rows
                inputProps={{
                  style: {
                    overflowY: "auto", // Show vertical scrollbar when content exceeds 4 rows
                    resize: "none", // Disable manual resizing
                  },
                }}
              />
            )}

            {/* New: Input for the number of items */}
            {!isAdOwner && (
              <TextField
                label="Number of Items"
                variant="outlined"
                type="number"
                fullWidth
                value={itemCount}
                onChange={(e) => setItemCount(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
              />
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Category:</strong> {selectedAd.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Ad Amount:</strong> {selectedAd.amount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Item:</strong> {selectedAd.items?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Item Description:</strong>{" "}
                  {selectedAd.items?.description || "N/A"}
                </Typography>
              </Grid>

              {selectedAd.kind === "donationAd" ? (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Condition:</strong>{" "}
                      {selectedAd.itemCondition || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Method:</strong>{" "}
                      {selectedAd.donationMethod || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedAd.adStatus}
                    </Typography>
                  </Grid>
                  {!isAdOwner && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSendOffer}
                      >
                        Send a Claim Request
                      </Button>
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Urgency:</strong> {selectedAd.urgency}
                    </Typography>
                  </Grid>
                  {!isAdOwner && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={handleSendOffer}
                      >
                        Offer to Donate
                      </Button>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default AdModalDisplay;
